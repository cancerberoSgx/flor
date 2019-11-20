import { clone, notSameNotFalsy, objectFilter } from 'misc-utils-of-mine-generic';
import { FocusEvent, ProgramElement, StyleProps, StylePropsImpl } from '../programDom';
import { FocusManager } from './focusManager';

interface State {
  normalProps?: Partial<StyleProps>
  focusProps?: Partial<StyleProps>
}

interface Options<T extends ProgramElement = ProgramElement> {
  focusManager: FocusManager<T>
  focusExtraProps?: Partial<StyleProps>
  normalExtraProps?: Partial<StyleProps>
}

export class StyleEffectsManager<T extends ProgramElement = ProgramElement> {

  protected _state: State[] = []

  protected previous: T | undefined

  constructor(protected options: Options<T>) {
    this.onFocus = this.onFocus.bind(this)
    this.options.focusManager.addFocusListener({ listener: this.onFocus })
  }

  protected onFocus(e: FocusEvent<T>) {
    const previous = e.previous || this.previous
    const focused = e.currentTarget
    if (focused === previous) {
      return
    }
    this.setNotFocusedStyle(previous)
    this.setFocusedStyle(focused)
    this.previous = focused
  }

  protected getFocusValidProps(props: StylePropsImpl) {
    return { ...props.attrs, ...objectFilter(props.data, k => typeof k === 'string' && this.focusProps.includes(k)) }
  }

  protected focusProps = ['padding', 'border', 'layout', 'noFill']

  /**
   * Valid properties that apply to focused elements are all of [[Attrs]] and also, from [[StyleProps]]:
   * `padding`, `border`, `layout`, `noFill`. Use this method to add more.
   */
  addFocusProps(p: string[]) {
    this.focusProps = [...this.focusProps, ...p].filter(notSameNotFalsy)
  }
  protected get(e?: T): State | undefined {
    if (!e || !e.props.focus) {
      return
    }
    let s = this._state[e.internalId]
    if (!s) {
      const focusProps: Partial<StyleProps> = {
        ...this.options.focusExtraProps,
        ...this.getFocusValidProps(e.props),
        ...this.getFocusValidProps((e.props.focus as StylePropsImpl))
      }
      const normalProps = {
        ...this.options.normalExtraProps,
        ...this.getFocusValidProps(e.props)
      }
      s = {
        focusProps,
        normalProps
      }
      this._state[e.internalId] = s
    }
    return s
  }

  protected setFocusedStyle(el?: T) {
    const s = this.get(el)
    if (!el || !s) {
      return
    }
    el.props.assign(clone(s.focusProps))
    el.ownerDocument.body.render()
  }

  protected setNotFocusedStyle(el: T | undefined) {
    const s = this.get(el)
    if (!s || !el) {
      return
    }
    el.props.assign(clone(s.normalProps || {}))
    el.ownerDocument.body.render()
  }

  addNormalExtraProps(styles: Partial<StyleProps>) {
    this.options.normalExtraProps = { ...this.options.normalExtraProps || {}, ...styles }
  }

  addFocusExtraProps(styles: Partial<StyleProps>) {
    this.options.focusExtraProps = { ...this.options.focusExtraProps || {}, ...styles }
  }
}
