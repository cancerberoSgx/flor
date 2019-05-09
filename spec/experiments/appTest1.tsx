import { BorderStyle, debug, FlorDocument, Layout } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { color } from '../data'

try {
 const flor = new FlorDocument()
 flor.renderer.program.enableMouse()
 flor.body.props.assign({top: 0, left: 0, width: flor.program.cols, height: flor.program.rows, bg: 'gray', fg: 'green', border: {type: BorderStyle.round}})
flor.render()
 const app = <box width={.96} padding={{bottom: 1, top: 1, left: 1, right: 1}} height={.2} top={0} left={0} border={{type: BorderStyle.round}} bg="red" layout={{layout: Layout['left-right'], neverResizeContainer: false}}
 >
<box width={.5} height={.97} border={{type: BorderStyle.heavy}} bg="blue">
panel 1
</box>
<box width={.46} height={.999} border={{type: BorderStyle.double}} bg="magenta">
panel 2
</box>
</box>
 const le = flor.create(app)
 flor.render()
//  flor.debug(flor.body)


} catch (error) {
  debug(error)
}
