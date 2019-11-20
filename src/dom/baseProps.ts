import { objectKeys } from 'misc-utils-of-mine-generic';

export class BasePropsImpl<T extends any = any> implements Partial<BaseProps<T>> {
  protected _data: T

  constructor(p?: T) {
    this._data = p || {} as any
  }

  assign(o: Partial<T>) {
    Object.assign(this._data, o || {})
  }

  getPropertyNames() {
    return objectKeys(this._data)
  }

  getPropertyValue(prop: keyof T) {
    return this._data[prop]
  }

  public get classes(): undefined | string[] {
    return this._data.classes
  }
  public set classes(value: undefined | string[]) {
    this._data.classes = value
  }

  public get id(): undefined | string {
    return this._data.id
  }

  public set id(value: undefined | string) {
    this._data.id = value
  }

  public get name(): undefined | string {
    return this._data.name
  }
  public set name(value: undefined | string) {
    this._data.name = value
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

  /**
   * Similar to Dom Element class names. Not used internally, meant for the user.
   */
  classes: string[]

  /**
 * Like Dom element's ids to uniquely identify them. Not used internally, meant for the user.
 */
  id: string

  /**
   * Similar to [[id]] but doesn't have to be unique. Not used internally, meant for the user.
   */
  name: string

  // assign(o: T): void

  // getPropertyNames(): string[]

  // getPropertyValue<K extends keyof T>(prop:K): T[K]
  // /**
  //  * Gets all props as plain object.
  //  */
  // readonly data: T
}

// export interface ND {children: NodeProps[]}
// export interface NodeProps  extends BaseProps<ND> {
// //
// }

// export class BodePropsImpl extends BasePropsImpl<ND>{

// }
