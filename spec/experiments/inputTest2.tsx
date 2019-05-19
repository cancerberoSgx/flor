import { sleep } from 'misc-utils-of-mine-generic'
import { BorderStyle, FlorDocument, Input, Layout, YogaElement, YogaDocument, Button } from '../../src'
import { Flor } from '../../src/jsx/createElement'

// try {

// } catch (error) {
//   debug(error)
// }
test()

async function test() {
  const flor = new FlorDocument({documentImplementation: ()=>new YogaDocument()})
  flor.focus.installDefaultChangeFocusKeys()
  flor.events.addKeyListener(e=>{

  })

  const lines = `
hello world
how are you?
i'm experimenting
  `.split('\n').filter(l=>l.trim())
flor.debug(lines.join('\n')) 
  // flor.body.props.assign({ top: 0, left: 0, width: flor.program.cols, height: flor.program.rows })
  const app = <el width={.99} height={.999} bg="gray" fg="green" border={{ type: BorderStyle.round }} layout={{ layout: Layout['topDown'], neverResizeContainer: true }}>
{lines.map((l, i)=><Input width={.999} value={l} 
border={undefined} height={1}
onChange={e=>{
  lines[i]=e.value
  flor.debug(lines.join('\n')) 
}}></Input>)}q
<Button onClick={e=>{
  flor.debug(lines.join('\n')) 
}}></Button>
  </el>
  flor.render()
  // flor.program.hideCursor()
  const le = flor.create(app)

  flor.render()
}
