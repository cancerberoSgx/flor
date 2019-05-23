import { asArray, notSameNotFalsy } from 'misc-utils-of-mine-generic'
import { Document } from './document'
import { Node } from './node'

export class Element extends Node {
  constructor(public readonly tagName: string, ownerDocument: Document) {
    super(Node.ELEMENT_NODE)
    this._ownerDocument = ownerDocument
    // this.props = new DomElementPropsImpl<T>()
  }

  hashClass<T extends Element = Element>(c: string): this is T {
    return (this.props.classes || []).includes(c)
  }
  addClass(c: string | string[]) {
    this.props.classes = (this.props.classes || []).concat(asArray(c)).filter(notSameNotFalsy)
  }

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
