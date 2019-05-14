import { execSync } from 'child_process'

export const nextTick = global.setImmediate || process.nextTick.bind(process)

export function nowHash() {
  return Date.now().toString(36)
}

export function formatDate(d: Date) {
  return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + ':' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
}

export function nowFormat() {
  return Math.trunc(Date.now() / 1000 / 1000) + ''
}

export function getCurrentCommit() {
  return execSync('git rev-parse --short HEAD')
    .toString()
    .trim()
}

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
 * Promise instance resolvable by an external actor. This is an anti pattern but is useful in some cases when
 * two different actors at different moments collaborate to provide a async notification where one knows when
 * to create the promise object and later another knows how to resolve. The only way of solving this is by
 * having a emitter and subscribing in the promise resolve. instead of having to create such an emitter, we
 * leave the promise as API and coordinate with other actor that will take care of resolving it (this last
 * actor, doesn't konw or is too late to provide an API for listeners). Usage:

```ts
apiProvider(){
  this.somethingReady = new ResolvablePromise(resolve=>{
    this.somethingReady.resolve = resolve
  })
}
...
resolverActor(){
  this.somethingReady.resolve(something())
}
```
*/
export class ResolvablePromise<T> extends Promise<T> {
  resolve: ((t: T) => void) = null as any
  constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject?: (reason?: any) => void) => void) {
    super(resolve => {
      this.resolve = resolve
      new Promise(executor.bind(this)).then(resolve)
    })
  }
}

export class Deferred<R, J= any> {
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
