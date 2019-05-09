import { debug, FlorDocument, BorderStyle } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { color, words, string } from '../data';

try {
  const p = <box width={10} height={3} bg="red" fg="black" top={4} left={0} ch="_" onClick={e => {
    e.currentTarget!.props.bg = color()
    e.currentTarget!.textContent = string(10)
    if(!e.currentTarget!.props.border){
      e.currentTarget!.props.border={type: BorderStyle.double, fg: color()}
    }
    else {
      e.currentTarget!.props.border!.fg = color()
    }    
    flor.debug(e.currentTarget!)
    // e.currentTarget!.props.border!.fg = color()
    debug(e.currentTarget!.props.border)
    flor.renderer.renderElement(le)
  }}>
  text
  <box>other</box>
  </box>
  const flor = new FlorDocument()
  flor.renderer.program.enableMouse()
  const le = flor.renderElement(p)

} catch (error) {
  debug(error)
}
