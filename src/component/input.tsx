import { Component, Flor } from '../jsx'
import { ElementProps, ProgramDocument, ProgramElement } from '../programDom'

interface InputProps extends Partial<ElementProps> {
  onInput?: (e: { currentTarget: ProgramElement, input: string }) => void
  onChange?(e: { currentTarget: ProgramElement, value: string }): void
  value?: string
}

export class Input extends Component<InputProps, {}> {
  protected focused: boolean = false
  constructor(p: InputProps, s: {}) {
    super(p, s)
  }
  render() {
    return <box focusable={true} {...{ ...this.props, onChange: undefined, onInput: undefined, value: undefined }}
      onFocus={e => {
        // debug('focus')
        this.focused = true
        this.program!.saveCursor('Input')
        this.program!.cursorPos(this.element!.absoluteContentTop, this.element!.absoluteContentLeft + (this.element!.props.input || '').length)
        this.program!.showCursor()
        // this.renderElement()
      }}
      onBlur={e => {
        // debug('blur '+this.element!.props.input)
        this.handleChangeValue()
        // this.focused = false
        // this.program!.restoreCursor('Input')
        // this.program!.saveCursor('Input')
        // this.program!.cursorPos(this.element!.absoluteContentTop, this.element!.absoluteContentLeft + (this.element!.props.input || '').length)
        // this.program!.showCursor()
      }}
      onKeyPressed={e => {
        // debug(e.name)
        if (!this.element || !this.focused) {
          return
        }
        this.element.props.input = this.element.props.input || ''
        if (e.name === 'enter') {
          this.handleChangeValue()
          // debug('value: *'+this.element!.props.value+'*', 'input: *'+this.element!.props.input+'*', 'buff: *'+this.renderer!.printBuffer()+'*')
        } else if (e.name === 'backspace') {
          this.setInput(this.element.props.input.substring(0, this.element.props.input.length - 1))
          // this.program!._write(this.program!.tput.key_backspace)
          // this.program!.tput.key_backspace()
          // this.element!.childNodes.item(0)!.textContent = this.element.props.input
        } else if (e.ch || e.sequence) {
          this.setInput(this.element.props.input + (e.ch || e.sequence))
          // this.element.props.input += (e.ch || e.sequence)
          // this.element!.childNodes.item(0)!.textContent = this.element.props.input
          // this.program!._write(e.ch || e.sequence)
          // this.props.onInput && this.props.onInput({ ...e, currentTarget: e.currentTarget!, input: (this.element.props.input || '') })
          // this.renderElement()
        }
      }}
    >
      {(this.element && this.element.props.input || '')}
    </box>
  }

  protected setInput(s: string) {
    this.element!.props.input = s
    this.element!.childNodes.item(0)!.textContent = this.element!.props.input || ''
    this.props.onInput && this.props.onInput({ currentTarget: this.element!, input: (this.element!.props.input || '') })
    this.renderElement()
  }

  private handleChangeValue() {
    this.focused = false
    this.program!.restoreCursor('Input')
    this.program!.hideCursor()
    // if(this.element!.props.value !== this.element!.props.input) {
    this.element!.props.value = this.element!.props.input || ''
    this.props.onChange && this.props.onChange({ currentTarget: this.element!, value: (this.element!.props.input || '') })
    // }
    this.renderElement()
  }
}

export function input(props: InputProps & { document: ProgramDocument }) {
  return Flor.render(<Input {...props} />, { document: props.document })
}
