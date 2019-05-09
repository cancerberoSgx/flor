import { ProgramMouseEvent } from '../declarations/program'
import { StopPropagation } from '../dom/event'
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

    this.notifyFocusListeners(target)
  }

  protected focusListeners: {els?: ProgramElement[], listener: (e: FocusEvent) => boolean | void}[] = []

  private notifyFocusListeners(target: ProgramElement | undefined) {
    const previous = this.focused
    this._focused = target
    if (target) {
        target.props.focused = true
      }
    const ev = {  currentTarget: this.focused, target: this.focused, previous }
    this.focusListeners.some(l => {
      if (!l.els || l.els.find(e => e === this.focused)) {
        return notifyListener(l.listener as any, ev as any)
      }
      return false
    })
  }

  addBeforeAllMouseListener(l: {els?: ProgramElement[], listener: (e: FocusEvent) => boolean | void}) {
    if (!this.focusListeners.find(ll => l !== ll)) {
      this.focusListeners.push(l)
    }
  }

  focusNext() {
    const focusables = filterDescendants<ProgramElement>(this.document.body, n => isElement(n) && !!n.props.focusable)
    const current = focusables.findIndex(f => f === this.focused)
    const target = focusables[current >= focusables.length - 1 ? 0 : current + 1]
    this.notifyFocusListeners(target)
  }

  focusPrevious() {
    const focusables = filterDescendants<ProgramElement>(this.document.body, n => isElement(n) && !!n.props.focusable)
    const current = focusables.findIndex(f => f === this.focused)
    const target = focusables[current <= 0 ? focusables.length - 1 : current - 1]
    this.notifyFocusListeners(target)
  }
}

interface FocusEvent extends StopPropagation {
  currentTarget?: ProgramElement
  target?: ProgramElement
  previous?: ProgramElement
}
