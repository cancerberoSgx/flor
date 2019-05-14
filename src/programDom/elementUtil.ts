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
  return true; //TODO
  // throw new Error('not implemented')
}

export function isAttached(e: ProgramElement): boolean {
  return true//TODO
  // throw new Error('not implemented')
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
