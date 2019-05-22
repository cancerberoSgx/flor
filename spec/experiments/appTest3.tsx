import { BorderStyle, Component, debug, FlorDocument, YogaDocument, YogaElement, TextArea, Layout } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { nextTick } from '../../src/util/misc'

async function test(){

const flor = new FlorDocument({
})

interface P {

}
class App extends Component<P> {
  render() {
    return <el top={0} left={0} width={33} height={22}  
    border={{ type: BorderStyle.round }} 
    // layout={{ layout: Layout['leftRight']}} 
    >p
      <el name="c1" top={0} left={0}  border={{type: BorderStyle.round}} width={.7} height={.99}>
c1
      </el>

      <el name="c2" top={0} left={.7}  border={{type: BorderStyle.round}} width={.3} height={.99}>
c2
      </el>
    </el>
  }
}
flor.focus.installDefaultChangeFocusKeys()
const le = flor.create(<App />)
le.forceUpdate(true)
flor.renderer.renderElement(le)
// flor.render()

// flor.program.on('resize', () => {
//   flor.body.width = flor.program.cols
//   flor.body.height = flor.program.rows
//   flor.body.forceUpdate(true)
//   nextTick(() => flor.render())
// })

// flor.render()

}

test()