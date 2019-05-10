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
// type R = Rectangle
// export function rectangleIntersects(r1:R, r2:R) {
//   return 
// }
// intersect(c: ProgramElement, e: ProgramElement): any {
//   return e.absoluteTop >= c.absoluteTop && c.absoluteTop <= e.absoluteTop + e.props.height || c.absoluteTop >= e.absoluteTop && e.absoluteTop <= c.absoluteTop + c.props.height
// }
// isContained(c: ProgramElement, e: ProgramElement, ratio: number) {
//   return this.yOffset + e.absoluteTop - ratio <= c.absoluteTop && c.absoluteTop + c.props.height - ratio <= this.yOffset + e.absoluteTop + e.props.height
// }