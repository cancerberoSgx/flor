import { ProgramDocument, BorderStyle, FlorDocument, MouseAction } from '../src'
import { Component } from '../src/jsx/component'
import { Flor } from '../src/jsx/createElement'
import { isElement } from '../src/programDom/elementUtil'
import { trimRightLines } from '../src/util/misc'
import { createProgramRendererDocument } from '../src/util/util'
import { color } from './data';
import { sleep } from 'misc-utils-of-mine-generic';

describe('events', () => {

  it('click', async done => {
    let counter = 0
  const p = <box width={13} height={3} bg="red" fg="black" top={4} left={0} ch="_" onClick={e => {
    // e.currentTarget!.props.bg = color()
    e.currentTarget!.childNodes.item(0)!.textContent='clicked_'+counter++
    // if (!e.currentTarget!.props.border) {
    //   e.currentTarget!.props.border = { type: BorderStyle.double, fg: color() }
    // } else {
    //   e.currentTarget!.props.border!.fg = color()
    // }
    // flor.debug(e.currentTarget!)
    flor.renderer.renderElement(le)
  }}>
  text
  </box>
  const flor = new FlorDocument()
  flor.renderer.program.enableMouse()
  const le = flor.renderElement(p)
  expect(flor.renderer.printBuffer(true).trim()).not.toContain('clicked_')
  flor.events.triggerMouseEvent({
    action: MouseAction.mouseup,
    x: 0, y: 0, button: "left"
  })
  expect(flor.renderer.printBuffer(true).trim()).not.toContain('clicked_')
flor.events.triggerMouseEvent({
  action: MouseAction.mouseup,
  x: 1, y: 5, button: "left"
})
expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_0')
flor.events.triggerMouseEvent({
  action: MouseAction.mouseup,
  x: 1, y: 5, button: "left"
})
expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_1')

flor.events.triggerMouseEvent({
  action: MouseAction.mouseup,
  x: 10, y: 6, button: "left"
})
expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_2')
flor.events.triggerMouseEvent({
  action: MouseAction.mouseup,
  x: 10, y: 8, button: "left"
})
expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_2')
  flor.renderer.destroy()
    done()
  })
})
