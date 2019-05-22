import { isElement, KeyEvent } from '../../src'
import { focusableProps } from '../../src/component/commonProps'
import { Node } from '../../src/dom'
import { Component } from '../../src/jsx'
import { Flor } from '../../src/jsx/createElement'
import { ElementOfComponent } from '../../src/programDom'
import { TextInputCursorMulti, TextInputCursorOptions } from '../util'
import { InputProps } from './input'

interface TextAreaProps extends Partial<ConcreteTextAreaProps>, Partial<InputProps> {
}
interface ConcreteTextAreaProps extends TextInputCursorOptions {

}

export class TextArea extends Component<TextAreaProps> {
  editor: TextInputCursorMulti
  constructor(p: TextAreaProps, s: {}) {
    super(p, s)
    this.editor = new TextInputCursorMulti({
      ...this.props
    })
  }

  protected onKey(e: KeyEvent) {
    if (!this.cursor || !this.element) {
      return
    }
    this.cursor.hide({ name: TextArea.elementType })
    this.editor.onKey(e)
    const el = this.element
    el.empty()
    this.editor.value.split('\n').forEach((line, i) => {
      el.create({ children: [line], top: i, left: 0, width: .99, height: 1 })
    })
    el.childNodes[0].textContent = this.editor.value
    el.render()
    this.cursor.show({
      name: 'cursorTextEditorTest1', top: el.absoluteContentTop + this.editor.pos.row, left: el.absoluteContentLeft + this.editor.pos.col
    })
    this.props.onInput && this.props.onInput({ ...e, currentTarget: this.element, input: this.editor.value })
    this.renderElement()
    this.cursor.show({ name: TextArea.elementType, top: el.absoluteContentTop + this.editor.pos.row, left: el.absoluteContentLeft + this.editor.pos.col })
  }

  protected static elementType = 'flor.textArea'
  static is(n: Node): n is ElementOfComponent<TextArea> {
    return isElement(n) && n.props.elementType === TextArea.elementType
  }

  render() {
    return <el {...focusableProps()} {...this.props}
      onKeyPressed={e => {
        if (!this.cursor || !this.element) {
          return
        }
        this.editor.onKey(e)
        this.element.empty()
        this.editor.value.split('\n').forEach((line, i) => {
          this.element!.create({ children: [line], top: i, left: 0, width: .99, height: 1 })
        })
        this.element.childNodes[0].textContent = this.editor.value
        this.element.render()
        this.cursor.show({
          name: TextArea.elementType, top: this.element.absoluteContentTop + this.editor.pos.row, left: this.element.absoluteContentLeft + this.editor.pos.col
        })
      }}
    >{this.editor.getValueLines().map((line, i) => <el {...{ top: i, left: 0, width: .99, height: 1 }}>{line}</el>)}
    </el>
  }
}
