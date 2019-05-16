import { Element } from './element'
import { Node } from './node'
import { TextNode } from './text'

export class Document<E extends Element = Element> extends Node {
  // body: Es = null as any
  constructor() {
    super(Node.DOCUMENT_TYPE_NODE)
    // this.initBody();
    this.head = new HeadElement('head', this)
    this.body = new BodyElement('body', this)
  }

  head: HeadElement
  body: BodyElement
  // protected initBody() {
  //   this.body = this.createElement('body');
  //   this.appendChild(this.body);
  // }

  // protected _body: E = null as any
  // get body() {
  //   if (!this._body) {
  //     this._body = this.createElement('body')
  //     this.appendChild(this._body)
  //   }
  //   return this._body
  // }

  createElement(t: string): E {
    return new Element(t, this) as E
  }
  createTextNode(content: string): TextNode {
    return new TextNode(content, this)
  }
}

class HeadElement extends Element {
}

class BodyElement extends Element {
}
