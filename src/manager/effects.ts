import { ProgramDocument, FocusEvent } from '../programDom'
import { YogaElement } from '../yogaDom'
import { FocusManager } from './focusManager'

interface State {
  dirty: boolean
}
export class StyleEffectsManager {

  private _state: State[] = []
  previous: YogaElement | undefined
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
    if (!e || !e.props.focus) {
      return
    }
    let s = this._state[e.internalId]
    if (!s) {
      s = {
        dirty: !!e.props.focus
      }
      this._state[e.internalId] = s
    }
    return s
  }
  setFocusedStyle(focused?: YogaElement) {
    const s = this.get(focused)
    if (!focused || !s || !s.dirty) {
      return
    }
    const focusStyle = focused.props.focus!.data
    // const currentStyle = Object.keys(focused.props.data)
    const focusedKeys =  Object.keys(focusStyle.data)
    const diff = Object.keys(focused.props.data).filter
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
