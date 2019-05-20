import { FocusEvent, ProgramElement, StyleProps } from '../programDom'
import { FocusManager } from './focusManager'

interface State {
  dirty: boolean
  notFocusedStyle?: Partial<StyleProps>
}

interface Options<T extends ProgramElement = ProgramElement> {
  focusManager: FocusManager<T>
  focusedExtraStyles?: Partial<StyleProps>
  normalExtraStyles?: Partial<StyleProps>
}

export class StyleEffectsManager<T extends ProgramElement = ProgramElement> {

  private _state: State[] = []
  protected previous: T | undefined

  constructor(protected options: Options<T>) {
    this.onFocus = this.onFocus.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.options.focusManager.addFocusListener({ listener: this.onFocus })
  }

  onFocus(e: FocusEvent<T>) {
    const previous = e.previous || this.previous
    const focused = e.currentTarget
    if (focused === previous) {
      return
    }
    this.setNotFocusedStyle(previous)
    this.setFocusedStyle(focused)
    this.previous = focused
  }

  protected get(e?: T): State | undefined {
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

  protected setFocusedStyle(focused?: T) {
    const s = this.get(focused)
    if (!focused || !s || !s.dirty || !focused.props.focus || !focused.props.focus.data) {
      return
    }
    const focusStyle = { ...this.options.focusedExtraStyles || {}, ...focused.props.focus.data }
    // TODO: if default style changes after this moment, we will loose the changes. Perhaps we need to remove the if()
    if (!s.notFocusedStyle) {
      const focusedKeys = Object.keys(focusStyle)
      s.notFocusedStyle = { ...this.options.normalExtraStyles || {} }
      focusedKeys.forEach(k => {
        (s.notFocusedStyle as any)[k] = focused.props.data[k]
      })
    }
    focused.props.assign(focusStyle)
    focused.render()
  }

  protected setNotFocusedStyle(previous: T | undefined) {
    const s = this.get(previous)
    if (!previous || !s || !s.dirty || !s.notFocusedStyle) {
      return
    }
    previous.props.assign(s.notFocusedStyle)
    previous.render()
  }

  setNormalExtraStyles(styles: Partial<StyleProps>) {
    this.options.normalExtraStyles = { ...this.options.normalExtraStyles || {}, ...styles }
  }

  setFocusedExtraStyles(styles: Partial<StyleProps>) {
    this.options.focusedExtraStyles = { ...this.options.focusedExtraStyles || {}, ...styles }
  }
}
