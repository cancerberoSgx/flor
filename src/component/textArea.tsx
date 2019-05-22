import { KeyEvent } from '../../src'
import { focusableProps } from '../../src/component/commonProps'
import { Component } from '../../src/jsx'
import { Flor } from '../../src/jsx/createElement'
import { TextInputCursorMulti, TextInputCursorOptions } from '../util'
import { InputProps } from './input'

interface TextAreaProps extends Partial<ConcreteTextAreaProps>, Partial<InputProps> {
}
interface ConcreteTextAreaProps extends TextInputCursorOptions {

}

export class TextArea extends Component<TextAreaProps> {
  editor: TextInputCursorMulti
  protected cursorName: string
  constructor(p: TextAreaProps, s: {}) {
    super(p, s)
    this.editor = new TextInputCursorMulti({
      ...this.props
    })
    this.cursorName = TextArea.elementType + this.internalId
  }

  protected lineProps = { left: 0, width: .99, height: 1, border: undefined, padding: undefined }

  protected onKey(e: KeyEvent) {
    if (!this.cursor || !this.element) {
      return
    }
    this.cursor.hide({ name: this.cursorName })
    this.editor.onKey(e)
    const el = this.element
    el.empty()
    this.editor.value.split('\n').forEach((line, i) => {
      el.create({ children: [line], top: i, ...this.lineProps })
    })
    el.childNodes[0].textContent = this.editor.value
    el.render()
    this.props.onInput && this.props.onInput({ ...e, currentTarget: this.element, input: this.editor.value })
    this.renderElement()
    this.cursor.show({
      name: this.cursorName,
      top: el.absoluteContentTop + this.editor.pos.row,
      left: el.absoluteContentLeft + this.editor.pos.col
    })
  }

  protected static elementType = 'flor.textArea'

  render() {
    return <el {...focusableProps()} {...this.props}
      onFocus={e => {
        if (this.cursor && this.element) {
          this.cursor.show({
            name: this.cursorName,
            top: this.element.absoluteContentTop + this.editor.pos.row,
            left: this.element.absoluteContentLeft + this.editor.pos.col
          })
          this.props.onFocus && this.props.onFocus(e)
        }
      }}
      onBlur={e => {
        if (this.cursor && this.element) {
          this.cursor.hide({ name: this.cursorName })
          this.props.onBlur && this.props.onBlur(e)
        }
      }}
      onKeyPressed={e => {
        if (!this.cursor || !this.element) {
          return
        }
        this.editor.onKey(e)
        this.element.empty()
        this.editor.value.split('\n').forEach((line, i) => {
          this.element!.create({ children: [line], top: i, ...this.lineProps })
        })
        this.element.childNodes[0].textContent = this.editor.value
        this.element.render()
        this.cursor.show({
          name: this.cursorName,
          top: this.element.absoluteContentTop + this.editor.pos.row,
          left: this.element.absoluteContentLeft + this.editor.pos.col
        })
        this.props.onKeyPressed && this.props.onKeyPressed(e)
      }}
    >{this.editor.getValueLines().map((line, i) => <el {...{ top: i, ...this.lineProps }}>{line}</el>)}
    </el>
  }
}
