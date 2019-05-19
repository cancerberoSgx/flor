import { PropertyOptional, RemoveProperties } from 'misc-utils-of-mine-generic'
import { ProgramElement } from '..'
import { MouseAction, Program, ProgramKeyEvent, ProgramMouseEvent } from '../declarations/program'
import { Node } from '../dom';
import { RegisteredEventListener, KeyListener, RegisteredGlobalEventListener, MouseEvent, StopPropagation, Event, MouseListener } from '..';

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
      return  notifyListener(l.listener, { type: l.name, ch, ...e, currentTarget: l.el  }as any)
    })
  }

  private keyListeners: (PropertyOptional<RegisteredEventListener, 'el'>)[] = []

  /**
   * Adds a key event listener [[l]]. if [[el]] is passed it will be notified only when given element emits
   * key events, otherwise on any key event.
   */
  addKeyListener(l: KeyListener, el?: ProgramElement, name= 'keypress') {
    if (!this.keyListeners.find(k => k.listener === l && k.el === el && k.name === name)) {
      this.keyListeners.push({ name, listener: l , el })
    }
  }

  private mouseListeners: RegisteredEventListener[] = []

  private beforeAllMouseListeners: RegisteredGlobalEventListener[] = []

  /**
   * Adds a mouse event listener that is notified before "common" mouse event listeners added with . Unlike
   * addMouseListener, the listener accepts
   */
  addBeforeAllMouseListener(name: string, listener: (e: MouseEvent & StopPropagation) => boolean | void) {
    // if (!this.beforeAllMouseListeners.find(ll => l !== ll)) {
    this.beforeAllMouseListeners.push({ name: this.toProgramEventName(name).name, listener })// .name === 'click' ? { ...l, name: 'mouseout' } : l)
    // }
  }

  /**
   * Register a mouse event listener for a particular mouse event type in a particular element instance [[el]]
   */
  addMouseListener(listener: (e: MouseEvent) => void, el: ProgramElement, name: string) {
    if (!el) {
      this.addBeforeAllMouseListener(name, listener)
    } else {
      this._registerEventListener({ name, listener, el })
      if (!this.mouseListeners.find(l => l.el === el && l.listener === listener && l.name === name)) {
        this.mouseListeners.push({ name, listener, el })
      }
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
        const ev = {  ...e, currentTarget: el, type: name }
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

  /**
   * The main function that resolves names from element props like onClick to program event names like
   * 'mouseup'.
   *
   * @internal
   * */
  _registerEventListener(o: RegisteredEventListener): any {
    const { name,type } = this.toProgramEventName(o.name)
    if (type === 'key') {
      // TODO: support on('key a')
      this.keyListeners.push({ ...o, name })
    } else        {
      this.mouseListeners.push({ ...o, name })
    }
  }

  private toProgramEventName(n: string) {
    n = n.toLowerCase()
    let name = n.startsWith('on') ? n.substr(2) : n
    name = name === 'click' ? 'mouseup' : (name === 'keypress' || name === 'onkeypress' || name === 'onkeypressed') ? 'keypress'  : name
    const keyPressed = name === 'keypress' || name === 'onkeypress' || name === 'onkeypressed'
    const type = (keyPressed || name.startsWith('key')) ? 'key' : 'mouse'
    return { name, type }
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
}

export function notifyListener<T extends Node= Node, E extends Event<T> = Event<T>>(l: KeyListener | MouseListener, ev: RemoveProperties<E, 'stopPropagation'>) {
  let stop = false;
  (l as any)({ ...ev, stopPropagation() {stop = true} } as any)
  return stop
}
