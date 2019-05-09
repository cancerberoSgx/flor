// interface EventTarget {
//   addEventListener(type: string, listener: EventListener | undefined, options?: boolean | AddEventListenerOptions): void
//   removeEventListener(type: string, callback: EventListener | undefined, options?: EventListenerOptions | boolean): void
// }

interface EventListenerOptions {
  capture?: boolean
}

interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean
  passive?: boolean
}

export type EventListener <T extends EventTarget = EventTarget>= (evt: Event<T>) => void | boolean

export interface Event<T extends EventTarget = EventTarget> extends StopPropagation {
  readonly currentTarget: T | undefined
  readonly target: T | undefined
  readonly type: string
}
export interface StopPropagation {
  stopPropagation(): void
}
export class EventTarget   {

  _addEventListener(type: string, listener: EventListener | undefined, options?: boolean | AddEventListenerOptions): void {
    // throw new Error('not implemented')
  }

  removeEventListener(type: string, callback: EventListener | undefined, options?: EventListenerOptions | boolean): void {
    // throw new Error('not implemented')
  }

}
