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

export function isVisible(e: ProgramElement): boolean{
  throw new Error('not implemented')
}
export function isAttached(e: ProgramElement): boolean{
  throw new Error('not implemented')
}