import { BorderStyle, Button, Component, debug, ElementProps, FlorDocument, Input, KeyEvent, Layout, ProgramElement } from '../../src'
import { baseProps } from '../../src/component/commonProps'
import { Flor } from '../../src/jsx/createElement'

interface P extends Partial<ElementProps> {

}
class TextArea extends Component<P> {

  protected lines: string[]

  constructor(p: P, s: {}) {
    super(p, s)
    this.lines = (this.props.value || '').split('\n')
    this.onKey = this.onKey.bind(this)
  }

  protected onKey(e: KeyEvent) {
    if (e.name === 'up') {
      const p = e.currentTarget!.previousSibling<ProgramElement>()
      if (p && p.props.classes && p.props.classes.includes('input-line')) {
        p.focus()
        e.stopPropagation()
      }
    } else if (e.name === 'down') {
      const p = e.currentTarget!.nextSibling<ProgramElement>()
      if (p && p.props.classes && p.props.classes.includes('input-line')) {
        p.focus()
        e.stopPropagation()
      }
    } else if (e.name === 'enter') {
      // create a new line TODO
    } else if (e.name === 'delete') {
      // perhaps delete a line
    } else if (e.name === 'backspace') {
      // perhaps delete a line
    }
  }

  render() {
    return <box
      {...this.props}
      layout={{ layout: Layout['topDown'], neverResizeContainer: true }}
    >hello
{this.lines.map((l, i) =>
      <Input width={.999} height={1} value={l} number={i} classes={['input-line']}
        border={undefined} fg="white" bg="black" focus={undefined}
        onKeyPressed={this.onKey}
        onInput={e => {
          this.lines[i] = e.input
        }}>
      </Input>
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
    flor.focus.installDefaultChangeFocusKeys()

    const value = `
Dolor velit eiusmod in in amet et sit ex non ipsum enim.
Nostrud sint minim nostrud irure ullamco sit cillum veniam id commodo.
Velit occaecat pariatur minim enim aliqua tempor enim occaecat
nostrud aliquip. In veniam quis esse eiusmod. Laborum proident
exercitation excepteur culpa consequat laboris mollit et
irure labore eiusmod reprehenderit non.
`
    const app = <el {...baseProps()} width={.9} height={.9} left={0} top={0}
      bg="white" fg="green"
      border={{ type: BorderStyle.round }}
      layout={{ layout: Layout['topDown'], neverResizeContainer: true }}
    >
      hello!
<Button {...baseProps()} >click em</Button>

      <TextArea {...baseProps()}
        value={value}
        width={.5} height={.5} left={.2} top={3}
        bg="gray" fg="green"
      // border={{ type: BorderStyle.round }}
      // // layout={{ layout: Layout['topDown'], neverResizeContainer: true }}
      >
      </TextArea>

    </el>

    const le = flor.create(app)
    // flor.render()

    flor.render()

    // flor.render()

    // const listener: KeyListener = e => {
    //   if (e.name === 'up') {
    //     const p = e.currentTarget!.previousSibling<ProgramElement>()
    //     if (p && p.props.classes && p.props.classes.includes('input-line')) {
    //       p.focus()
    //       e.stopPropagation()
    //     }
    //   }
    //   if (e.name === 'down') {
    //     const p = e.currentTarget!.nextSibling<ProgramElement>()
    //     if (p && p.props.classes && p.props.classes.includes('input-line')) {
    //       p.focus()
    //       e.stopPropagation()
    //     }
    //   }
    // }

    //   const lines = `
    // Dolor velit eiusmod in in amet et sit ex non ipsum enim.
    // Nostrud sint minim nostrud irure ullamco sit cillum veniam id commodo.
    // Velit occaecat pariatur minim enim aliqua tempor enim occaecat
    // nostrud aliquip. In veniam quis esse eiusmod. Laborum proident
    // exercitation excepteur culpa consequat laboris mollit et
    // irure labore eiusmod reprehenderit non.
    //   `.split('\n').filter(l => l.trim())
    //   const app = <el width={.5} height={.999} left={.2} top={3}bg="gray" fg="green"
    //   border={{ type: BorderStyle.round }}
    //   layout={{ layout: Layout['topDown'], neverResizeContainer: true }}>

    // {lines.map((l, i) =>
    // <Input width={.999} height={1} value={l} number={i} classes={['input-line']}
    // border={undefined} fg="white" bg="black" focus={undefined}
    // onKeyPressed={listener}
    // onChange={e => {
    //   lines[i] = e.value
    //   flor.debug(lines.join('\n'))
    // }}>
    // </Input>
    // )}
    // <Button onClick={e => {
    //   flor.debug(lines.join('\n'))
    // }}></Button>
    //   </el>

  } catch (error) {
    debug(error)
  }
}
