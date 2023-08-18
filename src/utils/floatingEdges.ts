import { Position, XYPosition } from "reactflow";
import { CustomNode } from "../types";

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: CustomNode
  // sourcePoint: XYPosition
) {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;

  const intersectionNodeCenter = {
    x: intersectionNodePosition.x + intersectionNodeWidth / 2,
    y: intersectionNodePosition.y + intersectionNodeHeight / 2,
  };

  // const radius = intersectionNodeWidth / 2;

  // const dx = sourcePoint.x - intersectionNodeCenter.x;
  // const dy = sourcePoint.y - intersectionNodeCenter.y;
  // const distance = Math.sqrt(dx * dx + dy * dy);

  // const ratio = radius / distance;
  // const scaledDx = dx * ratio;
  // const scaledDy = dy * ratio;

  // const intersectionPoint = {
  //   x: intersectionNodeCenter.x + scaledDx,
  //   y: intersectionNodeCenter.y + scaledDy,
  // };

  return intersectionNodeCenter;
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: CustomNode, intersectionPoint: XYPosition) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: CustomNode, target: CustomNode) {
  const sourceIntersectionPoint = getNodeIntersection(
    source
    // target.positionAbsolute
  );
  const targetIntersectionPoint = getNodeIntersection(
    target
    // sourceIntersectionPoint
  );

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
