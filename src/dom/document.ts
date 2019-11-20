import { Element } from './element';
import { Node, TextNode } from './node';

export class Document<E extends Element = Element> extends Node {

  constructor() {
    super(Node.DOCUMENT_TYPE_NODE)
    this.body = new Element('body', this)
    this.appendChild(this.body)
  }

  readonly body: Element

  createElement(t: string): E {
    return new Element(t, this) as E
  }

  createTextNode(content: string): TextNode {
    return new TextNode(content, this)
  }
}
