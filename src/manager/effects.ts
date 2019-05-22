import { FocusEvent, ProgramElement, StyleProps } from '../programDom'
import { FocusManager } from './focusManager'
import { objectKeys } from 'misc-utils-of-mine-generic';
import { debug } from '../util';

interface State {
  dirty: boolean
  normalProps?: Partial<StyleProps>
  focusProps?: Partial<StyleProps>
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
      const focusedStyle:Partial<StyleProps> = { ...this.options.focusedExtraStyles || {}, ...e.props.data, ...e.props.data.focus||{} }
      const notFocusedStyle = { ...this.options.normalExtraStyles, ... e.props.data}
      // objectKeys(focusStyle).forEach(k => {
      //   notFocusedStyle[k] = focused.resolvePropValue(k )
      // })
      s = {
        dirty: !!e.props.focus,
        focusProps: focusedStyle,
        normalProps: notFocusedStyle
      }
      this._state[e.internalId] = s
    }
    return s
  }

  protected setFocusedStyle(focused?: T) {
    const s = this.get(focused)
    if (!focused || !s || !s.dirty ||!s.focusProps) {
      return
    }
   
    // TODO: if default style changes after this moment, we will loose the changes. Perhaps we need to remove the if()
    
    focused.props.assign(s.focusProps)
    focused.render()//{preventSiblingCascade: true, preventChildrenCascade: true})
  }

  protected setNotFocusedStyle(previous: T | undefined) {
    const s = this.get(previous)
    if (!previous || !s || !s.dirty || !s.normalProps) {
      return
    }
    debug(JSON.stringify(s.normalProps, null, 2))
    // console.log(s.notFocusedStyle);
    
    previous.props.assign(s.normalProps)
    previous.render()//{preventSiblingCascade: true, preventChildrenCascade: true})
  }

  setNormalExtraStyles(styles: Partial<StyleProps>) {
    this.options.normalExtraStyles = { ...this.options.normalExtraStyles || {}, ...styles }
  }

  setFocusedExtraStyles(styles: Partial<StyleProps>) {
    this.options.focusedExtraStyles = { ...this.options.focusedExtraStyles || {}, ...styles }
  }
}
