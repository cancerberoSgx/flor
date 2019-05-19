import { BorderStyle, Button, FlorDocument, Input, Layout, YogaDocument, KeyListener, ProgramDocument, ProgramElement, debug } from '../../src'
import { Flor } from '../../src/jsx/createElement'
test()

async function test() {
  const flor = new FlorDocument({ documentImplementation: () => new YogaDocument() })
  flor.focus.installDefaultChangeFocusKeys()
  flor.render()
  

  const listener : KeyListener = e=>{
    // if(! e.currentTarget ||! e.currentTarget.props.focused){
    //   return 
    // }
    if(e.name==='up'){
      const p = e.currentTarget!.previousSibling<ProgramElement>()
      // debug(e.currentTarget!.props.number, p && p.props.classes, p && p.props.number)
      if(p && p.props.classes && p.props.classes.includes('input-line')){
        p.focus()
        e.stopPropagation()
      }
      // // else {
      //   flor.focus.focusPrevious()
      // // }
    }
    if(e.name==='down'){
      const p = e.currentTarget!.nextSibling<ProgramElement>()
      // debug(e.currentTarget!.props.number, p && p.props.classes, p && p.props.number)
      if(p && p.props.classes && p.props.classes.includes('input-line')){
        p.focus()
        e.stopPropagation()
      }
      // else {
      //     flor.focus.focusNext()
      //   // }
    }
  }
  // listener.priority = -1
  
  const lines = `
Dolor velit eiusmod in in amet et sit ex non ipsum enim. 
Nostrud sint minim nostrud irure ullamco sit cillum veniam id commodo. 
Velit occaecat pariatur minim enim aliqua tempor enim occaecat 
nostrud aliquip. In veniam quis esse eiusmod. Laborum proident 
exercitation excepteur culpa consequat laboris mollit et 
irure labore eiusmod reprehenderit non.
  `.split('\n').filter(l => l.trim())
  // flor.debug(lines.join('\n'))
  const app = <el width={.5} height={.999} left={.2} top={3}bg="gray" fg="green" 
  border={{ type: BorderStyle.round }} 
  layout={{ layout: Layout['topDown'], neverResizeContainer: true }}>

{lines.map((l, i) => 
<Input width={.999}  height={1} value={l} number={i} classes={['input-line']}
border={undefined} fg="white" bg="black" focus={undefined} 
onKeyPressed={listener}      

onChange={e => {
  lines[i] = e.value
  flor.debug(lines.join('\n'))
}}>
</Input>
)}
<Button onClick={e => {
  flor.debug(lines.join('\n'))
}}></Button>
  </el>
  flor.render()
  const le = flor.create(app)

  flor.render()
}
