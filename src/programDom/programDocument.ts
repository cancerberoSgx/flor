import { Document } from '../dom'
import { EventManager } from '../render'
import { FocusManager } from '../render/focusManager'
import { createElement } from '../util/util'
import { ProgramElement } from './programElement'
import { FullProps } from './types'

export class ProgramDocument extends Document {

  body: ProgramElement
  protected managers: { events: EventManager; focus: FocusManager; } | undefined
  // /** @internal */
  // _getEventManager() {
  //   return this.events
  // }
  get program() {
    return this.managers &&  this.managers.events.program
  }
  constructor() {
    super()
    this.body =  this.createElement('body')
    this.appendChild(this.body)
  }

  createElement(t: string) {
    return new ProgramElement(t, this)
  }

  /**
   * better syntax for creating an element, setting properties, children and optionally parent.
   */
  create(props: Partial<FullProps>) {
    const el = createElement(this, props)
    this.body.appendChild(el)
    return el
  }

  _setManagers(managers: {events: EventManager, focus: FocusManager}) {
    this.managers = managers
    this.program && this.body.props.assign({ top: 0, left: 0, width: this.program.cols, height: this.program.rows, bg: 'black', fg: 'white'
    // border: { type: BorderStyle.round }
    })
    this._emptyListenerQueue()
  }

  private registerListenerQueue: {type: 'event' | 'blur' | 'focus', listener: any}[] = []

  _registerListener(l: {type: 'event' | 'blur' | 'focus' , listener: any}) {
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
        } else if (l.type === 'blur') {
          this.managers!.focus.addBlurListener(l.listener)
        }
      })
      this.registerListenerQueue.length = 0
    }
  }

  static is(d: any): d is ProgramDocument {
    return !!(d && d.body && (d as ProgramDocument).createElement && (d as ProgramDocument).create)
  }
}
