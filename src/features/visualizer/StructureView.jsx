/**
 * StructureView — looks at one recorded value and picks the right drawing.
 *
 * All the deciding happens in detectShape.js; this is only the switchboard.
 * Adding a new kind of picture means adding a case here and a file in views/.
 */

import { SHAPE, detectShape } from "./detectShape.js";
import { ArrayView } from "./views/ArrayView.jsx";
import { KeyValueView } from "./views/KeyValueView.jsx";
import { LinkedListView } from "./views/LinkedListView.jsx";
import { MatrixView } from "./views/MatrixView.jsx";
import { TreeView } from "./views/TreeView.jsx";

export function StructureView({ value, previousValue, pointers }) {
  switch (detectShape(value)) {
    case SHAPE.ARRAY:
      return (
        <ArrayView
          value={value}
          previousValue={previousValue}
          pointers={pointers}
        />
      );

    case SHAPE.MATRIX:
      return <MatrixView value={value} previousValue={previousValue} />;

    case SHAPE.LINKED_LIST:
      return <LinkedListView value={value} />;

    case SHAPE.TREE:
      return <TreeView value={value} />;

    case SHAPE.MAP:
    case SHAPE.SET:
    case SHAPE.OBJECT:
      return <KeyValueView value={value} previousValue={previousValue} />;

    default:
      return null;
  }
}
