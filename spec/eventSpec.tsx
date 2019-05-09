import { FlorDocument, MouseAction } from '../src'
import { Flor } from '../src/jsx/createElement'

describe('events', () => {

  it('click', async done => {

    const flor = new FlorDocument()

    let counter = 0
    const p = <box width={13} height={3} bg="red" fg="black" top={4} left={0} ch="_" onClick={e => {
      e.currentTarget!.childNodes.item(0)!.textContent = 'clicked_' + counter++
      flor.renderer.renderElement(le)
    }}>
      text
    </box>

    const le = flor.create(p)
    expect(flor.renderer.printBuffer(true).trim()).not.toContain('clicked_')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: 0, y: 0, button: 'left'
    })
    expect(flor.renderer.printBuffer(true).trim()).not.toContain('clicked_')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 1, y: le.absoluteContentTop + 1, button: 'left'
    })
    expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_0')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 2, y: le.absoluteContentTop + 2, button: 'left'
    })
    expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_1')

    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 1, y: le.absoluteContentTop + 1, button: 'left'
    })
    expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_2')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 20, y: le.absoluteContentTop + 20, button: 'left'
    })
    expect(flor.renderer.printBuffer(true).trim()).toContain('clicked_2')
    flor.renderer.destroy()
    done()
  })
})
