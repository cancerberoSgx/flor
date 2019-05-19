import { Component, ConcreteInputProps, createElement, defaultInputProps, isElement, KeyEvent, KeyPredicate, Layout, ProgramElement, SingleLineTextInputCursor, YogaElementProps } from '..'
import { Node } from '../dom'
import { Flor } from '../jsx/createElement'
import { ElementOfComponent } from '../programDom'
import { focusableProps } from './commonProps'

interface TextAreaProps extends Partial<ConcreteTextAreaProps>, Partial<YogaElementProps> {
}
interface ConcreteTextAreaProps extends ConcreteInputProps {
  currentLine?: number
  newLineKeys?: KeyPredicate
  upKeys?: KeyPredicate
  downKeys?: KeyPredicate
}
const defaultTextAreaProps: Required<ConcreteTextAreaProps> = {
  ...defaultInputProps,
  currentLine: 0,
  changeKeys: e => e.name === 'escape',
  downKeys: e => e.name === 'down',
  upKeys: e => e.name === 'up',
  // ignore return because an enter are two presses enter + return ||e.name==='return'
  newLineKeys: e => e.name === 'enter'
  // newLineKeys: e=>(e.ctrl ) &&e.name==='r'
}

export class TextArea extends Component<TextAreaProps> {
  protected lines: string[]
  private _currentLine: number
  protected p: Required<ConcreteTextAreaProps>
  protected lineEditors: SingleLineTextInputCursor[]

  constructor(p: TextAreaProps, s: {}) {
    super(p, s)
    this.p = { ...defaultTextAreaProps, ...this.props }
    this.lines = (this.props.value || '').split('\n')
    this.onKey = this.onKey.bind(this)
    this._currentLine = this.props.currentLine || 0
    this.lineEditors = this.lines.map(text => new SingleLineTextInputCursor({
      singleLine: true,
      text,
      pos: { col: 0, row: 0 },
      enabled: false
    })
    )
  }

  public get currentLine(): number {
    return this._currentLine
  }
  public set currentLine(value: number) {
    this._currentLine = value
    this.lineEditors.forEach(e => e.enabled = false)
    this.lineEditors[value].enabled = true
  }

  protected onKey(e: KeyEvent) {
    let preventEditorHandle = false
    if (!this.element) {
      return
    }
    if (this.p.changeKeys(e)) {
      this.element.props.value = this.element.props.input
      this.props.onChange && this.props.onChange({ ...e, currentTarget: this.element, value: this.element.props.value! })
    } else if (this.p.upKeys(e)) {
      if (this.currentLine > 0) {
        this.currentLine = this.currentLine - 1
        preventEditorHandle = true
      }
    } else if (this.p.downKeys(e)) {
      if (this.currentLine < this.lines.length - 1) {
        this.currentLine = this.currentLine + 1
        preventEditorHandle = true
      }
    } else if (this.p.newLineKeys(e)) {

      this.cursor!.hide({ name: 'textarea2' })
      const l = this.lines[this.currentLine]
      const ed = this.getCurrentLineEditor()
      const index = ed.pos.col
      const line1 = l.substring(0, index)
      const line2 = l.substring(index, l.length)
      this.lines.splice(this.currentLine, 1, line1, line2)
      const editor1 = this.createLineEditor(line1)
      const editor2 = this.createLineEditor(line2)
      this.lineEditors.splice(this.currentLine, 1, editor1, editor2)

      const el = this.getCurrentLineElement()
      const el1 = createElement(this.element.ownerDocument, { ...el.props.data, tagName: 'el', children: [line1] })
      const el2 = createElement(this.element.ownerDocument, { ...el.props.data, tagName: 'el', children: [line2] })
      el.remove()
      this.element.insertChild(this.currentLine, el1)
      this.element.insertChild(this.currentLine + 1, el2)
      this.element.forceUpdate(true)
      this.renderElement(this.element.parentElement)
      this.currentLine = this.currentLine + 1
      this.cursor!.show({ name: 'textarea2', top: el2.absoluteContentTop + editor2.pos.row, left: el2.absoluteContentLeft + editor2.pos.col })
      preventEditorHandle = true

    } else if (e.name === 'delete') {
      // perhaps delete a line
    } else if (e.name === 'backspace') {
      // perhaps delete a line
    }
    this.cursor!.hide({ name: 'textarea2' })

    const ed = this.getCurrentLineEditor()
    if (!preventEditorHandle) {
      ed.onKey(e)
    }
    const el = this.getCurrentLineElement()
    el.childNodes[0].textContent = ed.value
    this.lines[this.currentLine] = ed.value
    this.element.props.input = this.lines.join('\n')
    this.props.onInput && this.props.onInput({ ...e, currentTarget: this.element, input: this.element.props.input })
    this.renderElement()
    this.cursor!.show({ name: 'textarea2', top: el.absoluteContentTop + ed.pos.row, left: el.absoluteContentLeft + ed.pos.col })
  }

  protected getCurrentLineElement(): ProgramElement {
    const el = this.element!.childNodes.filter(isElement)[this.currentLine]
    if (!el) {
      throw new Error('cannot find element for current line ' + this.currentLine)
    }
    return el
  }

  protected createLineEditor(text: string) {
    return new SingleLineTextInputCursor({
      singleLine: true,
      text,
      pos: { col: 0, row: 0 },
      enabled: false
    })
  }

  protected getCurrentLineEditor(): SingleLineTextInputCursor {
    const ed = this.lineEditors[this.currentLine]
    if (!ed) {
      throw new Error('cannot find editor for current line ' + this.currentLine)
    }
    return ed
  }

  protected static elementType = 'flor.textArea'
  static is(n: Node): n is ElementOfComponent<TextArea> {
    return isElement(n) && n.props.elementType === TextArea.elementType
  }

  render() {
    return <box {...focusableProps()} focusable={true} onKeyPressed={this.onKey}
      {...this.props}
      layout={{ layout: Layout['topDown'] }}
      elementType={TextArea.elementType}
    >
      {this.lines.map(l =>
        <el width={.999} height={1} value={l} focusable={false}
          border={undefined} fg="white" bg="black" focus={undefined}>{l}
        </el>
      )}
    </box>
  }
}
