/**
 * Just another representation for a rectangle so different APIs can use it directly.
 */
export interface Rectangle_LTBR {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

export interface Rectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function rectangleIntersects(a: Rectangle_LTBR, b: Rectangle_LTBR) {
  return (a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom);
}

export function rectanglePlusOffsets(r: Rectangle_LTBR, xOffset = 0, yOffset = 0) : Rectangle_LTBR{
  return { top: r.top + yOffset, bottom: r.bottom + yOffset, left: r.left + xOffset, right: r.right + xOffset }
}