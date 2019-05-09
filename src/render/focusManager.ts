import { ProgramMouseEvent } from '../declarations/program'
import { Event } from '../dom/event'
import { filterDescendants, findDescendant } from '../dom/nodeUtil'
import { isElement, ProgramDocument, ProgramElement } from '../programDom'
import { EventManager, notifyListener } from './eventManager'

export class FocusManager {

  constructor(private events: EventManager, protected document: ProgramDocument) {
    this.onMouseUp = this.onMouseUp.bind(this)
    this.events.addBeforeAllMouseListener({ name: 'mouseup', listener :  this.onMouseUp })
  }

  private _focused: ProgramElement | undefined

  get focused() {
    return this._focused
  }

  protected onMouseUp(e: ProgramMouseEvent) {
    const target = findDescendant<ProgramElement>(this.document.body, n => {
      return isElement(n) &&  !!n.props.focusable && this.events._isMouseEventTarget(e, n)
    }, { childrenFirst: true })

    this.dispatchFocused(target)
  }

  protected focusListeners: {els?: ProgramElement[], listener: (e: FocusEvent) => boolean | void}[] = []
  protected blurListeners: {els?: ProgramElement[], listener: (e: BlurEvent) => boolean | void}[] = []

  private dispatchFocused(target: ProgramElement | undefined) {
    const previous = this.focused
    if (previous === target) {
      return
    }
    this._focused = target
    const focusEvent = {  currentTarget: target, target , previous, type: 'focus' }
    const blurEvent = { currentTarget: previous, target: previous, focused: target, type: 'blur' }
    let stopFocus = false
    let stopBlur = false
    if (target) {
      target.props.focused = true
      stopFocus = !!target.props.onFocus && notifyListener(target.props.onFocus, focusEvent)
    }
    if (previous) {
      previous.props.focused = false
      stopBlur = !!previous.props.onBlur && notifyListener(previous.props.onBlur, blurEvent)
    }
    !stopFocus && this.focusListeners.some(l => {
      if (!l.els || l.els.find(e => e === focusEvent.currentTarget)) {
        return notifyListener(l.listener as any, focusEvent as any)
      }
      return false
    })
    !stopBlur && this.blurListeners.some(l => {
      if (!l.els || l.els.find(e => e === blurEvent.currentTarget)) {
        return notifyListener(l.listener as any, blurEvent as any)
      }
      return false
    })
  }

  addFocusListener(l: {els?: ProgramElement[], listener: (e: FocusEvent) => boolean | void}) {
    if (!this.focusListeners.find(ll => l !== ll)) {
      this.focusListeners.push(l)
    }
  }
  addBlurListener(l: {els?: ProgramElement[], listener: (e: BlurEvent) => boolean | void}) {
    if (!this.focusListeners.find(ll => l !== ll)) {
      this.focusListeners.push(l)
    }
  }

  focusNext() {
    const focusables = filterDescendants<ProgramElement>(this.document.body, n => isElement(n) && !!n.props.focusable)
    const current = focusables.findIndex(f => f === this.focused)
    const target = focusables[current >= focusables.length - 1 ? 0 : current + 1]
    this.dispatchFocused(target)
  }

  focusPrevious() {
    const focusables = filterDescendants<ProgramElement>(this.document.body, n => isElement(n) && !!n.props.focusable)
    const current = focusables.findIndex(f => f === this.focused)
    const target = focusables[current <= 0 ? focusables.length - 1 : current - 1]
    this.dispatchFocused(target)
  }
}

export interface FocusEvent extends Event {
  previous?: ProgramElement
}

export interface BlurEvent extends Event {
  focused?: ProgramElement
}
