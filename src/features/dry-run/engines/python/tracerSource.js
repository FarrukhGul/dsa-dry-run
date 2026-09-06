/**
 * tracerSource.js — the Python half of the Python engine.
 *
 * WHY THIS IS A STRING IN A .js FILE
 *
 * It would be nicer as a real .py file, and Vite can import one as raw text.
 * But the test script runs under plain Node, where that import does not exist,
 * and an engine I cannot run tests against is an engine I cannot trust. A
 * string works in both, so this is the version that gets verified.
 *
 * HOW THE PYTHON SIDE WORKS
 *
 * JavaScript rewrites your code to make it report on itself. Python does not
 * need that: `sys.settrace` asks the interpreter to call us before every line,
 * handing over the frame — which carries the line number and every local
 * variable. It is the same notebook, filled in by CPython rather than by code
 * we injected.
 *
 * It writes exactly the same trace shape as the JavaScript engine, so the
 * whole visualiser — arrays, linked lists, trees, the call stack, the
 * narration — works on Python with no changes at all. That shared format is
 * why adding a language is mostly writing a recorder.
 */

export const PYTHON_TRACER = `
import json, sys, time


class _Stopped(Exception):
    """Raised when a limit is hit. Not a bug in the user's code."""

    def __init__(self, reason):
        self.reason = reason


def _dry_run(source, limits, record):
    max_steps = limits["maxSteps"]
    max_ms = limits["maxMilliseconds"]
    max_depth = limits["maxCallDepth"]
    max_items = limits["maxValueItems"]
    max_value_depth = limits["maxValueDepth"]
    max_nodes = limits["maxValueNodes"]
    max_string = limits["maxStringLength"]
    max_output = limits["maxOutputLines"]

    steps = []
    output = []
    stack = []
    counter = {"steps": 0}
    started = time.time()
    truncated_output = {"done": False}

    # ---- copying a value into a frozen description -------------------
    # Deliberately the same shapes the JavaScript engine produces, so every
    # view in the visualiser works on both languages.

    def snapshot(value, depth, seen, budget):
        if value is None:
            return {"kind": "null"}

        # bool before int: in Python, True IS an int.
        if value is True or value is False:
            return {"kind": "boolean", "value": value}

        if isinstance(value, int):
            return {"kind": "number", "value": value}

        if isinstance(value, float):
            if value != value:
                return {"kind": "number", "value": None, "label": "nan"}
            if value == float("inf") or value == float("-inf"):
                return {"kind": "number", "value": None, "label": str(value)}
            return {"kind": "number", "value": value}

        if isinstance(value, str):
            if len(value) > max_string:
                return {
                    "kind": "string",
                    "value": value[:max_string],
                    "truncated": True,
                    "length": len(value),
                }
            return {"kind": "string", "value": value}

        if callable(value):
            return {"kind": "function", "name": getattr(value, "__name__", "(anonymous)")}

        marker = id(value)

        # Already being described further up this branch: a cycle.
        if marker in seen:
            return {"kind": "circular"}

        if depth >= max_value_depth or budget["left"] <= 0:
            return {"kind": "truncated", "label": type(value).__name__}

        budget["left"] -= 1
        seen.add(marker)

        try:
            if isinstance(value, (list, tuple)):
                items = [snapshot(v, depth + 1, seen, budget) for v in list(value)[:max_items]]
                return {
                    "kind": "array",
                    "length": len(value),
                    "items": items,
                    "truncated": len(value) > len(items),
                }

            if isinstance(value, dict):
                entries = []
                for key, item in list(value.items())[:max_items]:
                    entries.append([
                        snapshot(key, depth + 1, seen, budget),
                        snapshot(item, depth + 1, seen, budget),
                    ])
                return {
                    "kind": "map",
                    "size": len(value),
                    "entries": entries,
                    "truncated": len(value) > len(entries),
                }

            if isinstance(value, (set, frozenset)):
                items = [snapshot(v, depth + 1, seen, budget) for v in list(value)[:max_items]]
                return {
                    "kind": "set",
                    "size": len(value),
                    "items": items,
                    "truncated": len(value) > len(items),
                }

            fields = getattr(value, "__dict__", None)
            if fields is not None:
                entries = [
                    [str(key), snapshot(item, depth + 1, seen, budget)]
                    for key, item in list(fields.items())[:max_items]
                ]
                return {
                    "kind": "object",
                    "className": type(value).__name__,
                    "entries": entries,
                    "truncated": len(fields) > len(entries),
                }

            return {"kind": "truncated", "label": type(value).__name__}
        finally:
            seen.discard(marker)

    def read_locals(frame):
        found = {}
        for name, value in frame.f_locals.items():
            # Python puts __builtins__ and friends in the module frame.
            if name.startswith("__"):
                continue
            try:
                found[name] = snapshot(value, 0, set(), {"left": max_nodes})
            except Exception:
                found[name] = {"kind": "unavailable"}
        return found

    def count_work():
        counter["steps"] += 1

        if counter["steps"] > max_steps:
            raise _Stopped("step-limit")

        # The clock is cheap but not free, and this runs tens of thousands
        # of times.
        if counter["steps"] % 256 == 0:
            if (time.time() - started) * 1000 > max_ms:
                raise _Stopped("time-limit")

    def write(kind, line, extra=None):
        entry = {
            "kind": kind,
            "line": line,
            "depth": len(stack),
            "stack": [
                {"name": f["name"], "line": f["line"], "locals": f["locals"]}
                for f in stack
            ],
            "outputCount": len(output),
        }
        if extra:
            entry.update(extra)
        steps.append(entry)

    # ---- console -----------------------------------------------------

    def captured_print(*args, sep=" ", end="\\n", file=None, flush=False):
        if len(output) >= max_output:
            if not truncated_output["done"]:
                truncated_output["done"] = True
                output.append({"kind": "system", "text": "… further output was cut off"})
            return
        output.append({"kind": "log", "text": sep.join(str(a) for a in args)})

    # ---- the tracer itself -------------------------------------------

    def local_tracer(frame, event, arg):
        if event == "line":
            count_work()
            top = stack[-1]
            top["line"] = frame.f_lineno
            if record:
                top["locals"] = read_locals(frame)
                write("step", frame.f_lineno)

        elif event == "return":
            count_work()
            if stack:
                stack[-1]["line"] = frame.f_lineno
                if record:
                    write("return", frame.f_lineno, {
                        "value": snapshot(arg, 0, set(), {"left": max_nodes}),
                    })
                stack.pop()

        return local_tracer

    def global_tracer(frame, event, arg):
        # Only the user's own code, never the machinery around it.
        if frame.f_code.co_filename != "<user>":
            return None

        if event == "call":
            count_work()

            if len(stack) >= max_depth:
                raise _Stopped("depth-limit")

            name = frame.f_code.co_name
            if name == "<module>":
                name = "(main)"

            stack.append({
                "name": name,
                "line": frame.f_lineno,
                "locals": read_locals(frame) if record else {},
            })

            if record:
                write("call", frame.f_lineno)

            return local_tracer

        return None

    # ---- run it ------------------------------------------------------

    status = "completed"
    error = None

    try:
        compiled = compile(source, "<user>", "exec")
    except SyntaxError as problem:
        return {
            "status": "syntax-error",
            "steps": [],
            "output": [],
            "stepCount": 0,
            "error": {"message": problem.msg, "line": problem.lineno},
        }

    scope = {"__name__": "__main__", "print": captured_print}

    try:
        sys.settrace(global_tracer)
        exec(compiled, scope)
    except _Stopped as stopped:
        status = stopped.reason
    except BaseException as problem:
        status = "error"

        # The stack here is no use: CPython fires a "return" event for every
        # frame an exception passes through, so ours has already unwound by
        # now. The traceback still knows, though — walk it to the DEEPEST
        # frame that belongs to the user, which is where it actually broke.
        line = None
        crumb = problem.__traceback__
        while crumb is not None:
            if crumb.tb_frame.f_code.co_filename == "<user>":
                line = crumb.tb_lineno
            crumb = crumb.tb_next

        error = {
            "message": type(problem).__name__ + ": " + str(problem),
            "line": line,
        }
    finally:
        sys.settrace(None)

    return {
        "status": status,
        "steps": steps,
        "output": output,
        "stepCount": counter["steps"],
        "error": error,
    }


_result = json.dumps(_dry_run(_source, json.loads(_limits), _record))
`;
