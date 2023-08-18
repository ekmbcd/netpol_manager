import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";

function EdgeWithLabel({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [hover, setHover] = useState(false);

  return (
    <>
      <BaseEdge path={edgePath} style={style} id={id} />
      <EdgeLabelRenderer>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="rounded-full bg-white aspect-square border border-slate-400  h-6 w-6 grid place-items-center text-slate-600 shadow"
        >
          P
        </div>
        {hover && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${
                labelY - 30
              }px)`,
            }}
            className="bg-slate-800 text-white rounded-full p-2 text-sm z-20"
          >
            {label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

export default EdgeWithLabel;
