import { Document } from './document'
import { Node } from './node'
import { BasePropsImpl, BaseProps } from './BaseProps';

export class Element extends Node {

  constructor(public readonly tagName: string, ownerDocument: Document) {
    super(Node.ELEMENT_NODE)
    this._ownerDocument = ownerDocument
  }


  
}
