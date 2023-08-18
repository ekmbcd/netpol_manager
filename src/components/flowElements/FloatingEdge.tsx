import { useCallback } from "react";
import { BaseEdge, getBezierPath, useStore } from "reactflow";
import { useClusterStore } from "../../store/clusterStore";
import { CustomNode } from "../../types";
import { getEdgeParams } from "../../utils/floatingEdges";

type FloatingEdgeProps = {
  id: string;
  source: string;
  target: string;
  markerEnd?: string;
  style?: React.CSSProperties;
};

function getStyle(
  hoveredNode: string | null,
  sourceNode: string,
  targetNode: string
) {
  if (!hoveredNode) {
    return {};
  }
  if (hoveredNode === sourceNode) {
    return {
      stroke: "blue",
      strokeWidth: 2,
    };
  } else if (hoveredNode === targetNode) {
    return {
      stroke: "green",
      strokeWidth: 2,
    };
  } else {
    return {
      opacity: 0.2,
    };
  }
}

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
}: FloatingEdgeProps) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );
  const hoveredNode = useClusterStore((state) => state.hoveredNode);

  if (
    !sourceNode ||
    !targetNode ||
    !sourceNode.positionAbsolute ||
    !targetNode.positionAbsolute
  ) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(
    sourceNode as CustomNode,
    targetNode as CustomNode
  );

  // TODO: can we make it better?
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
    curvature: 0,
  });

  // const edgePath = `M ${sx} ${sy} Q ${sx + 40} ${sy + 40 + 25} ${tx} ${ty}`;

  return (
    <BaseEdge
      id={id}
      markerEnd={markerEnd}
      style={{
        ...style,
        ...getStyle(hoveredNode, source, target),
        transition: "all 0.3s ease-in-out",
      }}
      path={edgePath}
    />
  );
}

export default FloatingEdge;
