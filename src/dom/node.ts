import { notFalsy } from 'misc-utils-of-mine-typescript'
import { Document } from './document'
import { EventTarget } from './event'
import { nodeHtml } from './nodeHtml'
import { ElementPredicate, filterAscendants, filterChildren, filterDescendants, filterDescendantTextNodesContaining, findAscendant, findChildren, findDescendant, findDescendantContaining, isDomText, mapChildren, mapDescendants, visitAscendants, visitChildren, visitDescendants, Visitor, VisitorOptions } from './nodeUtil'
import { TextNode } from './text'

export abstract class Node extends EventTarget {

  static DOCUMENT_TYPE_NODE: NodeType = 10
  static TEXT_NODE: NodeType = 3
  static ELEMENT_NODE: NodeType = 1
  static _WATERMARK = 'jsx-alone-dom-dom'
  public attributes: NamedNodeMap<Attr>

  protected _attributes: {
    [k: string]: Attr;
  } = {}

  protected _children: Node[] = []
  readonly childNodes: NodeList<Node>
  protected _boundsDirty: boolean

  /**
   * Same as [[childNodes]] but returns them in an array
   */
  get children(): Node[] {
    return Array.from(this.childNodes)
  }

  constructor(readonly nodeType: NodeType) {
    super()
    this._children = []
    this.childNodes = new NodeList(this._children)
    this.attributes = new NamedNodeMap(this._attributes)
    this._boundsDirty = true
  }

  protected _ownerDocument: Document | null = null
  get ownerDocument() {
    return this._ownerDocument
  }

  protected _textContent: string | null = null
  get textContent() {
    return this._textContent
  }
  set textContent(c: string | null) {
    this._textContent = c
    if(!this._boundsDirty){
      this._boundsDirty=true
      if(isDomText(this)&&this._parentNode){
        // since text have not independent rendering we need to mark our parent
        this._parentNode._boundsDirty=true
      }
    }
  }

  protected _parentNode: Node | null = null
  get parentNode() {
    return this._parentNode
  }

  get innerHTML() {
    return nodeHtml(this, false)
  }
  // set innerHTML(id: string | null) {throw new Error('not implemented')
  // }

  get outerHTML() {
    return nodeHtml(this, true)
  }
  // set outerHTML(id: string | null) {throw new Error('not implemented')
  // }

  getAttribute(a: string) {
    return this._attributes[a] ? this._attributes[a].value : null
  }
  setAttribute(a: string, v: string | null) {
    return this._attributes[a] = { value: v, name: a }
  }

  appendChild(c: Node) {
    c.remove()
    this._children.push(c)
    c._parentNode = this
  }

  /**
   * Returns whether node and otherNode have the same properties.
   */
  isEqualNode(otherNode: Node | null): boolean {
    return false // TODO
  }

  remove() {
    this.parentNode && this.parentNode.removeChild(this)
  }
  removeChild(n: Node): Node | undefined {
    // const c2 = this._children.filter(c=>c!==n) const removed = c2.length<this._children.length
    // this._children = c2 return removed ? n : undefined
    const i = this._children.findIndex(c => c === n)
    if (i !== -1) {
      return this._children.splice(i, 1)[0] || undefined
    }
  }
  get firstChild(): Node | undefined {
    return this._children.length ? this._children[0] : undefined
  }
  /**
   * Removes all children from this node
   */
  empty() {
    while (this.firstChild) {
      this.removeChild(this.firstChild)
    }
  }
  /**
   * Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes. Throws a
   * "HierarchyRequestError" DOMException if the constraints of the node tree are violated.
   */
  replaceWith(...nodes: (Node | string)[]): void {
    const children = (this._parentNode as any)._children as Node[]
    children.splice(children.indexOf(this), 1,
      ...nodes.map(n => typeof n === 'string' ? this.ownerDocument && this.ownerDocument.createTextNode(n) : n).filter(notFalsy))
  }

  /** miscellaneous data */
  _data: { [s: string]: any } = {}

  visitChildren(v: (c: Node) => void) {
    visitChildren(this, v)
  }
  mapChildren<T>(v: (c: Node) => T): T[] {
    return mapChildren(this, v)
  }
  findChildren(p: ElementPredicate) {
    return findChildren(this, p)
  }
  filterChildren(p: ElementPredicate) {
    return filterChildren(this, p)
  }
  visitDescendants(v: Visitor, o: VisitorOptions = {}): boolean {
    return visitDescendants(this, v, o)
  }
  filterDescendants<T extends Node = Node>(p: ElementPredicate, o: VisitorOptions = {}): T[] {
    return filterDescendants(this, p, o)
  }
  mapDescendants<T extends Node = Node, V = any>(p: (p: T) => V, o: VisitorOptions = {}): V[] {
    return mapDescendants(this, p, o)
  }
  findDescendant(p: ElementPredicate, o: VisitorOptions = {}) {
    return findDescendant(this, p, o)
  }
  visitAscendants(v: Visitor, o = {}): boolean {
    return visitAscendants(this, v, o)
  }
  findAscendant(p: ElementPredicate, o = {}) {
    return findAscendant(this, p, o)
  }
  filterAscendants<T extends Node = Node>(p: ElementPredicate, o: VisitorOptions = {}): T[] {
    return filterAscendants(this, p, o)
  }

  findDescendantTextNodeContaining(name: string, o: VisitorOptions = {}): TextNode | undefined {
    return findDescendantContaining(this, name, o)
    // return isDomText(this) ? undefined :  findDescendantTextNodeContaining(this, name, o)
  }

  filterDescendantTextNodesContaining(name: string, o: VisitorOptions = {}): TextNode[] {
    return isDomText(this) ? [] : filterDescendantTextNodesContaining(this, name, o)
  }

  // /**
  //  * returns the first descendant node that contains given text. Warning, if you use the type parameter to
  //  * cast the result, be aware that this method doesn't perform any verification on the returned type.
  //  */
  // findDescendantContaining<T extends Node = Node>(text: string, o: VisitorOptions = {}): T|undefined {
  //   return findDescendantContaining(this, text, o)
  // }

  previousSibling(): Node | undefined {
    const i = this.parentNode && this.parentNode._children.indexOf(this) || 0
    if (i > 0) {
      return this.parentNode!._children[i - 1]
    }
  }
}

export type NodeType = 10 | 3 | 1

export class NodeList<T> {
  [index: number]: T;

  constructor(protected list: T[]) {

  }
  [Symbol.iterator]() {
    return this.list[Symbol.iterator]()
  }
  get length() {
    return this.list.length
  }
  item(i: number): T | null {
    return this.list[i] || null
  }
}

export interface Attr {
  name: string
  value: string | null
}

// TODO: performance - we focus on the map, and not in the array/iteration
export class NamedNodeMap<T extends Attr> {
  [index: number]: T;
  constructor(protected map: { [n: string]: T }) {

  }
  [Symbol.iterator]() {
    return Object.values(this.map)[Symbol.iterator]()
  }
  get length() {
    return Object.keys(this.map).length
  }
  item(i: number): T | null {
    return Object.values(this.map)[i] || null
  }
}
