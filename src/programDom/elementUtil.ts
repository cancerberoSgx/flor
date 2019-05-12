import { Node } from '../dom'
import { ProgramDocument } from './programDocument'
import { ProgramElement } from './programElement'
import { ElementProps } from './types'

export function isElement(n: any): n is ProgramElement {
  return n && n.nodeType === Node.ELEMENT_NODE && n.props
}

export function isDocument(n: any): n is ProgramDocument {
  return n && n.nodeType === Node.DOCUMENT_TYPE_NODE && isElement(n.body)
}

export function isElementProps(e: any): e is ElementProps {
  return e && e._data
}

export function isVisible(e: ProgramElement): boolean {
  throw new Error('not implemented')
}

export function isAttached(e: ProgramElement): boolean {
  throw new Error('not implemented')
}

export interface Rectangle {
  xi: number, yi: number, yl: number, xl: number
}
type R = Rectangle
export function rectangleIntersects(a: R, b: R) {
  return (a.xi <= b.xl &&
            b.xi <= a.xl &&
            a.yi <= b.yl &&
            b.yi <= a.yl)
}

export function rectanglePlusOffsets(r: R,xOffset= 0, yOffset= 0) {
  return { yi: r.yi + yOffset, yl: r.yl + yOffset, xi: r.xi + xOffset, xl: r.xl + xOffset }
}
  // // function intersectRect(r1, r2) {
  //   return !(r2.xi > r1.xl ||
  //            r2.xl < r1.xi ||
  //            r2.yi > r1.yl ||
  //            r2.yl < r1.yi)
  // }
  // function intersectRect(r1, r2) {
  //   return !(r2.left > r1.right ||
  //            r2.right < r1.left ||
  //            r2.top > r1.bottom ||
  //            r2.bottom < r1.top);
  // }
// isContained(c: ProgramElement, e: ProgramElement, ratio: number) {
//   return this.yOffset + e.absoluteTop - ratio <= c.absoluteTop && c.absoluteTop + c.props.height - ratio <= this.yOffset + e.absoluteTop + e.props.height
// }
