import { BorderStyle, debug, ElementProps, FlorDocument, Layout } from '../../src'
import { Component } from '../../src/jsx/component'
import { Flor } from '../../src/jsx/createElement'

try {

  interface InputProps extends Partial<ElementProps> {
  onInput?: (e: {currentTarget: Input, input: string}) => void
  onChange?: (e: {currentTarget: Input, value: string}) => void
  value?: string
}
  class Input extends Component<InputProps, {}> {
  protected input: string = ''
  constructor(p: InputProps, s: {}) {
    super(p,s)
    this.input = p.value || ''
  }
  render() {
    return <box focusable={true} height={3} border={{ type: BorderStyle.round }} {...{ ...this.props, onChange: undefined, inInput: undefined }}
    onClick={e => {
      this.program!.saveCursor('Input')
      this.program!.cursorPos(this.element!.absoluteContentLeft + this.input.length,this.element!.absoluteContentTop)
      this.program!.showCursor()
    }}
            onKeyPressed={e => {
              if (!this.element || !this.element.props.focused || !e.ch) {
                return
              }
              if (e.name === 'enter') {
                this.element.props.focused = false
                this.program!.restoreCursor('Input')
                this.program!.hideCursor()
                this.props.onChange && this.props.onChange({ ...e, currentTarget: this , value: this.input })
              }
              this.input += e.sequence
              this.program!._write(e.ch)
              return false
            }}
            >
            {this.input}
            </box>
  }

}

  const flor = new FlorDocument()
  flor.renderer.program.enableMouse()
  flor.body.props.assign({ top: 0, left: 0, width: flor.program.cols, height: flor.program.rows })
  flor.render()
  const app = <box width={.99} height={.999} bg="gray" fg="green" border={{ type: BorderStyle.round }} layout={{ layout: Layout['top-down'], neverResizeContainer: true }}>

    <box height={.19}  width={.99} left={0} padding={{ bottom: 1, top: 1, left: 1, right: 1 }} border={{ type: BorderStyle.round }} bg="red" layout={{ layout: Layout['left-right'], neverResizeContainer: true }}
    >
      {/* <box width={.5} height={.97} border={{ type: BorderStyle.heavy }} bg="blue"
      onClick={e=>{
flor.program.cursorPos(e.y, e.x)
flor.program.showCursor()
      }} onKeyPressed={e=>{
        flor.debug(flor.body)
        flor.render()
      }}>
        click me
      </box> */}

      <Input width={.5} height={.97} border={{ type: BorderStyle.heavy }} bg="blue" onChange={e => flor.debug(e.value)}></Input>
      <box width={.46} height={.999} border={{ type: BorderStyle.double }} bg="magenta">
       click me
      </box>
    </box>

    <box height={0.39} width={.99} bg="cyan" fg="black">
      box2</box>

    <box height={0.37} width={.99}  bg="blue" fg="black">
      box3</box>
  </box>

  flor.program.hideCursor()
  const le = flor.create(app)
  flor.render()

  //  flor.debug(flor.body)

} catch (error) {
  debug(error)
}
