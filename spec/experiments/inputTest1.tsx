import { BorderStyle, borderStyles, debug, FlorDocument, Input, Layout } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { color, float, item } from '../data'
import { sleep } from 'misc-utils-of-mine-generic';

// try {
  
// } catch (error) {
//   debug(error)
// }
test()

async function test(){
  const flor = new FlorDocument()
  flor.renderer.program.enableMouse()
  await sleep(1000)
  flor.program.showCursor()
  await sleep(1000)
flor.program.cursorPos(10, 10)
await sleep(1000)

flor.program.cursorPos(12, 12)
await sleep(1000)

  // flor.body.props.assign({ top: 0, left: 0, width: flor.program.cols, height: flor.program.rows })
  const app = <el width={.99} height={.999} bg="gray" fg="green" border={{ type: BorderStyle.round }} layout={{ layout: Layout['topDown'], neverResizeContainer: true }}>

    <Input width={.5} height={3} border={{ type: BorderStyle.heavy }} bg="blue" focusable={true} onChange={e => flor.debug(e.value)}></Input>

  </el>
  flor.render()
  // flor.program.hideCursor()
  const le = flor.create(app)

  flor.render()
}