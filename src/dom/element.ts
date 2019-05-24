import { asArray, indent, notSameNotFalsy, objectKeys, objectMap } from 'misc-utils-of-mine-generic'
import { Document } from './document'
import { Node } from './node'
import { isDomElement } from './nodeUtil'

export class Element extends Node {
  constructor(public readonly tagName: string, ownerDocument: Document) {
    super(Node.ELEMENT_NODE)
    this._ownerDocument = ownerDocument
    // this.props = new DomElementPropsImpl<T>()
  }


  // debug operations from up-level APIs moved here. TODO: find other place



  hasClass<T extends Element = Element>(c: string): this is T {
    return (this.props.classes || []).includes(c)
  }
  addClass(c: string | string[]) {
    this.props.classes = (this.props.classes || []).concat(asArray(c)).filter(notSameNotFalsy)
  }

  debugAsJson(): DebugJsonNode {
    return { ...this.props.data, children: (this.childNodes).map(e => isDomElement(e) ? e.debugAsJson() : 'Text(' + e.textContent + ')') }
  }

  /**
   * Returns a XML like string representation of this element instance.
   */
  debugAsXml(o: DebugOptions = { level: 0 }): string {
    return this.printElementAsXml(o)
  }

  private printElementAsXml(o: DebugOptions) {
    const noF = objectMap(this.props.data, (k, v) => typeof v === 'function' ? v.toString() : v)
    return `${indent(o.level)}<${this.tagName} ${objectKeys({ ...noF })
      .map(p => `${p}=${JSON.stringify(noF[p])}`)
      .join(' ')} ${this.textContent ? `textContent="${this.textContent}"` : ''}>\n${indent(o.level + 1)}${this.childNodes
        .map(e => isDomElement(e) ? e.debugAsXml({ ...o, level: (o.level) + 1 }) : `${indent(o.level)}Text(${e.textContent})`)
        .join(`\n${indent(o.level + 1)}`)}\n${indent(o.level)}</${this.tagName}>\n`
  }

}

interface DebugJsonNode { [s: string]: any, children: (DebugJsonNode | string)[] }

interface DebugOptions {
  level: number
}

// export class DomElementPropsImpl<T extends ElementProps = ElementProps> extends BasePropsImpl<Partial<T>> {

//   // public get id(): undefined | string {
//   //   return this._data.id
//   // }
//   // public set id(value: undefined | string) {
//   //   this._data.id = value
//   // }

//   // public get name(): undefined | string {
//   //   return this._data.name
//   // }
//   // public set name(value: undefined | string) {
//   //   this._data.name = value
//   // }

//   // public get classes(): undefined | string[] {
//   //   return this._data.classes
//   // }
//   // public set classes(value: undefined | string[]) {
//   //   this._data.classes = value
//   // }

//   // public get number(): undefined | number {
//   //   return this._data.number
//   // }
//   // public set number(value: undefined | number) {
//   //   this._data.number = value
//   // }

//   // public get elementType(): undefined | string {
//   //   return this._data.elementType
//   // }
//   // public set elementType(value: undefined | string) {
//   //   this._data.elementType = value
//   // }

// }

// export interface ElementProps extends BaseProps {
//  /**
//    * Like Dom element's ids to uniquely identify them. Not used internally, meant for the user.
//    */
//   id: string

//   /**
//    * Similar to [[id]] but doesn't have to be unique. Not used internally, meant for the user.
//    */
//   name: string

//   /**
//    * Similar to Dom Element class names. Not used internally, meant for the user.
//    */
//   classes: string[]

//   /**
//    * Similar to [[name]] but numeric type. Not used internally, meant for the user.
//    */
//   number: number

//   /**
//    * Custom elements or components can use this property to identify the their type with a name.
//    */
//   elementType: string
// }
