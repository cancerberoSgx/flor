import { BorderStyle, debug, FlorDocument } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { color } from '../data'

try {
  let counter = 0
  const p = <box width={13} height={3} bg="red" fg="black" top={4} left={0} ch="_" onClick={e => {
    e.currentTarget!.props.bg = color()
    e.currentTarget!.childNodes.item(0)!.textContent = 'clicked_' + counter++
    if (!e.currentTarget!.props.border) {
      e.currentTarget!.props.border = { type: BorderStyle.double, fg: color() }
    } else {
      e.currentTarget!.props.border.fg = color()
    }
    flor.debug(e.currentTarget!)
    flor.renderer.renderElement(le)
  }}>
  text
  </box>
  const flor = new FlorDocument()
  flor.renderer.program.enableMouse()
  const le = flor.create(p)

} catch (error) {
  debug(error)
}
