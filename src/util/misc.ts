import { RemoveProperties } from 'misc-utils-of-mine-generic';
import { ObjectStringKeyUnion } from 'misc-utils-of-mine-typescript';

export type KeysValued<T, V, K extends keyof T = keyof T> = V extends T[K] ? K : never
export type RemoveKeysValued<T, V> = Exclude<ObjectStringKeyUnion<T>, KeysValued<T, V>>
export type RemovePropertiesValued<T, V> = RemoveProperties<T, RemoveKeysValued<T, V>>

export const nextTick = global.setImmediate || process.nextTick.bind(process)

export function nonEnumerableMember(o: any, name: string) {
  Object.defineProperty(o, name, {
    enumerable: false,
    writable: true
  })
}

export function enumerableMember(o: any, name: string) {
  Object.defineProperty(o, name, {
    enumerable: true,
    writable: true
  })
}

/**
 * Promise like object that allows to resolve it promise from outside code. Example:
 *
```
class Api {
  fooReady = new Deferred<Data>()
  private knower() {
    inOtherMoment(data=>{
      this.fooReady.resolve(data)
    })
  }
}
```
 */
export class Deferred<R, J = any> {
  resolve: (r: R) => void
  reject: (r: J) => void
  private promise: Promise<R>
  constructor(callback?: (this: Deferred<R, J>, resolve: (r: R) => void, reject?: (r: J) => void) => void) {
    let instance = this
    this.resolve = null as any
    this.reject = null as any
    this.promise = new Promise(function(resolve, reject) {
      instance.resolve = resolve
      instance.reject = reject
    })
    if (typeof callback === 'function') {
      callback.call(this, this.resolve, this.reject)
    }
  }
  then(resolve: (r: R) => void) {
    return this.promise.then(resolve)
  }
  catch(r: (reject: J) => void) {
    return this.promise.catch(r)
  }
}
