import { BorderStyle, Component, debug, FlorDocument, YogaDocument, YogaElement } from '../../src'
import { Box } from '../../src/component/box'
import { Flor } from '../../src/jsx/createElement'
import { nextTick } from '../../src/util/misc'
import { FLEX_DIRECTION_COLUMN_REVERSE, FLEX_DIRECTION_ROW } from '../../src/yogaDom/types'
const flor = new FlorDocument<YogaElement>({
  documentImplementation: () => new YogaDocument()
})

interface P {

  }
class App extends Component<P> {
  render() {
    return <Box   height={.999} width={.999}
      flexDirection={ FLEX_DIRECTION_ROW}
    >
      <Box id="left-column" width={.65} height={.999} flexShrink={1}
        flexDirection={ FLEX_DIRECTION_COLUMN_REVERSE}>

        <Box width={.999} flexShrink={1} border={{ type: BorderStyle.round }} height={.3}
        fg="red"
        ></Box>
        <Box id="output-panel" width={.999} height={.7} flexShrink={1}
     ch="/"
        >
        </Box>
      </Box>
      <Box id="right-column" width={.35} flexShrink={1} height={.999}
        flexDirection={FLEX_DIRECTION_COLUMN_REVERSE}>
        <Box width={.999} height={.3} flexShrink={1}
        ch="."
        >
        </Box>
        <Box width={.999} height={.3}
          flexShrink={1}
          // flexGrow={1}
          ch="6">
        </Box>
        <Box width={.999} flexShrink={1} height={.4}></Box>
      </Box>
    </Box>
  }
}
  // const app =

flor.focus.installDefaultChangeFocusKeys()
const le = flor.create(<App/>)

flor.program.on('resize', () => {
  flor.body.width = flor.program.cols
  flor.body.height = flor.program.rows
    // flor.body.forceUpdate(true)

  le.width = flor.program.cols
  le.height = flor.program.rows

    // le.doLayout()
  le.forceUpdate(true)
  nextTick(() => flor.render())
})

flor.render()
debug(flor.body.outerHTML)
