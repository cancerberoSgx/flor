import { Document } from '../dom';
import { EventManager, ProgramDocumentRenderer } from '../manager';
import { clicks } from '../manager/clicks';
import { CursorManager } from '../manager/cursorManager';
import { FocusManager } from '../manager/focusManager';
import { Deferred } from '../util/misc';
import { createElement } from './elementUtil';
import { ProgramElement } from './programElement';
import { FullProps } from './types';

interface Managers { events: EventManager, focus: FocusManager, renderer: ProgramDocumentRenderer, cursor: CursorManager }

export class ProgramDocument<E extends ProgramElement = ProgramElement> extends Document<E> {
  body: ProgramElement

  protected managers: Managers | undefined
  private registerListenerQueue: { type: 'event' | 'blur' | 'focus' | 'clicks', listener: any }[] = []

  constructor() {
    super()
    this.empty()
    this.body = this.createElement('body')
    this.appendChild(this.body)
  }

  get program() {
    return this.managers && this.managers.renderer.program
  }

  get renderer() {
    return this.managers && this.managers.renderer
  }

  get cursor() {
    return this.managers && this.managers.cursor
  }

  get focus() {
    return this.managers && this.managers.focus
  }

  get events() {
    return this.managers && this.managers.events
  }

  createElement(t: string): E {
    return new ProgramElement(t, this) as E
  }

  /**
   * better syntax for creating an element, setting properties, children and optionally parent.
   */
  create(props: Partial<FullProps>) {
    const el = createElement(this, props)
    this.body.appendChild(el)
    return el
  }

  managersReady = new Deferred<Managers>()
  /**
   * @internal
   */
  _setManagers(managers: Managers) {
    this.managers = managers
    this.program && this.body.props.assign({
      top: 0, left: 0, width: this.program.cols,
      height: this.program.rows, bg: 'black', fg: 'white'
    })
    this._emptyListenerQueue()
    this._setManagersListeners.forEach(l => l())
    this._setManagersListeners = []
    if (!this.managersReady) {
      this.managersReady = new Deferred<Managers>()
    }
    this.managersReady.resolve(managers)
  }

  private _setManagersListeners: (() => void)[] = []

  /**
   * @internal
   */
  _registerListener(l: { type: 'event' | 'blur' | 'focus' | 'clicks', listener: any }) {
    this.registerListenerQueue.push(l)
    if (this.managers) {
      this._emptyListenerQueue()
    }
  }

  private _emptyListenerQueue() {
    if (this.managers) {
      this.registerListenerQueue.forEach(l => {
        if (l.type === 'event') {
          this.managers!.events._registerEventListener(l.listener)
        } else if (l.type === 'focus') {
          this.managers!.focus.addFocusListener(l.listener)
        } else if (l.type === 'clicks') {
          clicks({ target: l.listener.el, handler: l.listener.listener })
        } else if (l.type === 'blur') {
          this.managers!.focus.addBlurListener(l.listener)
        }
      })
      this.registerListenerQueue.length = 0
    }
  }

  destroy() {
  }
}
