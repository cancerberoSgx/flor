import { Document } from './document'
import { Node } from './node'

export class Element  extends Node  {

  constructor(public readonly tagName: string, ownerDocument: Document) {
    super(Node.ELEMENT_NODE)
    this._ownerDocument = ownerDocument
  }

}
