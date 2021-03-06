import { sleep } from 'misc-utils-of-mine-generic';
import { FlorDocument, MouseAction, MouseEvent } from '../src';
import { Flor } from '../src/jsx/createElement';
import { defaultTestSetup, expectNotToContain, expectToContain, willContain } from './testUtil';

describe('events', () => {
  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('click', async done => {
    let counter = 0
    const p = <el width={13} height={3} bg="red" fg="black" top={4} left={0} ch="_" onClick={e => {
      e.currentTarget!.childNodes[0].textContent = 'clicked_' + counter++
      flor.renderer.renderElement(le)
    }}>
      text
    </el>
    const le = flor.create(p)
    flor.render()
    await willContain(flor, 'text')
    expectNotToContain(flor, 'clicked_')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: 0, y: 0, button: 'left'
    })
    expectNotToContain(flor, 'clicked_')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 1, y: le.absoluteContentTop + 1, button: 'left'
    })
    await willContain(flor, 'clicked_0')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 2, y: le.absoluteContentTop + 2, button: 'left'
    })
    await willContain(flor, 'clicked_1')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 1, y: le.absoluteContentTop + 1, button: 'left'
    })
    await willContain(flor, 'clicked_2')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: le.absoluteContentLeft + 20, y: le.absoluteContentTop + 20, button: 'left'
    })
    await willContain(flor, 'clicked_2')
    flor.events.click(le)
    await willContain(flor, 'clicked_3')
    flor.events.triggerMouseEvent({
      action: MouseAction.click,
      x: le.absoluteContentLeft + 1, y: le.absoluteContentTop + 1, button: 'left'
    })
    await willContain(flor, 'clicked_4')
    done()
  })

  it('addMouseListener and removeMouseListener', async done => {
    let counter = 0
    const p = <el width={13} height={3} bg="red" fg="black" top={4} left={0} ch="_">
      text
    </el>
    const le = flor.create(p)
    flor.render()
    await willContain(flor, 'text')
    expectNotToContain(flor, 'clicked_')
    le.click()
    expectNotToContain(flor, 'clicked_')
    le.click()
    expectNotToContain(flor, 'clicked_')
    expectToContain(flor, 'text')

    const listener = (e: MouseEvent) => {
      e.currentTarget!.childNodes[0].textContent = 'clicked_' + counter++
      flor.renderer.renderElement(le)
    }
    le.addMouseListener(listener, 'click')
    await sleep(0) // addMouseListener is not sync
    le.click()
    await willContain(flor, 'clicked_0')
    expectNotToContain(flor, 'text')
    le.click()
    await willContain(flor, 'clicked_1')
    expectNotToContain(flor, 'clicked_0')
    le.removeMouseListener(listener, 'click')
    await sleep(0) // addMouseListener is not sync
    le.click()
    await willContain(flor, 'clicked_1')
    expectNotToContain(flor, 'clicked_2')

    done()
  })

  it('onClicks should listen for double clicks', async done => {
    let counter = 0
    const p = <el width={13} height={3} bg="red" fg="black" top={4} left={0} ch="_" onClicks={e => {
      if (e.count === 2) {
        e.currentTarget!.childNodes[0].textContent = 'double_clicked_' + counter++
      } else {
        e.currentTarget!.childNodes[0].textContent = 'not_multiple'
      }
      flor.renderer.renderElement(le)
    }}>
      text
    </el>
    const le = flor.create(p)
    flor.render()

    await willContain(flor, 'text')
    expectNotToContain(flor, 'clicked_')

    le.click()
    await willContain(flor, 'not_multiple')
    expectNotToContain(flor, 'text')

    le.click()
    await sleep(1)
    le.click()
    await willContain(flor, 'clicked_0')
    expectNotToContain(flor, 'text')
    expectNotToContain(flor, 'not_multiple')

    done()
  })

})
