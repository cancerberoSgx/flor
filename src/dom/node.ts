import { notFalsy } from 'misc-utils-of-mine-typescript';
import { EventTarget } from '..';
import { BasePropsImpl } from './BaseProps';
import { Document } from './document';
import { Element } from './element';
import { ElementPredicate, filterAscendants, filterChildren, filterDescendants, filterDescendantTextNodesContaining, findAscendant, findChildren, findDescendant, findDescendantContaining, isDomElement, isDomText, mapChildren, mapDescendants, nodeHtml, NodePredicate, NodeSimplePredicate, visitAscendants, visitChildren, visitDescendants, Visitor, VisitorOptions } from './nodeUtil';

export class Node<T extends any = any> implements EventTarget {

  static DOCUMENT_TYPE_NODE: NodeType = 10
  static TEXT_NODE: NodeType = 3
  static ELEMENT_NODE: NodeType = 1

  protected _textContent: string | undefined = undefined
  protected _parentNode: Node | undefined = undefined
  protected _childNodes: Node[]
  protected _ownerDocument: Document | undefined = undefined

  protected _boundsDirty: boolean

  constructor(readonly nodeType: NodeType) {
    this._childNodes = []
    this._boundsDirty = true
    this.props = new BasePropsImpl<Partial<T>>()
  }

  props: BasePropsImpl<Partial<T>>

  get childNodes(): Node[] {
    return this._childNodes
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

  get innerHTML(): string {
    return nodeHtml(this, false)
  }

  get outerHTML(): string {
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
      ...nodes.map(n => typeof n === 'string' ? this.ownerDocument && this.ownerDocument.createTextNode(n) : n).filter(notFalsy) as any)
  }

  visitChildren(v: (c: Node) => void) {
    visitChildren(this, v)
  }

  mapChildren<T>(v: (c: Node) => T): T[] {
    return mapChildren(this, v)
  }

  findChildElements<T extends Element = Element>(p: ElementPredicate<T>): T | undefined {
    return this.findChildren(e => isDomElement(e) && p(e))
  }
  
  findChildren<T extends Node = Node>(p: NodePredicate<T>): T | undefined {
    return findChildren<T>(this, p)
  }

  filterChildElements<T extends Element = Element>(p: ElementPredicate<T>): T[] {
    return this.filterChildren(e => isDomElement(e) && p(e))
  }

  filterChildren<T extends Node = Node>(p: NodePredicate<T>): T[] {
    return filterChildren<T>(this, p)
  }

  filterChildrenWithClass<T extends Node = Node>(className: string): T[] {
    return filterChildren<T>(this, e => isDomElement(e) && e.hasClass(className))
  }

  visitDescendants(v: Visitor, o: VisitorOptions = {}): boolean {
    return visitDescendants(this, v, o)
  }

  filterDescendants<T extends Node = Node>(p: NodePredicate<T>, o: VisitorOptions = {}): T[] {
    return filterDescendants<T>(this, p, o)
  }

  mapDescendants<T extends Node = Node, V = any>(p: (p: T) => V, o: VisitorOptions = {}): V[] {
    return mapDescendants(this, p, o)
  }

  findDescendant<T extends Node = Node>(p: NodePredicate<T>, o: VisitorOptions = {}): T | undefined {
    return findDescendant<T>(this, p, o)
  }

  visitAscendants(v: Visitor, o: VisitorOptions = {}): boolean {
    return visitAscendants(this, v, o)
  }

  findAscendant<T extends Node = Node>(p: NodePredicate<T>, o: VisitorOptions = {}): T | undefined {
    return findAscendant<T>(this, p, o)
  }

  filterAscendants<T extends Node = Node>(p: NodeSimplePredicate, o: VisitorOptions = {}): T[] {
    return filterAscendants<T>(this, p, o)
  }

  findDescendantTextNodeContaining<T extends Node = Node>(name: string, o: VisitorOptions = {}): T | undefined {
    return findDescendantContaining<T>(this, name, o)
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

  findSibling<T extends Node = Node>(p: NodePredicate<T>, o: VisitorOptions = {}): T | undefined {
    return this._parentNode ? this._parentNode.childNodes.find(c => c !== this && p(c)) : undefined as any
  }

  filterSibling<T extends Node = Node>(p: NodePredicate<T>, o: VisitorOptions = {}): T[] {
    return this._parentNode ? this._parentNode.childNodes.filter(c => c !== this && p(c)) : [] as any
  }

  getAttributeValue(p: keyof T) {
    return this.props.getPropertyValue(p)
  }
  getAttributeNames() {
    return this.props.getPropertyNames()
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
