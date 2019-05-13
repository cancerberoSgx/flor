import { Component, Flor } from '../jsx'
import { ElementProps, ProgramDocument, ProgramElement } from '../programDom'

interface InputProps extends Partial<ElementProps> {
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
}

/**
 * A single line input text box. Will show the cursor and let the user input text when focused. When user writes or deletes text it will emit [[onInput]] and when the user explicitly changes the value (like when pressing enter) it will call [[onChange]]
 */
export class Input extends Component<InputProps, {}> {

  protected focused: boolean = false

  constructor(p: InputProps, s: {}) {
    super(p, s)
  }

  get value(){
    return this.props.value||''
  }
  set value(i: string){
    if(i!==this.props.value){
      this.props.value = i
      this.handleChangeValue()
    }
  }
  get input(){
    return this.element && this.element.props.input||''
  }
  set input(s: string){
    if(!this.element){
      return 
    }
    this.element.props.input = s
    this.element.childNodes.item(0)!.textContent = this.element.props.input || ''
    this.props.onInput && this.props.onInput({ currentTarget: this.element, input: (this.element.props.input || '') })
    this.renderElement()
  }
 
  private handleChangeValue() {
    this.focused = false
    this.cursor && this.cursor.hide({name: 'Input'});
    this.element!.props.value = this.element!.props.input || ''
    this.props.onChange && this.props.onChange({ currentTarget: this.element!, value: (this.element!.props.input || '') })
    this.renderElement()
  }

  render() {
    return <box focusable={true} {...{ ...this.props, onChange: undefined, onInput: undefined, value: undefined }}
      onFocus={e => {
        this.focused = true
        this.cursor && this.cursor.show({
          name:'Input',
          top: this.element!.absoluteContentTop,
           left: this.element!.absoluteContentLeft + (this.element!.props.input || '').length 
          })
      }}
      onBlur={e => {
        this.handleChangeValue()
      }}
      onKeyPressed={e => {
        if (!this.element || !this.focused) {
          return
        }
        // this.element.props.input = this.element.props.input || ''
        if (e.name === 'enter') {
          this.handleChangeValue()
        } else if (e.name === 'backspace') {
          this.input = this.input.substring(0, this.input.length - 1)
        } else if (e.ch || e.sequence) {
          this.input = this.input + (e.ch || e.sequence)
        }
      }}
    >
      {this.props.value||this.input||''}
    </box>
  }

}

export function input(props: InputProps & { document: ProgramDocument }) {
  return Flor.render(<Input {...props} />, { document: props.document })
}

