import { ProgramDocument, ProgramElement } from '..'
import { Node } from '../dom'
import { ElementProps, FullProps, isElement } from '../programDom'
import { getCurrentCommit, nowFormat } from './misc'

export function getPerformanceFileName(label: string) {
  return nowFormat().replace(/:/g, '_') + '_' + getCurrentCommit() + '_' + label + '.json'
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
