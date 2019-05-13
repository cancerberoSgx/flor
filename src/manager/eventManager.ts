import { PropertyOptional, RemoveProperties } from 'misc-utils-of-mine-generic'
import { MouseAction, Program, ProgramKeyEvent, ProgramMouseEvent } from '../declarations/program'
import { Event, EventTarget, StopPropagation } from '../dom/event'
import { ProgramElement } from '../programDom'

export type RegisteredEventListener = { el: ProgramElement, name: string; listener: MouseListener | KeyListener }

export type MouseListener = (ev: MouseEvent) => void | boolean

export type KeyListener = (ev: KeyEvent) => void | boolean

interface AbstractEvent<T extends ProgramElement= ProgramElement> extends Event<T> {
  name: string
  shift: boolean
  ctrl: boolean
  meta: boolean
  type: string
  raw: [number, number, number, string]
}

export interface KeyEvent<T extends ProgramElement= ProgramElement> extends AbstractEvent<T> {
  full: string
  sequence: string
  bug: Buffer
  ch: string
}

export interface MouseEvent<T extends ProgramElement= ProgramElement> extends AbstractEvent<T> {
  x: number
  y: number
  action: MouseAction
  button: 'left' | 'right' | 'middle' | 'unknown'
  bug: Buffer
}

/**
 * Manager class responsible of registering and dispatching keyboard and mouse events.
 */
export class EventManager {

  constructor(protected _program: Program) {
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onMouse = this.onMouse.bind(this)
    this._program.on('keypress', this.onKeyPress)
    _program.on('mouse', this.onMouse)
  }

  get program() {
    return this._program
  }

  private _ignoreKeys = false
  public get ignoreKeys() {
    return this._ignoreKeys
  }
  public set ignoreKeys(value) {
    this._ignoreKeys = value
  }
  protected onKeyPress(ch: string | undefined, e: ProgramKeyEvent) {
    if (this.ignoreKeys) {
      return
    }
    this.keyListeners.some(l => {
      return  notifyListener(l.listener, { type: l.name, ch, ...e, currentTarget: l.el, target: l.el }as any)
    })
  }
  private beforeAllKeyListeners: (RemoveProperties<RegisteredEventListener, 'el'> & {el?: ProgramElement})[] = []
  private keyListeners: (PropertyOptional<RegisteredEventListener, 'el'>)[] = []
  addBeforeAllKeyListener(l: KeyListener) {
    if (!this.beforeAllKeyListeners.find(k => k.listener === l)) {
      this.keyListeners.push({ name: 'keypress', listener: l  })
    }
  }
  addKeyListener(l: KeyListener) {
    if (!this.keyListeners.find(k => k.listener === l)) {
      this.keyListeners.push({ name: 'keypress', listener: l  })
    }
  }

  private beforeAllMouseListeners: {name: string, listener: (e: ProgramMouseEvent & StopPropagation) => boolean | void}[] = []
  addBeforeAllMouseListener(l: {name: string, listener: (e: ProgramMouseEvent & StopPropagation) => boolean | void}) {
    if (!this.beforeAllMouseListeners.find(ll => l !== ll)) {
      this.beforeAllMouseListeners.push(l.name === 'click' ? { ...l, name: 'mouseout' } : l)
    }
  }

  private _ignoreMouse = false
  public get ignoreMouse() {
    return this._ignoreMouse
  }
  public set ignoreMouse(value) {
    this._ignoreMouse = value
  }

  onMouse(e: ProgramMouseEvent) {
    if (this.ignoreMouse) {
      return
    }
    const r = this.beforeAllMouseListeners.filter(l => l.name === e.action).some(l => {
      const ev = {  ...e }
      return notifyListener(l.listener as any, ev as any)
    })
    if (r) {
      return
    }
    this.mouseListeners.filter(l => l.name === e.action).forEach(({ el, name, listener }) => {
      // TODO: ignore detached, invisible and focused
      if (this._isMouseEventTarget(e, el)) {
        const ev = {  ...e, currentTarget: el, target: el, type: name }
        return notifyListener(listener, ev)
      } else {
        return false
      }
    })
  }

  private mouseListeners: RegisteredEventListener[] = []
  _isMouseEventTarget(e: ProgramMouseEvent, el: ProgramElement) {
    return e.x >= el.absoluteLeft && e.x < el.absoluteLeft + el.props.width &&
      e.y >= el.absoluteTop && e.y < el.absoluteTop + el.props.height
  }

  /** @internal */
  _registerEventListener(o: RegisteredEventListener): any {
    o.name = o.name.toLowerCase()
    const name = o.name.startsWith('on') ? o.name.substr(2) : o.name
    const keyPressed = name === 'keypress' || name === 'onkeypress' || name === 'onkeypressed'
    if (keyPressed || name.startsWith('key')) {
      // TODO: support on('key a')
      this.keyListeners.push(keyPressed ? { ...o, name: 'keypress' } : o)
    } else        {
      this.mouseListeners.push((name === 'click' ? { ...o, name: 'mouseup' } : { ...o, name }))
    }
  }

  /**
   * Triggers a mouse element of given type and on given coordinates.
   */
  triggerMouseEvent(e: Partial<ProgramMouseEvent> & {action: MouseAction, x: number, y: number}) {
    this.onMouse({ ...e as ProgramMouseEvent, button: e.button || 'left', action: e.action === 'click' ? MouseAction.mouseup : e.action })
  }

  /**
   * Triggers a key event with given properties.
   */
  triggerKeyEvent(ch: string | undefined, e: Partial<ProgramKeyEvent>= {}) {
    this.onKeyPress(ch, { ...e as ProgramKeyEvent })
  }

  /**
   * Triggers a click event on given element
   */
  click(el: ProgramElement): any {
    this.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: el.absoluteInnerLeft,
      y: el.absoluteInnerTop,
      button: 'left'
    })
  }
}

export function notifyListener<T extends EventTarget= EventTarget, E extends Event<T> = Event<T>>(l: KeyListener | MouseListener, ev: RemoveProperties<E, 'stopPropagation'>) {
  let stop = false;
  (l as any)({ ...ev, stopPropagation() {stop = true} } as any)
  return stop
}
