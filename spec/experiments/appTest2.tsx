import { BorderStyle, Component, debug, FlorDocument, TextArea, YogaDocument, YogaElement, Button, Input } from '../../src'
import { Box } from '../../src/component/box'
import { Flor } from '../../src/jsx/createElement'
import { nextTick } from '../../src/util/misc'
const flor = new FlorDocument<YogaElement>({
  installDefaultChangeFocusKeys: true,
  installLoggers: true
})

interface P {

}
const someText = `
Sunt nulla ullamco anim consectetur commodo elit laborum. 
Veniam ullamco irure amet minim qui commodo irure Lorem fugiat aute laboris cillum est. 
Lorem id consequat qui ea amet tempor minim esse minim amet. 
Ad deserunt aute cillum voluptate tempor. 
Ea cupidatat ea velit mollit mollit. 
Aliqua ut minim aliquip tempor id irure amet tempor nisi ea enim quis mollit nisi. 
Ex enim occaecat nostrud irure ex qui.
`.trim()
class App extends Component<P> {
  render() {
    // return   <TextArea focused={true} top={10} left={18} width={33} height={23} bg="blue" text={'text'} pos={{ col: 0, row: 0 }}
    // enabled={true} ></TextArea>
    return <Box height={.999} width={.999}    >
            
      <Box id="left-column" width={.65} height={.999}         >

        <Box width={.999}   border={{ type: BorderStyle.round }} height={.3}
        ></Box>
        <Box id="output-panel" width={.999} height={.7} top={.3}          >
      <TextArea width={.99} height={.99}  text={someText} pos={{ col: 0, row: 0 }}  enabled={true} ></TextArea>
      </Box>
      </Box>
      <Box id="right-column" width={.35} left={.65} height={.999}
        >
        <Box width={.999} height={.3}           >
      <Button>click me</Button>
        </Box>
        <Box width={.999} height={.3} top={.3}     ch="6">
        <Input>some text</Input>
        </Box>
        <Box width={.999}  height={.4} top={.7}>
      <TextArea width={.99} height={.99}  text={someText} pos={{ col: 12, row: 2 }}  enabled={true} ></TextArea>
        </Box>

      </Box>
    </Box>
  }
}
// const app =

// flor.focus.installDefaultChangeFocusKeys()
const le = flor.create(<App />)

// flor.program.on('resize', () => {
//   flor.body.width = flor.program.cols
//   flor.body.height = flor.program.rows
//   // flor.body.forceUpdate(true)

//   le.width = flor.program.cols
//   le.height = flor.program.rows

//   // le.doLayout()
//   le.forceUpdate(true)
//   nextTick(() => flor.render())
// })

flor.render()
// debug(flor.body.outerHTML)
