import { RemoveProperties } from 'misc-utils-of-mine-generic'
import { Node } from '../dom'
import { Component } from '../jsx'
import { ProgramDocument } from './programDocument'
import { ProgramElement } from './programElement'
import { ElementProps, FullProps } from './types'

/**
 * important! right now it must match both ProgramElement and YogaElement
 */
export function isElement<E extends ProgramElement = ProgramElement>(n: any): n is E {
  return n && n.nodeType === Node.ELEMENT_NODE && n.props && n._childrenReady
}

/**
 * important! right now it must match both ProgramDocument and YogaDocument
 */
export function isDocument(n: any): n is ProgramDocument {
  return n && n.nodeType === Node.DOCUMENT_TYPE_NODE && isElement(n.body)
}

export function isElementProps(e: any): e is ElementProps {
  return e && e._data
}

export function isAttached(e: ProgramElement): boolean {
  return true// TODO
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

export function rectanglePlusOffsets(r: R, xOffset = 0, yOffset = 0) {
  return { yi: r.yi + yOffset, yl: r.yl + yOffset, xi: r.xi + xOffset, xl: r.xl + xOffset }
}

export function createElement(doc: ProgramDocument, tagName: string | Partial<FullProps>, parent?: ProgramElement, props: Partial<ElementProps> = {}, children?: Node[]) {
  if (typeof tagName !== 'string') {
    let opts = tagName
    tagName = opts.tagName || 'box'
    parent = opts.parent
    props = { ...opts, parent: undefined, children: undefined, tagName: undefined } as any
    children = (opts.children || []).map(c => {
      if (typeof c === 'string') {
        return doc.createTextNode(c)
      } else if (isElement(c)) {
        return c
      } else {
        return createElement(doc, c)
      }
    })
  }
  const el = doc.createElement(tagName)
  Object.assign(el.props, props)
  if (parent) {
    parent.appendChild(el)
  }
  if (children) {
    children.forEach(c => {
      el.appendChild(c)
    })
  }
  return el
}

export type ElementOfComponent<C extends Component, E extends ProgramElement = ProgramElement> = { getComponent(): C } & E & RemoveProperties<E, 'getComponent'>
