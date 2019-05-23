import { repeat, objectKeys } from 'misc-utils-of-mine-generic'
import { notFalsy } from 'misc-utils-of-mine-typescript'
import { Document } from './document'
import { Element } from './element'
import { Node, TextNode } from './node'

export function nodeTypes(n: Node): number[] {
  const o: number[] = []
  visitChildren(n, c => o.push(c.nodeType))
  return o
}

export function nodeTexts(n: Node): (string | undefined)[] {
  return mapChildren(n, c => getNodeTextContent(c, undefined))
}

export function isDomElement(n: any): n is Element {
  return n && n.nodeType === Node.ELEMENT_NODE
}
export function isDomNode(n: any): n is Node {
  return n && typeof n.nodeType === 'number' && typeof n.appendChild==='function'
}


export function isDomText(n: any): n is TextNode {
  return n && n.nodeType === Node.TEXT_NODE
}

export function isDomDocument(n: any): n is Document {
  return n && n.nodeType === Node.DOCUMENT_TYPE_NODE && !!n.createElement
}

export function visitChildren(n: Node, v: (c: Node) => void) {
  v(n)
  n.childNodes.forEach(c => visitChildren(c as any, v))
}

export function mapChildren<T>(n: Node, v: (c: Node) => T): T[] {
  const o: T[] = []
  visitChildren(n, c => o.push(v(c)))
  return o
}

export function findChildren<T extends Node = Node>(n: Node, p: ElementPredicate<T>): T|undefined{
  return n.childNodes.find(p) as any
}

export function filterChildren<T extends Node = Node>(n: Node, p: ElementPredicate<T>): T[] {
  return n.childNodes.filter(c => p(c)) as any
}

export function visitAscendants(n: Node, v: Visitor, o = {}): boolean {
  return !n || v(n) || !n.parentNode || visitAscendants(n.parentNode, v, o)
}

export function findAscendant<T extends Node = Node>(n: Node, p: ElementPredicate<T>, o = {}): T|undefined {
  let a: T | undefined
  visitAscendants(
    n,
    c => {
      if (p(c)) {
        a = c as T
        return true
      }
      return false
    },
    o
  )
  return a
}

export function findRootElement(n: Node) {
  return isDomDocument(n) || isDomDocument(n.parentNode) ? n : findAscendant(n, a => isDomDocument(a) || isDomDocument(a.parentNode))
}

export function filterAscendants<T extends Node = Node>(n: Node, p: ElementSimplePredicate, o: VisitorOptions = {}): T[] {
  const a: T[] = []
  visitAscendants(n, c => {
    if (p(c)) {
      a.push(c as T)
    }
    return false
  })
  return a
}

export function findDescendantTextNodeContaining(
  el: Node,
  name: string,
  o: VisitorOptions = {}
): TextNode | undefined {
  return asElements(el)
    .map(c => findDescendant<TextNode>(c, d=>getNodeTextContent(d).includes(name)))
    .find(notFalsy)
}

export function filterDescendantTextNodesContaining(
  el: Node,
  name: string,
  o: VisitorOptions = {}
): TextNode[] {
  return asElements(el)
    .map(c => filterDescendants<TextNode>(c, d => getNodeTextContent(d).includes(name)))
    .flat()
}

export function asElements(el: Node): Element[] {
  return (isDomElement(el) ? [el] : isDomDocument(el) ? [el.body] : []).filter(isDomElement)
}

/**
 * returns the first descendant node that contains given text. Warning, if you use the type parameter to
 * cast the result, be aware that this method doesn't perform any verification on the returned type.
 */
export function findDescendantContaining<T extends Node = Node>(n: Node, text: string, o: VisitorOptions = {}): T | undefined {
  return findDescendant<T>(n, n => getNodeTextContent(n).includes(text), o)
}

/**
 * returns the first descendant node that contains given text. Warning, if you use the type parameter to
 * cast the result, be aware that this method doesn't perform any verification on the returned type.
 */
export function filterDescendantContaining<T extends Node = Node>(n: Node, text: string, o: VisitorOptions = {}): T[] {
  return filterDescendants(n, n => getNodeTextContent(n).includes(text), o)
}

export type Visitor  = (n: Node) => boolean

/**
 * settings for visitDescendants regarding visiting order and visit interruption modes.
 */
export interface VisitorOptions {
  childrenFirst?: boolean
  /**
   * if a descendant visitor returned true, we stop visiting and signal up
   */
  breakOnDescendantSignal?: boolean
  /**
   * no matter if visitor returns true for a node, it will still visit its descendants and then break the chain
   */
  visitDescendantsOnSelfSignalAnyway?: boolean
  andSelf?: boolean
}

/**
 * Visit node's descendants until the visitor function return true or there are no more. In the first
 * different modes on which visiting the rest of descenda|nts or ancestors are configurable through the
 * options. By default, first the parent is evaluated which is configurable configurable with
 * [[[VisitorOptions.childrenFirst]]
 * */
export function visitDescendants<T extends Node = Node> (n: Node, v: Visitor, o: VisitorOptions = {}, inRecursion = false): boolean {
  let r = false
  if (o.childrenFirst) {
    r = n.childNodes.some(c => visitDescendants<T>(c, v, o, true))
    if (r) {
      if (!o.breakOnDescendantSignal && (o.andSelf || inRecursion)) {
        v(n)
      }
      return true
    } else if (o.andSelf || inRecursion) {
      r = v(n)
    }
    return false
  } else {
    if (o.andSelf || inRecursion) {
      r = v(n)
    }
    if (r) {
      if (!o.visitDescendantsOnSelfSignalAnyway) {
        return true
      } else {
        return n.childNodes.some(c => visitDescendants<T>(c, v, o, true)) || true // true because self was signaled
      }
    } else {
      return n.childNodes.some(c => visitDescendants<T>(c, v, o, true))
    }
  }
}

export type ElementSimplePredicate = (n: Node, i?: number, a?: Node[]) => boolean
export type ElementKindPredicate <T extends Node = Node>= (n: Node, i?: number, a?: Node[]) => n is T
export type ElementPredicate <T extends Node = Node> =  ElementSimplePredicate|(ElementKindPredicate<T>)

export function filterDescendants<T extends Node = Node>(n: Node, p: ElementPredicate<T>, o: VisitorOptions = {}): T[] {
  const a: T[] = []
  visitDescendants<T>(
    n,
    c => {
      if (p(c)) {
        a.push(c as T)
      }
      return false
    },
    o
  )
  return a
}

export function mapDescendants<T extends Node = Node, V = any>(n: Node, p: (p: T) => V, o: VisitorOptions = {}): V[] {
  const a: V[] = []
  visitDescendants<T>(
    n,
    c => {
      a.push(p(c as any))
      return false
    },
    o
  )
  return a
}

export function findDescendant<T extends Node = Node>(n: Node, p: ElementPredicate<T>, o: VisitorOptions = {}): T|undefined {
  let a: T | undefined
  visitDescendants<T>(
    n,
    c => {
      if (p(c)) {
        a = c as T
        return true
      }
      return false
    },
    o
  )
  return a
}

export function nodeHtml(node: Node, outer = true, _level = 0): string {
  if (isDomDocument(node)) {
    return `<document>${elementHtml(node.body, outer, _level) + '\n' + repeat(_level, '  ')}</document>`
  } else if (isDomElement(node)) {
    return elementHtml(node, outer, _level)
  } 
  // else {
    return '\n' + repeat(_level, '  ') +( getNodeTextContent(node)) || ''
  // }
}

function getNodeTextContent(node: Node<any>, or='') {
  return  node.textContent||or
}

function elementHtml(node: Element, outer: boolean, _level = 0) {
  // console.log( node.getAttributeNames());
  
  const attrs = node.getAttributeNames()
    .map(k => ({ name: k, value: node.getAttributeValue(k) }))
  return `${'\n' + repeat(_level, '  ')}${outer ? 

    `<${node.tagName}${attrs.length ? ' ' : ''}${

      attrs
      .map(a => a.value && `${a.name}="${
        a.value.toString ? a.value.toString() : a.value
      }"`)
    .filter(a => a)
    .join(' ')}>` : ``}\n${ repeat(_level+1, '  ') +( getNodeTextContent(node))}${

      node.childNodes
      .map(c => nodeHtml(c, true, _level + 1))
      .join('\n' + repeat(_level, '  ')) + '\n' + repeat(_level, '  ')}${outer ? `</${node.tagName}>` : ``}`
      .split('\n')
    .map(l => l.trim() ? l : '')
    .join('\n')
    .replace(/\n+/gm, '\n') // removes consecutive empty
}

interface NodeProps<E extends Element = Element> {
// children: Element|string
textContent: string
}
export interface FullNodeProps<E extends Element = Element> extends NodeProps {
  children: (Partial<FullNodeProps> | E | string)[]
  tagName: string
  parent: E
}


export function createDomElement<D extends Document>(doc: D, tagName: string | Partial<FullNodeProps>, parent?: Element, props: Partial<NodeProps> = {}, children?: Node[]) {
  if (typeof tagName !== 'string') {
    let opts = tagName
    tagName = opts.tagName || 'box'
    parent = opts.parent
    props = { ...opts, parent: undefined, children: undefined, tagName: undefined , textContent: opts.textContent} as any
    children = [...opts.children || [], ...children||[] ]
    .map(c => {
      if (typeof c === 'string') {
        return doc.createTextNode(c)
      } else if (isDomElement(c)) {
        return c
      } else {
        return createDomElement(doc, c)
      }
    })
  }
  const el = doc.createElement(tagName)
  // Object.assign(el.props, props);
  // (el.props as any).fofofo = 123123
  el.textContent = props.textContent

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
