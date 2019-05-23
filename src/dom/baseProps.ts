import { CommonElementImpl, CommonElementProps } from '../yogaDom/yogaTypes'
import { ColorString, PAttrs } from '../programDom/styleProps'
import { objectKeys } from 'misc-utils-of-mine-generic';

export class BasePropsImpl<T extends any = any> implements BaseProps<T> {
  protected _data:T
  
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