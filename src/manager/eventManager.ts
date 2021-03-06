import { PropertyOptional, RemoveProperties } from 'misc-utils-of-mine-generic';
import { Event, KeyListener, MouseEvent, MouseListener, ProgramElement, RegisteredEventListener, RegisteredGlobalEventListener, StopPropagation } from '..';
import { MouseAction, Program, ProgramKeyEvent, ProgramMouseEvent } from '../declarations/program';
import { Node } from '../dom';

type E<T = ProgramElement> = T extends ProgramElement ? T : never

/**
 * Manager class responsible of registering and dispatching keyboard and mouse events.
 */
export class EventManager {

  constructor(protected _program: Program) {
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onMouse = this.onMouse.bind(this)
    this._program.on('keypress', this.onKeyPress)
    this._program.on('mouse', this.onMouse)
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
    this.keyListeners
      .filter(l => !l.el || l.el.props.focused)
      .some(l => {
        return notifyListener(l.listener, { type: l.name, ch, ...e, currentTarget: l.el } as any)
      })
  }

  private keyListeners: (PropertyOptional<RegisteredEventListener, 'el'>)[] = []

  /**
   * Adds a key event listener [[l]]. if [[el]] is passed it will be notified only when given element emits
   * key events, otherwise on any key event.
   */
  addKeyListener(l: KeyListener, el?: ProgramElement, name = 'keypress') {
    if (!this.keyListeners.find(k => k.listener === l && k.el === el && k.name === name)) {
      this.keyListeners.push({ name, listener: l, el })
    }
  }

  preppedKeyListener(l: KeyListener, el?: ProgramElement, name = 'keypress') {
    if (!this.keyListeners.find(k => k.listener === l && k.el === el && k.name === name)) {
      this.keyListeners.splice(0, 0, ({ name, listener: l, el }))
    }
  }

  /**
   * Removes a previously added key listener with [[addKeyListener]].
   */
  removeKeyListener<T extends ProgramElement = ProgramElement>(listener: KeyListener<T>, el: T, name: string) {
    this.keyListeners = this.keyListeners.filter(l => !(l.el === el && l.listener === listener && (l.name === name || l.name === this.toProgramEventName(name).name)))
  }

  private mouseListeners: RegisteredEventListener[] = []

  private beforeAllMouseListeners: RegisteredGlobalEventListener[] = []

  /**
   * Adds a mouse event listener that is notified before "common" mouse event listeners added with . Unlike
   * addMouseListener, the listener accepts
   */
  addBeforeAllMouseListener<T extends ProgramElement = ProgramElement>(name: string, listener: (e: MouseEvent & StopPropagation) => boolean | void) {
    // if (!this.beforeAllMouseListeners.find(ll => l !== ll)) {
    this.beforeAllMouseListeners.push({ name: this.toProgramEventName(name).name, listener })// .name === 'click' ? { ...l, name: 'mouseout' } : l)
    // }
  }

  /**
   * Register a mouse event listener for a particular mouse event type in a particular element instance [[el]].
   */
  addMouseListener<T extends ProgramElement = ProgramElement>(listener: (e: MouseEvent) => void, el: T, name: string) {
    if (!el) {
      this.addBeforeAllMouseListener(name, listener)
    } else {
      this._registerEventListener({ name, listener, el })
    }
  }

  /**
   * Removes a previously added MouseListener with [[addMouseListener]].
   */
  removeMouseListener<T extends ProgramElement = ProgramElement>(listener: MouseListener<T>, el: T, name: string) {
    this.mouseListeners = this.mouseListeners.filter(l => !(l.el === el && l.listener === listener && (l.name === name || l.name === this.toProgramEventName(name).name)))
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
      const ev = { ...e }
      return notifyListener(l.listener as any, ev as any)
    })
    if (r) {
      return
    }
    this.mouseListeners.filter(l => l.name === e.action).forEach(({ el, name, listener }) => {
      // TODO: ignore detached, invisible and focused
      if (this._isMouseEventTarget(e, el)) {
        const ev = { ...e, currentTarget: el, type: name }
        return notifyListener(listener, ev)
      } else {
        return false
      }
    })
  }

  _isMouseEventTarget(e: ProgramMouseEvent, el: ProgramElement) {
    return e.x >= el.absoluteLeft && e.x < el.absoluteLeft + el.props.width &&
      e.y >= el.absoluteTop && e.y < el.absoluteTop + el.props.height
  }

  _registerEventListener<T extends ProgramElement = ProgramElement>(o: RegisteredEventListener<T>): any {
    const { name, type } = this.toProgramEventName(o.name)
    if (type === 'key') {
      // TODO: support on('key a')
      this.keyListeners.push({ ...o, name })
    } else {
      this.mouseListeners.push({ ...o, name })
    }
  }

  /**
   * Resolves names from element props like onClick to program event names like 'mouseup'.
   */
  protected toProgramEventName(n: string) {
    n = n.toLowerCase()
    let name = n.startsWith('on') ? n.substr(2) : n
    name = name === 'click' ? 'mouseup' : (name === 'keypress' || name === 'onkeypress' || name === 'onkeypressed') ? 'keypress' : name
    const keyPressed = name === 'keypress' || name === 'onkeypress' || name === 'onkeypressed'
    const type = (keyPressed || name.startsWith('key')) ? 'key' : 'mouse'
    return { name, type }
  }

  /**
   * Triggers a mouse element of given type and on given coordinates.
   */
  triggerMouseEvent(e: Partial<ProgramMouseEvent> & { action: MouseAction, x: number, y: number }) {
    this.onMouse({ ...e as ProgramMouseEvent, button: e.button || 'left', action: e.action === 'click' ? MouseAction.mouseup : e.action })
  }

  /**
   * Triggers a key event with given properties.
   */
  triggerKeyEvent(ch: string | undefined, e: Partial<ProgramKeyEvent> = {}) {
    this.onKeyPress(ch, { ...e as ProgramKeyEvent })
  }

  /**
   * Triggers a click event on given element.
   */
  click(el: ProgramElement): any {
    this.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: el.absoluteInnerLeft,
      y: el.absoluteInnerTop,
      button: 'left'
    })
  }

  destroy() {
    this._program.off('keypress', this.onKeyPress)
    this._program.off('mouse', this.onMouse)
    this.keyListeners = []
    this.mouseListeners = []
    this.beforeAllMouseListeners = []
  }

}

/**
 * calls given event listener with given event object, supporting stopPropagation() event method. Returns true if handler calls event.stopPropagation() orhterwise false.
 * @internal
 */
export function notifyListener<T extends Node = Node, E extends Event<T> = Event<T>>(l: KeyListener | MouseListener, ev: RemoveProperties<E, 'stopPropagation'>) {
  return emitEventWithStopPropagation(l, ev)
}
/**
 * A generic verion of [[notifyListener]] so it can be used without strict typechecking by outside modules.
 */
export function emitEventWithStopPropagation(listener?: (...args: any[]) => any, ev?: any) {
  if (listener && ev) {
    let stop = false
    listener({ ...ev, stopPropagation() { stop = true } })
    return stop
  }
  return false
}
