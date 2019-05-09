import { ElementProps, ProgramElement, ProgramDocument } from '../programDom';
import { Component, Flor } from '../jsx';

// import { Component, ElementProps, Flor, ProgramDocument, ProgramElement } from '..'

interface InputProps extends Partial<ElementProps> {
  onInput?: (e: { currentTarget: ProgramElement, input: string }) => void
  onChange?(e: { currentTarget: ProgramElement, value: string }) : void
  value?: string
}

export class Input extends Component<InputProps, {}> {
  constructor(p: InputProps, s: {}) {
    super(p, s)
  }
  render() {
    return <box focusable={true} {...{ ...this.props, onChange: undefined, onInput: undefined, value: undefined }}
      onClick={e => {
        this.program!.saveCursor('Input')
        this.program!.cursorPos(this.element!.absoluteContentTop, this.element!.absoluteContentLeft + (this.element!.props.input || '').length)
        this.program!.showCursor()
      }}
      onKeyPressed={e => {
        if (!this.element || !this.element.props.focused) {
          return
        }
        this.element.props.input = this.element.props.input || ''
        if (e.name === 'enter') {
          this.element.props.focused = false
          this.program!.restoreCursor('Input')
          this.program!.hideCursor()
          this.element.props.value = this.element.props.input || ''
          this.props.onChange && this.props.onChange({ ...e, currentTarget: e.currentTarget!, value: (this.element.props.input || '') })
        } else if (e.ch || e.sequence) {
          this.element.props.input += (e.ch || e.sequence)
          this.program!._write(e.ch || e.sequence)
          this.props.onInput && this.props.onInput({ ...e, currentTarget: e.currentTarget!, input: (this.element.props.input || '') })
        }
      }}
    >
      {(this.element && this.element.props.input || '')}
    </box>
  }
}

export function input(props: InputProps & { document: ProgramDocument }) {
  return Flor.render(<Input {...props} />, { document: props.document })
}
