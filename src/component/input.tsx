import { KeyEvent, KeyPredicate, ProgramDocument, ProgramElement, SingleLineTextInputCursor } from '..';
import { Component, Flor } from '../jsx';
import { emitEventWithStopPropagation } from '../manager';
import { ElementProps, InputEventTarget } from '../programDom';
import { focusableProps, inputEventTargetDefaultProps } from './commonProps';

export interface InputProps extends JSX.PropsWithRef<Partial<ElementProps>>, Partial<ConcreteInputProps> {

}

export interface ConcreteInputProps extends InputEventTarget {

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
  ...inputEventTargetDefaultProps(),
  blurOnChange: true, // TODO: move to   InputEventTarget and perhaps the rest too
  enableInputKeys: e => e.name === 'enter',
  disableInputKeys: e => e.name === 'escape'
}

/**
 * A single line input text box. Will show the cursor and let the user input text when focused. When user
 * writes or deletes text it will emit [[onInput]] and when the user explicitly changes the value (like when
 * pressing enter) it will call [[onChange]].
 *
 * TODO: I should be able to create a form that auto-focus my element so is ready to input.
 */
export class Input extends Component<InputProps, {}> {

  protected p: Required<ConcreteInputProps> & InputEventTarget
  protected boxEl: ProgramElement | undefined
  protected textInputCursorManager: SingleLineTextInputCursor

  constructor(p: InputProps, s: {}) {
    super(p, s)
    this.p = { ...defaultInputProps, ...this.props }
    this.onKeyPressed = this.onKeyPressed.bind(this)
    this.textInputCursorManager = new SingleLineTextInputCursor({
      singleLine: true,
      text: this.props.value || '',
      pos: { col: 0, row: 0 },
      addKeyListener: l => this.textInputCursorListener = l,
      enabled: true
    })
  }

  protected handleChangeValue() {
    if (this.element) {
      this.element.props.value = this.element.props.input || ''

      return emitEventWithStopPropagation(this.props.onChange, { currentTarget: this.element, value: (this.element.props.input || '') })
    }
  }

  /**
   * Setting this property will change the input text in the screen and call  `this.props.onInput` if any.
   */
  set input(s: string) {
    if (this.element) {
      this.element.props.input = s
      this.element.childNodes[0].textContent = this.element.props.input || ''
      emitEventWithStopPropagation(this.props.onInput, { currentTarget: this.element, input: (this.element.props.input || '') })
    }
  }

  protected onKeyPressed(e: KeyEvent) {
    if (this.props.onKeyPressed && this.props.onKeyPressed(e)) {
      return true
    }
    if (!this.element || !this.element.props.focused) {
      return
    }
    if (this.p.changeKeys(e)) {
      this.handleChangeValue()
      return
    }
    // call text input cursor listener and then get the resulting state (pos and value) and update our state.
    this.textInputCursorListener && this.textInputCursorListener(e)
    this.input = this.textInputCursorManager.value
    this.renderElement()
    this.cursor!.setPosition({
      row: this.element.absoluteContentTop + this.textInputCursorManager.pos.row,
      col: this.element.absoluteContentLeft + this.textInputCursorManager.pos.col
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
    this.renderElement()
    if (this.element && this.element.props.focused && this.cursor) {
      this.cursor.show({
        name: 'Input',
        top: this.element.absoluteContentTop + this.textInputCursorManager.pos.row,
        left: this.element.absoluteContentLeft + this.textInputCursorManager.pos.col
      })
    }
  }

  /**
   * Will hide the cursor forbidding the user to keep writing input text. If this.props.blurOnChange (true by
   * default) then it will also remove focus from the element.
   */
  disableInput() {
    if (this.element && this.props.blurOnChange && this.element.props.focused) {
      this.element.blur()
    }
    this.textInputCursorManager.enabled = false
    this.renderElement()
    if (this.cursor) {
      this.cursor.hide({ name: 'Input' })
    }
  }

  render() {
    return <el {...focusableProps()} width={.4} height={3} ref={Flor.createRef<ProgramElement>(c => this.boxEl = c)}  {...{ ...this.props, onChange: undefined, onInput: undefined, value: undefined }}
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
      input={this.props.value || ''}
    >
      {this.props.value || ''}
    </el>
  }

}

export function input(props: InputProps & { document: ProgramDocument }) {
  return Flor.render(<Input {...props} />, { document: props.document })
}
