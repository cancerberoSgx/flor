import { BorderStyle, Component, FlorDocument } from '../../src';
import { Flor } from '../../src/jsx/createElement';

async function test() {

  const flor = new FlorDocument({
  })

  interface P {

  }
  class App extends Component<P> {
    render() {
      return <el width={.99} height={.99}
      // border={{ type: BorderStyle.round }}
      // layout={{ layout: Layout['leftRight']}} 
      >
        <el name="c1" border={{ type: BorderStyle.round }} width={.7} height={.99}>

        </el>

        <el name="c2" left={.7} width={.3} height={.99}>
          <el name="c21" border={{ type: BorderStyle.round }} width={.99} height={.6}>

          </el>
          <el name="c22" border={{ type: BorderStyle.round }} width={.99} top={.6} height={.4}>

          </el>
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
