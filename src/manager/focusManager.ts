import { isAttached, isElement, ProgramDocument, ProgramElement } from '..';
import { ProgramMouseEvent } from '../declarations/program';
import { filterDescendants, findDescendant } from '../dom/nodeUtil';
import { BlurEvent, FocusEvent } from '../programDom';
import { EventManager, notifyListener } from './eventManager';

/**
 *
 * TODO: focusNext and focusPrev element order policy customization
 */
export class FocusManager<T extends ProgramElement = ProgramElement> {

  constructor(private events: EventManager, protected document: ProgramDocument) {
    this.onMouseUp = this.onMouseUp.bind(this)
    this.events.addBeforeAllMouseListener('mouseup', this.onMouseUp)
  }

  private _focused: ProgramElement | undefined

  protected onMouseUp(e: ProgramMouseEvent) {
    const target = findDescendant<ProgramElement>(this.document.body, n => {
      return isElement(n) && !!n.props.focusable && this.events._isMouseEventTarget(e, n) && n.props.focusOnClick
    }, { childrenFirst: true, andSelf: true })

    this.dispatchFocusChanged(target)
  }

  protected focusListeners: { els?: T[], listener: (e: FocusEvent<T>) => boolean | void }[] = []
  protected blurListeners: { els?: T[], listener: (e: BlurEvent<T>) => boolean | void }[] = []

  private dispatchFocusChanged(target: ProgramElement | undefined) {
    const previous = this.focused
    if (previous === target) {
      return
    }
    this._focused = target
    const focusEvent = { currentTarget: target, target, previous, type: 'focus' }
    const blurEvent = { currentTarget: previous, target: previous, focused: target, type: 'blur' }
    let stopFocus = false
    let stopBlur = false
    if (target) {
      stopFocus = !!target.props.onFocus && notifyListener(target.props.onFocus, focusEvent)
      target.props.focused = true
    }
    if (previous) {
      stopBlur = !!previous.props.onBlur && notifyListener(previous.props.onBlur, blurEvent)
      previous.props.focused = false
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

  /**
   * Current element with focus
   */
  get focused() {
    return this._focused
  }

  /**
   * Setting the property will change the current focused element triggering focus and blur events.
   */
  set focused(el: ProgramElement | undefined) {
    if (this.locked) {
      return
    }
    if (!el || el.visible && isAttached(el) && el.props.focusable) {
      this.dispatchFocusChanged(el)
    } else {
      throw new Error('Element must be visible and attached and have property focusable on true.')
    }
  }

  /**
   * Makes [[el]] to loose focus (if have it) and optionally makes [[focused]] the new focused element.
   */
  blur(el: ProgramElement, focused?: ProgramElement) {
    this.focused = focused
  }

  /**
   * Add a listener t be notified when a new element gain focus. If targets is not given, it will notify all focus events that happen on all elements.
   */
  addFocusListener(l: { targets?: T[], listener: (e: FocusEvent<T>) => boolean | void }) {
    this.focusListeners.push(l)
  }

  /**
   * Add a listener t be notified when the current focused element looses focus.. If targets is not given, it will notify all blur events that happen on all elements.
   */
  addBlurListener(l: { els?: T[], listener: (e: BlurEvent<T>) => boolean | void }) {
    if (!this.focusListeners.find(ll => l !== ll)) {
      this.focusListeners.push(l)
    }
  }

  /**
   * Change [[focused]] element to the next element visible element in the document with property [[focusable]] value true. By default there is no policy to find it  but the calls `focusNext() ; focusPrevious` should return to the previous focused element.
   */
  focusNext() {
    if (this.locked) {
      return
    }
    const focusables = filterDescendants<ProgramElement>(this.document.body, n => isElement(n) && !!n.props.focusable)
    const current = focusables.findIndex(f => f === this.focused)
    const target = focusables[current >= (focusables.length - 1) ? 0 : (current + 1)]
    this.dispatchFocusChanged(target)
  }

  /**
   * Change [[focused]] element to the previous element visible element in the document with property [[focusable]] value true. By default there is no policy to find it but the calls `focusNext() ; focusPrevious` should return to the previous focused element.
   */
  focusPrevious() {
    if (this.locked) {
      return
    }
    const focusables = filterDescendants<ProgramElement>(this.document.body, n => isElement(n) && !!n.props.focusable)
    const current = focusables.findIndex(f => f === this.focused)
    const target = focusables[current <= 0 ? focusables.length - 1 : current - 1]
    this.dispatchFocusChanged(target)
  }

  private _locked = false
  /**
   * If true the focus won't change.
   */
  public get locked() {
    return this._locked
  }
  public set locked(value) {
    this._locked = value
  }

  installDefaultChangeFocusKeys() {
    this.events.preppedKeyListener(e => {
      if (e.name === 'tab' && !this.locked) {
        if (!e.shift) {
          this.focusNext()
          e.stopPropagation()
        } else if (e.shift) {
          this.focusPrevious()
          e.stopPropagation()
        }
      }
    })
  }
}
