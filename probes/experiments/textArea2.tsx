import { Button, Component, ConcreteInputProps, createElement, debug, defaultInputProps, FlorDocument, isElement, KeyEvent, KeyPredicate, Layout, ProgramElement, SingleLineTextInputCursor, YogaElementProps } from '../../src'
import { baseProps } from '../../src/component/commonProps'
import { Flor } from '../../src/jsx/createElement'

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
  newLineKeys: e => e.name === 'enter'// ignore return because an enter are two presses enter + return ||e.name==='return'
  // newLineKeys: e=>(e.ctrl ) &&e.name==='r'

}

class TextArea extends Component<TextAreaProps> {
  protected lines: string[]
  private _currentLine: number
  protected p: Required<ConcreteTextAreaProps>
  lineEditors: SingleLineTextInputCursor[]
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

    // if(e.name==='enter'||e.name==='return') {
    //   return
    // }
    let preventEditorHandle = false
    if (!this.element) {
      return
    }
    if (this.p.changeKeys(e)) {
      // debug('changeKeys', this.p.changeKeys.toString(), {...e, currentTarget: undefined})
      this.element.props.value = this.element.props.input
      this.props.onChange && this.props.onChange({ ...e, currentTarget: this.element, value: this.element.props.value! })
      // e.stopPropagation()
      // return
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
      // debug(this.element.ownerDocument.outerHTML)
      // debug('BEFORE')

      // debug('lines', this.lines)
      // debug('editors', this.lineEditors.map(ed=>ed.value))
      // debug('elements', this.element.childNodes.map(c=>c.innerHTML))

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
      // debug('AFTER')

      // debug('lines', this.lines)
      // debug('editors', this.lineEditors.map(ed=>ed.value))
      // debug('elements', this.element.childNodes.map(c=>c.innerHTML))

      // debug(this.element.ownerDocument.outerHTML)
      // el1.
      // this.element.insertChild(this.currentLine, )
      // const el1 = Flor.render(this.createLineElement(line1), {parent: this.element})
      // const el2 =Flor.render( this.createLineElement(line2),   {parent: this.element})
      // this.element.childNodes.splice(this.currentLine, 1, el1, el2)
      // el1.forceUpdate(true)
      // el2.forceUpdate(true)

      // layoutChildren({layout: Layout['topDown'], el: this.element})
      // this.element.forceUpdate(true)
      // this.element.ownerDocument.body.forceUpdate(true)

      // this.element.height=this.lines.length
      // this.element.childNodes.filter(isElement).forEach((c, i)=>{
      //   c.top = i
      //   debug(i, c.innerHTML)
      // })
      this.element.forceUpdate(true)
      this.renderElement(this.element.parentElement)
      // this.element.ownerDocument.body.erase()
      // this.element.ownerDocument.body.render()

      // debug(this.element.ownerDocument.outerHTML)
      // debug(this.element.ownerDocument.outerHTML)
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

  render() {
    return <box focusable={true} onKeyPressed={this.onKey}
      {...this.props}
      layout={{ layout: Layout['topDown'] }}
    // onFocus={this.program!.new}
    >
      {this.lines.map(l =>
        <el width={.999} height={1} value={l} focusable={false}
          border={undefined} fg="white" bg="black" focus={undefined}>{l}
        </el>
      )}
    </box>
  }
}

try {
  test()

} catch (error) {
  debug(error)
}

async function test() {
  try {
    const flor = new FlorDocument({
      // documentImplementation: () => new YogaDocument()
    })

    // flor.program.alternateBuffer();
    // flor.program.put.keypad_xmit();
    // // flor.program.csr(0, flor.height - 1);
    // flor.program.hideCursor();
    // flor.program.cup(0, 0);
    // // We need flor for tmux now:
    // if (flor.program.tput.strings.ena_acs) {
    //   flor.program._write(flor.program.tput.enacs());
    // }

    // flor.program.alternate()
    // if ((flor.program.input as any).setRawMode && !(flor.program.input as any).isRaw) {
    //   (flor.program.input as any).setRawMode(true);
    //   (flor.program.input as any).resume();
    // }
    flor.focus.installDefaultChangeFocusKeys()

    const value = `
Dolor velit eiusmod in in amet et sit ex non ipsum enim.
Nostrud sint minim nostrud irure ullamco sit cillum veniam id commodo.
Velit occaecat pariatur minim enim aliqua tempor enim occaecat
nostrud aliquip. In veniam quis esse eiusmod. Laborum proident
exercitation excepteur culpa consequat laboris mollit et
irure labore eiusmod reprehenderit non.
  `
    // const value = `
    // Dolor velit
    // eiusmod in in amet
    // et sit ex non ipsum enim.
    // `.trim()
    const app = <el width={.9} height={.9} left={0} top={0}
      bg="white" fg="green"
    >
      hello!
    <Button   >click em</Button>

      <TextArea {...baseProps()}
        value={value}
        width={.5} height={.5} left={.2} top={3}
        bg="gray" fg="green"
      >
      </TextArea>

    </el>

    const le = flor.create(app)
    flor.render()

  } catch (error) {
    debug(error)
  }

}
