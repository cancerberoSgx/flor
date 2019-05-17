import { Document } from './document'
import { Node } from './node'

export class Element  extends Node  {

  // children: ElementList

  constructor(public readonly tagName: string, ownerDocument: Document) {
    super(Node.ELEMENT_NODE)
    // this.children = new ElementList(this._children)
    this._ownerDocument = ownerDocument
  }

  // get ownerDocument() {
  //   return this._ownerDocument as Document
  // }

  get textContent(): string | null {
    return this._textContent// !this.childNodes || this.childNodes.length === 0 ? '' : Array.from(this.childNodes || []).map(c => c.textContent).join('')
  }

  set textContent(c: string | null) {
    this._textContent = c
  }

  get id() {
    return this.getAttribute('id')
  }
  set id(id: string | null) {
    this.setAttribute('id', id)
  }
}

// class ElementList<T extends Node = Node> {
//   constructor(protected list: T[]) {

//   }
//   item(i: number): T | undefined {
//     return this.list[i] || undefined
//   }
//   get length() {
//     return this.list.length
//   }
// }
