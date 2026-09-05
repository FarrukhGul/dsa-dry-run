/**
 * instrument.js — rewrites your JavaScript so that it reports on itself.
 *
 * THE WHOLE IDEA IN ONE EXAMPLE
 *
 * You write this:
 *
 *     function twoSum(nums, target) {
 *       let sum = 0;
 *       return sum;
 *     }
 *
 * We hand the engine this:
 *
 *     function twoSum(nums, target) {
 *       __dryRun__.enter("twoSum", 1);
 *       try {
 *         __dryRun__.step(2, { nums: () => nums, target: () => target });
 *         let sum = 0;
 *         __dryRun__.step(3, { nums: () => nums, target: () => target, sum: () => sum });
 *         return __dryRun__.ret(3, sum);
 *       } finally {
 *         __dryRun__.exit();
 *       }
 *     }
 *
 * Then we run it. Your code does exactly what it always did — it just calls out
 * to us before every line, and we write down what everything was worth at that
 * moment. Stack those notes up and you have a dry run.
 *
 * WHY THE VARIABLES ARE WRAPPED IN ARROWS
 *
 * `{ sum: () => sum }` rather than `{ sum: sum }`. Two reasons. Reading a `let`
 * before its declaration line is an error in JavaScript, so we need to be able
 * to catch that per-variable rather than losing the whole snapshot. And an
 * object getter could throw. The arrow lets the recorder try each name inside
 * its own try/catch.
 *
 * WHY NOT GENERATORS
 *
 * The obvious design is to turn every function into a generator that pauses on
 * each line. It is also a trap: `arr.sort(compare)` would hand `sort` a
 * generator, which returns an iterator instead of a number, and the sort would
 * silently produce nonsense. Since we record the whole trace up front and let
 * you scrub through it afterwards, we never need to pause mid-run — so plain
 * function calls do the job, and every callback keeps working normally.
 */

import { parse } from "acorn";
import { generate } from "astring";

/**
 * The name of the recorder object inside the rewritten code.
 *
 * It is passed in as a function parameter rather than left as a global, so
 * nothing your code does to the global scope can reach or replace it.
 */
export const RUNTIME_NAME = "__dryRun__";

/**
 * Rewrites source code into its self-reporting version.
 *
 * @param {string} source the code as typed
 * @returns {string} the rewritten code
 * @throws {SyntaxError} if the code does not parse — the caller reports it
 */
export function instrumentJavaScript(source) {
  const program = parse(source, {
    ecmaVersion: "latest",
    locations: true,
    // "script", not "module": the code runs inside a function body, where
    // import and export are not allowed anyway.
    sourceType: "script",
  });

  const topScope = createScope(null);
  hoistDeclarations(program.body, topScope);
  program.body = instrumentStatements(program.body, topScope);

  return generate(program);
}

/* =========================================================================
 * Scopes — working out which variables exist at each line
 *
 * To show a variables panel we need to know, for any given line, which names
 * are in scope. JavaScript's rules here are small but fiddly:
 *
 *   `var` and functions are HOISTED — usable anywhere in the function, even
 *   above where they are written.
 *
 *   `let` and `const` are not. They exist only from their own line onward.
 *
 * So we hoist the first group up front, and add the second group as we walk
 * past their declarations.
 * ====================================================================== */

function createScope(parent) {
  return { parent, names: new Set() };
}

/** Every name visible from this scope, including everything it inherits. */
function visibleNames(scope) {
  const names = [];
  const seen = new Set();

  for (let current = scope; current; current = current.parent) {
    for (const name of current.names) {
      // An inner variable of the same name shadows the outer one. We walk
      // inward-out, so the first spelling of a name wins.
      if (!seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
    }
  }

  return names;
}

/**
 * Finds the `var` and function declarations anywhere in a list of statements
 * and adds them to the scope immediately, because that is what JavaScript
 * does with them.
 *
 * It deliberately does not descend into nested functions — those names belong
 * to their own scope, not this one.
 */
function hoistDeclarations(statements, scope) {
  for (const statement of statements) {
    hoistFrom(statement, scope);
  }
}

function hoistFrom(node, scope) {
  if (!node || typeof node.type !== "string") return;

  if (isFunctionNode(node)) return; // a different scope's business

  if (node.type === "FunctionDeclaration" && node.id) {
    scope.names.add(node.id.name);
    return;
  }

  if (node.type === "VariableDeclaration" && node.kind === "var") {
    for (const declarator of node.declarations) {
      collectPatternNames(declarator.id, scope.names);
    }
  }

  for (const child of childNodes(node)) {
    hoistFrom(child, scope);
  }
}

/**
 * Pulls every name out of a binding position.
 *
 * Handles the destructuring forms, so `const [head, ...rest] = list` and
 * `function f({ left, right })` both name their variables properly.
 */
function collectPatternNames(pattern, into) {
  if (!pattern) return;

  switch (pattern.type) {
    case "Identifier":
      into.add(pattern.name);
      break;

    case "ObjectPattern":
      for (const property of pattern.properties) {
        // `{ a, ...rest }` — a Property, then a RestElement.
        collectPatternNames(property.value ?? property.argument, into);
      }
      break;

    case "ArrayPattern":
      for (const element of pattern.elements) {
        collectPatternNames(element, into);
      }
      break;

    case "AssignmentPattern": // a default value, as in `function f(n = 0)`
      collectPatternNames(pattern.left, into);
      break;

    case "RestElement":
      collectPatternNames(pattern.argument, into);
      break;

    default:
      break;
  }
}

/* =========================================================================
 * The rewrite itself
 * ====================================================================== */

/**
 * Rewrites a list of statements, slipping a `step` call in front of each one.
 *
 * @returns {Array} the new list — longer than the one that went in
 */
function instrumentStatements(statements, scope) {
  const output = [];

  for (const statement of statements) {
    // Function declarations are hoisted: by the time the program reaches this
    // line the function already exists, so a step here would report a line
    // that never really "runs". We rewrite its body but announce nothing.
    if (statement.type === "FunctionDeclaration") {
      rewriteFunction(statement, scope);
      output.push(statement);
      continue;
    }

    output.push(makeStepCall(lineOf(statement), visibleNames(scope)));
    output.push(rewriteStatement(statement, scope));

    // `let`/`const`/`class` come into scope only now, after their own line.
    declareAfterStatement(statement, scope);
  }

  return output;
}

function declareAfterStatement(statement, scope) {
  if (statement.type === "VariableDeclaration") {
    for (const declarator of statement.declarations) {
      collectPatternNames(declarator.id, scope.names);
    }
    return;
  }

  if (statement.type === "ClassDeclaration" && statement.id) {
    scope.names.add(statement.id.name);
  }
}

/**
 * Rewrites one statement.
 *
 * Statements that contain other statements (blocks, loops, if, try) get their
 * insides rewritten. Everything else is scanned for functions hiding in its
 * expressions — a callback passed to `sort`, for instance.
 */
function rewriteStatement(statement, scope) {
  switch (statement.type) {
    case "BlockStatement": {
      // A block is a new scope, but only for `let` and `const`. Anything
      // hoisted already landed in the enclosing function's scope.
      const blockScope = createScope(scope);
      statement.body = instrumentStatements(statement.body, blockScope);
      return statement;
    }

    case "IfStatement":
      rewriteExpressions(statement.test, scope);
      statement.consequent = rewriteAsBlock(statement.consequent, scope);
      if (statement.alternate) {
        statement.alternate =
          statement.alternate.type === "IfStatement"
            ? rewriteStatement(statement.alternate, scope) // `else if`
            : rewriteAsBlock(statement.alternate, scope);
      }
      return statement;

    case "ForStatement": {
      // `for (let i = 0; ...)` — `i` belongs to the loop, not to the code
      // around it, so the loop gets its own scope.
      const loopScope = createScope(scope);

      if (statement.init) {
        rewriteExpressions(statement.init, loopScope);
        declareAfterStatement(statement.init, loopScope);
      }
      rewriteExpressions(statement.test, loopScope);
      rewriteExpressions(statement.update, loopScope);

      statement.body = rewriteAsBlock(statement.body, loopScope);
      return statement;
    }

    case "ForInStatement":
    case "ForOfStatement": {
      const loopScope = createScope(scope);

      rewriteExpressions(statement.right, scope);
      if (statement.left.type === "VariableDeclaration") {
        declareAfterStatement(statement.left, loopScope);
      } else {
        rewriteExpressions(statement.left, loopScope);
      }

      statement.body = rewriteAsBlock(statement.body, loopScope);
      return statement;
    }

    case "WhileStatement":
    case "DoWhileStatement":
      rewriteExpressions(statement.test, scope);
      statement.body = rewriteAsBlock(statement.body, scope);
      return statement;

    case "SwitchStatement": {
      rewriteExpressions(statement.discriminant, scope);
      const switchScope = createScope(scope);

      for (const switchCase of statement.cases) {
        rewriteExpressions(switchCase.test, switchScope);
        switchCase.consequent = instrumentStatements(
          switchCase.consequent,
          switchScope,
        );
      }
      return statement;
    }

    case "TryStatement": {
      statement.block = rewriteStatement(statement.block, scope);

      if (statement.handler) {
        // The caught error is a variable too — `catch (error)`.
        const catchScope = createScope(scope);
        collectPatternNames(statement.handler.param, catchScope.names);
        statement.handler.body = rewriteStatement(
          statement.handler.body,
          catchScope,
        );
      }

      if (statement.finalizer) {
        statement.finalizer = rewriteStatement(statement.finalizer, scope);
      }
      return statement;
    }

    case "LabeledStatement":
      statement.body = rewriteStatement(statement.body, scope);
      return statement;

    case "ReturnStatement":
      rewriteExpressions(statement.argument, scope);
      // Wrap the returned value so we can record what came back.
      statement.argument = makeReturnCall(
        lineOf(statement),
        statement.argument,
      );
      return statement;

    default:
      rewriteExpressions(statement, scope);
      return statement;
  }
}

/**
 * Makes sure a body is a block, then rewrites it.
 *
 * `if (x) doThing();` has a single statement where a block would go, and
 * `while (true);` has nothing at all. Both become `{ … }` so there is somewhere
 * to put a step call — which is also what stops `while (true);` from hanging
 * forever, since without a step inside it we would never notice.
 */
function rewriteAsBlock(body, scope) {
  const block =
    body.type === "BlockStatement"
      ? body
      : {
          type: "BlockStatement",
          body: body.type === "EmptyStatement" ? [] : [body],
          loc: body.loc,
        };

  // An empty loop body still needs one step, or a spinning loop is invisible.
  if (block.body.length === 0) {
    return {
      type: "BlockStatement",
      body: [makeStepCall(lineOf(body), visibleNames(scope))],
    };
  }

  return rewriteStatement(block, scope);
}

/**
 * Walks through an expression looking for functions defined inside it, and
 * rewrites those. Everything else in an expression is left exactly as written.
 */
function rewriteExpressions(node, scope) {
  if (!node || typeof node.type !== "string") return;

  if (isFunctionNode(node)) {
    rewriteFunction(node, scope);
    return; // its insides are handled by rewriteFunction
  }

  for (const child of childNodes(node)) {
    rewriteExpressions(child, scope);
  }
}

/**
 * Rewrites a function so it announces when it is entered and left.
 *
 * The body goes inside `try { … } finally { exit() }` so the call stack stays
 * correct even when the function throws or returns early. Without the
 * `finally`, one thrown error would leave a phantom frame on the stack for the
 * rest of the run.
 */
function rewriteFunction(node, parentScope) {
  const scope = createScope(parentScope);

  for (const param of node.params) {
    collectPatternNames(param, scope.names);
  }

  // A concise arrow like `n => n * 2` has an expression where its body should
  // be. Give it a real block containing a return, so there is room to record.
  if (node.type === "ArrowFunctionExpression" && node.expression) {
    node.body = {
      type: "BlockStatement",
      body: [
        {
          type: "ReturnStatement",
          argument: node.body,
          loc: node.body.loc,
        },
      ],
      loc: node.body.loc,
    };
    node.expression = false;
  }

  // Grab the parameter names before anything else is declared, so the "called
  // with…" entry shows the arguments and nothing else.
  const parameterNames = [...scope.names];

  hoistDeclarations(node.body.body, scope);
  const body = instrumentStatements(node.body.body, scope);

  node.body.body = [
    makeEnterCall(functionNameOf(node), lineOf(node), parameterNames),
    {
      type: "TryStatement",
      block: { type: "BlockStatement", body },
      handler: null,
      finalizer: { type: "BlockStatement", body: [makeExitCall()] },
    },
  ];
}

/** A readable name for the call stack. */
function functionNameOf(node) {
  if (node.id?.name) return node.id.name;
  if (node.type === "ArrowFunctionExpression") return "(arrow function)";
  return "(anonymous function)";
}

/* =========================================================================
 * Building the calls we inject
 *
 * These construct little pieces of syntax tree by hand. They are wordy but
 * completely mechanical — each one builds exactly the code shown in its
 * comment.
 * ====================================================================== */

/** `__dryRun__.step(LINE, { a: () => a, b: () => b });` */
function makeStepCall(line, names) {
  return expressionStatement(
    callRuntime("step", [numberLiteral(line), makeLocalsObject(names)]),
  );
}

/** `{ a: () => a, b: () => b }` */
function makeLocalsObject(names) {
  return {
    type: "ObjectExpression",
    properties: names.map((name) => ({
      type: "Property",
      kind: "init",
      method: false,
      shorthand: false,
      computed: false,
      key: identifier(name),
      value: {
        type: "ArrowFunctionExpression",
        id: null,
        params: [],
        body: identifier(name),
        expression: true,
        async: false,
        generator: false,
      },
    })),
  };
}

/**
 * `__dryRun__.enter("name", LINE, { n: () => n });`
 *
 * The parameters are passed along so the call is recorded as "twoSum called
 * with nums = […], target = 9" rather than as an empty frame.
 */
function makeEnterCall(name, line, parameterNames) {
  return expressionStatement(
    callRuntime("enter", [
      stringLiteral(name),
      numberLiteral(line),
      makeLocalsObject(parameterNames),
    ]),
  );
}

/** `__dryRun__.exit();` */
function makeExitCall() {
  return expressionStatement(callRuntime("exit", []));
}

/** `__dryRun__.ret(LINE, value)` — an expression, not a statement. */
function makeReturnCall(line, argument) {
  const args = [numberLiteral(line)];
  // A bare `return;` has no argument. Passing none lets the recorder tell
  // "returned nothing" apart from "returned undefined".
  if (argument) args.push(argument);

  return callRuntime("ret", args);
}

function callRuntime(method, args) {
  return {
    type: "CallExpression",
    optional: false,
    callee: {
      type: "MemberExpression",
      computed: false,
      optional: false,
      object: identifier(RUNTIME_NAME),
      property: identifier(method),
    },
    arguments: args,
  };
}

function expressionStatement(expression) {
  return { type: "ExpressionStatement", expression };
}

function identifier(name) {
  return { type: "Identifier", name };
}

function numberLiteral(value) {
  return { type: "Literal", value, raw: String(value) };
}

function stringLiteral(value) {
  return { type: "Literal", value, raw: JSON.stringify(value) };
}

/* =========================================================================
 * Small helpers
 * ====================================================================== */

function isFunctionNode(node) {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  );
}

/** The line a node starts on. Acorn gives us this because of `locations: true`. */
function lineOf(node) {
  return node?.loc?.start?.line ?? 0;
}

/**
 * Every child node of a syntax tree node.
 *
 * The tree is plain objects and arrays, so rather than listing the child
 * fields of all sixty-odd node types, we look at every property and keep the
 * ones that look like nodes.
 */
function* childNodes(node) {
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "type") continue;

    const value = node[key];
    if (!value || typeof value !== "object") continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item.type === "string") yield item;
      }
    } else if (typeof value.type === "string") {
      yield value;
    }
  }
}
