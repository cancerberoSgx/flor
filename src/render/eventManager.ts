import { MouseAction, Program, ProgramKeyEvent, ProgramMouseEvent } from '../declarations/program'
import { Event, EventTarget, StopPropagation } from '../dom/event'
import { ProgramElement } from '../programDom'
import { debug } from '../util'
import { RemoveProperties } from '../util/misc'
import { unique } from 'misc-utils-of-mine-generic';

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
 * auxiliary class that bind events with ProgramElements rendered by renderer
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

  protected onKeyPress(ch: string | undefined, e: ProgramKeyEvent) {
    this.keyListeners.some(l => {
      return  notifyListener(l.listener, { type: l.name, ch, ...e, currentTarget: l.el, target: l.el }as any)
    })
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
    if (this._ignoreMouse) return
    const r = this.beforeAllMouseListeners.filter(l => l.name === e.action).some(l => {
      const ev = {  ...e }
      return notifyListener(l.listener as any, ev as any)
    })
    if (r) {
      return
    }
    this.mouseListeners.filter(l => l.name === e.action).forEach(({ el, name, listener }) => {
      // // for (; i < self.clickable.length; i++) {
        // //   el = self.clickable[i];
        // if(el.v)
        // if (el.detached || !el.visible) {                                              ignore retached - invisible listeners
        //   continue;
        // }
        //   // if (self.grabMouse && self.focused !== el                                       IGNORE FOCUSED
        //   //     && !el.hasAncestor(self.focused)) continue;
        //   pos = el.lpos;
        //   if (!pos) continue;

      if (this._isMouseEventTarget(e, el)) {
        const ev = {  ...e, currentTarget: el, target: el, type: name }
        return notifyListener(listener, ev)
        // if (e.action === 'mouseup' && name === 'click') {
        //   if (notifyListener(listener, { ...ev, type: 'click' })) {
        //     return
        //   }
        // }
        //     el.emit('mouse', data);
        //     if (data.action === 'mousedown') {
        //       self.mouseDown = el;                                                         // DRAG
        //     } else if (data.action === 'mouseup') {
        //       (self.mouseDown || el).emit('click', data);
        //       self.mouseDown = null;                                                       // DRAG
        //     } else if (data.action === 'mousemove') {
        //       if (self.hover && el.index > self.hover.index) {
        //         set = false;
        //       }
        //       if (self.hover !== el && !set) {
        //         if (self.hover) {
        //           self.hover.emit('mouseout', data);                                     // MOUSEOUT
        //         }
        //         el.emit('mouseover', data);                                               // MOUSEOUT
        //         self.hover = el;
        //       }
        //       set = true;
        //     }
        //     el.emit(data.action, data);
        //     break;
        //   }
      } else {
        return false
      }
      // // Just mouseover?
      // if ((data.action === 'mousemove'
      //     || data.action === 'mousedown'
      //     || data.action === 'mouseup')
      //     && self.hover
      //     && !set) {
      //   self.hover.emit('mouseout', data);                                               // MOUSEOUT
      //   self.hover = null;
      // }

    })
  }

  private mouseListeners: RegisteredEventListener[] = []
  private keyListeners:( RemoveProperties<RegisteredEventListener, 'el'>&{el?: ProgramElement})[] = []
addKeyListener(l: KeyListener) {
  if(!this.keyListeners.find(k=>k.listener===l)){
    this.keyListeners.push({name: 'keypress', listener: l  })
  }
}
  _isMouseEventTarget(e: ProgramMouseEvent, el: ProgramElement) {
    return e.x >= el.absoluteLeft && e.x < el.absoluteLeft + el.props.width &&
      e.y >= el.absoluteTop && e.y < el.absoluteTop + el.props.height
  }

  /** @internal */
  _registerEventListener(o: RegisteredEventListener): any {
    const n = o.name.toLowerCase()
    const keyPressed = n === 'keypress' || n === 'onkeypress' || n === 'onkeypressed'
    if (keyPressed || n.startsWith('key') 
    && !this.keyListeners.find(l => l.el === o.el)
    ) {
      this.keyListeners.push(keyPressed ? { ...o, name: 'keypress' } : o)
    } else 
    if (!this.mouseListeners.find(l => l.el === o.el)) 
    {
      // TODO: verify is mouse event
      this.mouseListeners.push((o.name === 'click' ? { ...o, name: 'mouseup' } : o))
    } 
    else {
      debug('WARNING: ignoring event listener registration because already registered:', o)
    }
  }

  triggerMouseEvent(e: Partial<ProgramMouseEvent> & {action: MouseAction,
    x: number, y: number}) {
    this.onMouse({ ...e as ProgramMouseEvent, button: e.button || 'left' })
  }

  triggerKeyEvent(ch: string | undefined, e: Partial<ProgramKeyEvent>= {}) {
    this.onKeyPress(ch, { ...e as ProgramKeyEvent })
  }
}

export function notifyListener<T extends EventTarget= EventTarget, E extends Event<T> = Event<T>>(l: KeyListener | MouseListener, ev: RemoveProperties<E, 'stopPropagation'>) {
  let stop = false;
  (l as any)({ ...ev, stopPropagation() {stop = true} } as any)
  return stop
}
