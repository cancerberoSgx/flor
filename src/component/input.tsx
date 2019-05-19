import { ElementProps, KeyEvent, KeyPredicate, ProgramDocument, ProgramElement } from '..'
import { Component, Flor } from '../jsx'
import { SingleLineTextInputCursor } from '../manager/textInputCursor'
import { focusableProps } from './commonProps';
import { YogaElementProps } from '../yogaDom';

interface InputProps extends JSX.PropsWithRef<Partial<YogaElementProps>>, ConcreteInputProps {

}

export interface ConcreteInputProps {
  /**
   * Emitted when the user writs or deletes text in the input. Notice that the user didn't explicitly gestured
   * a change in the value, he is just writing text. For subscribing for when the user explicitly changes the
   * value (like when pressing enter), use [[onChange]].
   */
  onInput?: (e: { currentTarget: ProgramElement, input: string }) => void

  /**
   * Emitted when the user explicitly gestures a change in the value, like when pressing enter, or blur.
   */
  onChange?(e: { currentTarget: ProgramElement, value: string }): void

  /**
   * Initial value for the input.
   */
  value?: string

  /**
   * Keys to change the value. By default is ENTER.
   */
  changeKeys?: KeyPredicate

  /**
   * Change the value on blur? By default is true.
   */
  changeOnBlur?: boolean

  /**
   * Input looses focus when user changes the value (pressing enter)
   */
  blurOnChange?: boolean

  /**
   * Keys that will enable the input again when the element is focused but the input is disabled. This only
   * applies when [[blurOnChange]] is false. By default is ENTER.
 */
  enableInputKeys?: KeyPredicate

  /**
   * Keys that will disable the input without making the element to loose focus and without changing the
   * value. This only applies when [[blurOnChange]] is false. By default is ESC.
   */
  disableInputKeys?: KeyPredicate
}

export const defaultInputProps: Required<ConcreteInputProps> = {
  onInput(e) { },
  onChange(e) { },
  changeKeys: e => !e.ctrl && e.name === 'enter',
  changeOnBlur: true,
  blurOnChange: true,
  value: '',
  enableInputKeys: e => !e.ctrl && e.name === 'enter',
  disableInputKeys: e => !e.ctrl && e.name === 'escape'
}

/**
 * A single line input text box. Will show the cursor and let the user input text when focused. When user
 * writes or deletes text it will emit [[onInput]] and when the user explicitly changes the value (like when
 * pressing enter) it will call [[onChange]].
 *
 * TODO: I should be able to create a form that auto-focus my element so is ready to input.
 */
export class Input extends Component<InputProps, {}> {

  protected p: Required<ConcreteInputProps>
  protected boxEl: ProgramElement | undefined
  protected textInputCursorManager: SingleLineTextInputCursor | undefined

  constructor(p: InputProps, s: {}) {
    super(p, s)
    this.p = { ...defaultInputProps, ...this.props }
    this.onKeyPressed = this.onKeyPressed.bind(this)
    this.input = this.props.value || this.input || ''
  }

  protected handleChangeValue() {
    if (this.element) {
      this.element.props.value = this.element.props.input || ''
      this.props.onChange && this.props.onChange({ currentTarget: this.element, value: (this.element.props.input || '') })
      this.disableInput()
    }
  }

  get value() {
    return this.props.value || ''
  }

  /**
   * Setting this property will cause the element to loose focus
   */
  set value(i: string) {
    if (i !== this.props.value) {
      this.props.value = i
      this.handleChangeValue()
    }
  }

  get input() {
    return this.element && this.element.props.input || ''
  }

  /**
   * Setting this property will change the input text in the screen and call  `this.props.onInput` if any.
   */
  set input(s: string) {
    if (this.element) {
      this.element.props.input = s
      this.element.childNodes[0].textContent = this.element.props.input || ''
      this.props.onInput && this.props.onInput({ currentTarget: this.element, input: (this.element.props.input || '') })
    }
  }

  protected onKeyPressed(e: KeyEvent) {
    if (!this.element) {// || !this.element.props.focused) {
      return
    }
    if (this.p.changeKeys(e)) {
      this.handleChangeValue()
    }
    // call text input cursor listener and then get the resulting state (pos and value) and update our state.
    this.textInputCursorListener && this.textInputCursorListener(e)

    this.input = this.textInputCursorManager!.value

    this.renderElement()

    this.cursor!.setPosition({
      row: this.element.absoluteContentTop + this.textInputCursorManager!.pos.row,
      col: this.element.absoluteContentLeft + this.textInputCursorManager!.pos.col
    })
  }

  /**
   * Calling this method  will make the  textInputCursorManager to change its state (pos and value).
   */
  private textInputCursorListener(e: KeyEvent<ProgramElement>) {
    return
  }

  /**
   * Makes the element to show the cursor and let the user input text. The element must be focused.
   */
  inputEnable() {
    if (this.textInputCursorManager) {
      this.textInputCursorManager.enabled = true
    }
    if (this.element && this.element.props.focused && this.cursor) {
      this.cursor.show({
        name: 'Input',
        top: this.element.absoluteContentTop + this.textInputCursorManager!.pos.row,
        left: this.element.absoluteContentLeft + this.textInputCursorManager!.pos.col
      })
    }
    this.renderElement()
  }

  /**
   * Will hide the cursor forbidding the user to keep writing input text. If this.props.blurOnChange (true by
   * default) then it will also remove focus from the element.
   */
  disableInput() {
    if (this.element && this.props.blurOnChange && this.element.props.focused) {
      this.element.blur()
    }
    if (this.cursor) {
      this.cursor.hide({ name: 'Input' })
    }
    if (this.textInputCursorManager) {
      this.textInputCursorManager.enabled = false
    }
    this.renderElement()
  }

  render() {
    return <el {...focusableProps()} ref={Flor.createRef<ProgramElement>(c => this.boxEl = c)}  {...{ ...this.props, onChange: undefined, onInput: undefined, value: undefined }}
      onFocus={e => {
        this.inputEnable()
        if (this.props.onFocus) {
          this.props.onFocus(e)
        }
      }}
      onBlur={e => {
        this.disableInput()
        if (this.props.changeOnBlur) {
          this.handleChangeValue()
        }
        if (this.props.onBlur) {
          this.props.onBlur(e)
        }
      }}
      onKeyPressed={this.onKeyPressed}
      afterRender={() => {
        // HEADS UP! at this point, we are absolutely sure the ref was resolved and the element is attached
        if (!this.textInputCursorManager) {
          this.textInputCursorManager = new SingleLineTextInputCursor({
            singleLine: true,
            text: this.input,
            pos: { col: 0, row: 0 },
            addKeyListener: l => this.textInputCursorListener = l,
            enabled: true
          })
          this.inputEnable()
        }
      }}
    >
      {this.props.value || this.input || ''}
    </el>
  }

}

export function input(props: InputProps & { document: ProgramDocument }) {
  return Flor.render(<Input {...props} />, { document: props.document })
}
