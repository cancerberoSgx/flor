import { FlorDocument } from '../src'
import { BorderStyle } from '../src/util/border'
import { createElement } from '../src/util/util'
import { defaultTestSetup } from './testUtil'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('text', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('textContent as unique children', async done => {
    const t = flor.document.createTextNode('hello world')
    const div1 = createElement(flor.document, 'Div', flor.document.body, { bg: 'yellow', fg: 'black', left: 6, top: 2, height: 6, width: 16, ch: '_' }, [
      t
    ])
    flor.renderer.renderElement(div1)
    expect(flor.renderer.printBuffer(true)).toContain(`

      hello world_____
      ________________
      ________________
      ________________
      ________________
      ________________
`)
    done()
  })

  it('multiple text nodes', async done => {
    const el = createElement(flor.document, 'Div', flor.document.body, { bg: 'yellow', fg: 'black', left: 10, top: 2, height: 6, width: 16, border: { type: BorderStyle.round } }, [
      flor.document.createTextNode('hello'), flor.document.createTextNode(' world')
    ])
    flor.renderer.renderElement(el)
    expect(flor.renderer.printBuffer(true)).toContain(`
          ╭──────────────╮
          │hello world   │
          │              │
          │              │
          │              │
          ╰──────────────╯
`)
    done()
  })

})
