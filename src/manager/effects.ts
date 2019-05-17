import { ProgramElement, ProgramDocument } from '../programDom';
import { YogaElement } from '../yogaDom';
import { FocusManager, FocusEvent, BlurEvent } from './focusManager';
import { CommonElementImpl } from '../jsx';

interface State {
  dirty: boolean
}
export class StyleEffectsManager {

  private _state: State[] = []
  previous: YogaElement | undefined;
  onFocus(e: FocusEvent<YogaElement>) {
    const previous = e.previous || this.previous
    const focused = e.currentTarget
    if (focused === previous) {
      return
    }
    this.setNotFocusedStyle(previous)
    this.setFocusedStyle(focused)
    this.previous = focused
  }
  get(e?: YogaElement): State | undefined {
    if (!e) {
      return
    }
    let s = this._state[e.internalId]
    if (!s) {
      s = {
        dirty: true
      }
      this._state[e.internalId] = s
    }
    return s
  }
  setFocusedStyle(focused?: YogaElement) {
    const s = this.get(focused)
    if (!s || !s.dirty) {
      return
    }
    // focused.props.focus


  }
  setNotFocusedStyle(previous: YogaElement | undefined) {
    if (!previous) {
      return
    }
  }
  // onBlur(e: BlurEvent) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(protected options: Options) {
    this.onFocus = this.onFocus.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.options.focusManager.addFocusListener({ listener: this.onFocus })
    // this.options.focusManager.addBlurListener(this.onBlur)

  }
}
interface Options<T extends YogaElement = YogaElement> {
  focusManager: FocusManager<YogaElement>
  document: ProgramDocument
  getFocusedExtraStyle?(el: T): Partial<YogaElement>
}