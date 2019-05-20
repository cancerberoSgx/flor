import { notFalsy } from 'misc-utils-of-mine-typescript'
import { EventTarget } from '..'
import { Document } from './document'
import { ElementPredicate, filterAscendants, filterChildren, filterDescendants, filterDescendantTextNodesContaining, findAscendant, findChildren, findDescendant, findDescendantContaining, isDomText, mapChildren, mapDescendants, nodeHtml, visitAscendants, visitChildren, visitDescendants, Visitor, VisitorOptions } from './nodeUtil'

export class Node implements EventTarget {

  static DOCUMENT_TYPE_NODE: NodeType = 10
  static TEXT_NODE: NodeType = 3
  static ELEMENT_NODE: NodeType = 1

  protected _textContent: string | undefined = undefined
  protected _parentNode: Node | undefined = undefined
  protected _childNodes: Node[]
  protected _ownerDocument: Document | undefined = undefined

  // public get top(): number {
  //   return this.props.top;
  // }
  // public set top(value: number) {
  //   this.props.top = value;
  // }

  get childNodes(): Node[] {
    return this._childNodes
  }

  protected _boundsDirty: boolean

  constructor(readonly nodeType: NodeType) {
    this._childNodes = []
    this._boundsDirty = true
  }

  get nodeTypeName() {
    return this.nodeType === Node.DOCUMENT_TYPE_NODE ? 'document' : this.nodeType === Node.ELEMENT_NODE ? 'element' : 'text'
  }

  get ownerDocument() {
    return this._ownerDocument
  }

  get textContent() {
    return this._textContent
  }
  set textContent(c: string | undefined) {
    this._textContent = c
    if (!this._boundsDirty) {
      this._boundsDirty = true
    }
    if (isDomText(this) && this._parentNode) {
      // since text have not independent rendering we need to mark our parent
      this._parentNode._boundsDirty = true
    }
  }

  get parentNode() {
    return this._parentNode
  }
  set parentNode(n: Node | undefined) {
    if (!n) {
      this.remove()
    } else {
      n.appendChild(this)
    }
  }

  get innerHTML() {
    return nodeHtml(this, false)
  }

  get outerHTML() {
    return nodeHtml(this, true)
  }

  appendChild(c: Node) {
    this.insertChild(this.childNodes.length, c)
  }

  insertChild(index: number, c: Node) {
    if (c.parentNode) {
      c.parentNode.removeChild(c)
    }
    this._childNodes.splice(index, 0, c)
    c._parentNode = this
    if (!this._boundsDirty) {
      this._boundsDirty = true
    }
  }

  remove() {
    // boundsDirty in self and parentNode is take care by removeChild()
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }

  removeChild(n: Node): Node | undefined {
    const i = this._childNodes.findIndex(c => c === n)
    if (i !== -1) {
      const c = this._childNodes.splice(i, 1)[0] || undefined
      c._parentNode = undefined
      if (!n._boundsDirty) {
        c._boundsDirty = true
      }
      if (!this._boundsDirty) {
        this._boundsDirty = true
      }
      return c
    }
  }

  get firstChild(): Node | undefined {
    return this._childNodes.length ? this._childNodes[0] : undefined
  }

  /**
   * Removes all children from this node
   */
  empty() {
    // boundsDirty in self and parentNode is take care by removeChild()
    while (this.firstChild) {
      // performance - we could delete all and after mark dirty only once.
      this.removeChild(this.firstChild)
    }
  }

  /**
   * Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes. Throws a
   * "HierarchyRequestError" DOMException if the constraints of the node tree are violated.
   */
  replaceWith(...nodes: (Node | string)[]): void {
    // TODO: mark boundsDirty
    const children = (this._parentNode as any)._childNodes as Node[]
    children.splice(children.indexOf(this), 1,
      ...nodes.map(n => typeof n === 'string' ? this.ownerDocument && this.ownerDocument.createTextNode(n) : n).filter(notFalsy))
  }

  visitChildren(v: (c: Node) => void) {
    visitChildren(this, v)
  }

  mapChildren<T>(v: (c: Node) => T): T[] {
    return mapChildren(this, v)
  }

  findChildren<T extends Node = Node>(p: ElementPredicate): T | undefined {
    return findChildren(this, p) as T | undefined
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

  findDescendantTextNodeContaining(name: string, o: VisitorOptions = {}): Node | undefined {
    return findDescendantContaining(this, name, o)
  }

  filterDescendantTextNodesContaining(name: string, o: VisitorOptions = {}): Node[] {
    return isDomText(this) ? [] : filterDescendantTextNodesContaining(this, name, o)
  }

  previousSibling<T extends Node = Node>(): T | undefined {
    if (this.parentNode) {
      const i = this.parentNode._childNodes.indexOf(this)
      if (i !== -1 && i > 0) {
        return this.parentNode._childNodes[i - 1] as T
      }
    }
  }

  nextSibling<T extends Node = Node>(): T | undefined {
    if (this.parentNode) {
      const i = this.parentNode._childNodes.indexOf(this)
      if (i !== -1 && i < this.parentNode._childNodes.length - 1) {
        return this.parentNode._childNodes[i + 1] as T
      }
    }
  }

  findSibling(p: ElementPredicate, o: VisitorOptions = {}): Node | undefined {
    return this._parentNode ? this._parentNode.childNodes.find(c => c !== this && p(c)) : undefined
  }

  filterSibling(p: ElementPredicate, o: VisitorOptions = {}): Node[] {
    return this._parentNode ? this._parentNode.childNodes.filter(c => c !== this && p(c)) : []
  }

}

export type NodeType = 10 | 3 | 1

// export class NodeList<T> {
//   [index: number]: T;

//   constructor(protected list: T[]) {
//   }

//   [Symbol.iterator]() {
//     return this.list[Symbol.iterator]()
//   }

//   get length() {
//     return this.list.length
//   }

//   item(i: number): T | undefined {
//     return this.list[i] || undefined
//   }
// }

export class TextNode extends Node {
  constructor(_textContent: string | undefined, ownerDocument: Document) {
    super(Node.TEXT_NODE)
    this._textContent = _textContent
    this._ownerDocument = ownerDocument
  }
}
