import { CommonElementImpl, CommonElementProps } from '../yogaDom/yogaTypes'
import { ColorString, PAttrs } from '../programDom/styleProps'
import { objectKeys } from 'misc-utils-of-mine-generic';
import { ObjectStringKeyUnion } from 'misc-utils-of-mine-typescript';

export class BasePropsImpl<T extends any = any> implements BaseProps<T>  {
  protected _data: T
  
  constructor( p?: T) {
    this._data = p  ||{} as any  
  }

  assign(o: T) {
    Object.assign(this._data, o || {})
  }
  
  getPropertyNames() {
    return objectKeys(this._data)
  }

  getPropertyValue(prop:keyof T){
    return this._data[prop]
  }
  
  // getPropertyNames(): ObjectStringKeyUnion<T> {
  //   return objectKeys(this._data) as any
  // }

  // getPropertyValue<K extends ObjectStringKeyUnion<T>>(prop:K) : T[K] {
  //   return this._data[prop] as any
  // }
  

  
  /**
   * Gets all props as plain object.
   */
  get data(): T { // TODO: should eb AttrsProps - workaround for types issue.
    return this._data
  }

}

export interface BaseProps<T extends any = any> {


 
  assign(o: T): void
  
  getPropertyNames(): string[]

  getPropertyValue<K extends keyof T>(prop:K): T[K]
  /**
   * Gets all props as plain object.
   */
  readonly data: T
}

// export interface ND {children: NodeProps[]}
// export interface NodeProps  extends BaseProps<ND> {
// // 
// }

// export class BodePropsImpl extends BasePropsImpl<ND>{

// }