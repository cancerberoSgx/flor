import { MouseEvent, ProgramElement } from '../programDom'

export interface ClicksEvent<T extends ProgramElement = ProgramElement> extends MouseEvent<T> {
  count: number
}

export type ClicksListener<T extends ProgramElement = ProgramElement> = (e: ClicksEvent<T>) => void

interface Options<T extends ProgramElement = ProgramElement> {
  /**
   * Element to listen for clicks on.
   */
  target: T

  /**
   * The handler function to be called on clicks. Notice that it receives a event object with a `count`
   * property that indicate the amount of clicks.
   */
  handler: ClicksListener<T>

  /**
   * The time tolerance for multiple clicks. If more time that this passes between multiple clicks then
   * `count` resets. Default value is 250.
   */
  interval?: number

  /**
   * Install the click handler with `once()` instead of `on()`
   */
  once?: boolean

  /**
   * Remove the click listener from the target instead adding one.
   */
  remove?: boolean
}

/**
 * Adds click listener that also reports the amount of clicks in event.count property of event with which the
 * handler function is called.
 */
export function clicks<T extends ProgramElement = ProgramElement>(options: Options<T>) {
  let t0 = Date.now()
  let count = 0
  const interval = options.interval || 250
  let timer: any
  function handler(e: MouseEvent) {
    const t = Date.now()
    if (t - t0 > interval) {
      count = 0
    }
    clearTimeout(timer)
    t0 = t
    count++
    timer = setTimeout(() => {
      if (count) {
        options.handler({ ...e, count } as any)
      }
    }, interval + 20)
  }
  if (options.remove) {
    options.target.removeMouseListener(handler, 'click')
  } else {
    // const fn = (options.once ? options.target.once : options.target.on).bind(options.target)
    options.target.addMouseListener(handler, 'click')
  }
}
