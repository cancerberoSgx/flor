import { FlorDocument } from '../src'
import { BorderStyle } from '../src/util/border'
import { createElement } from '../src'
import { defaultTestSetup } from './testUtil'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('border', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('el.props.border', async done => {
    const el = createElement(flor.document, 'Div', flor.document.body, { bg: 'yellow', fg: 'black', border: { type: BorderStyle.double }, left: 10, top: 3, height: 6, width: 16 }, [
      flor.document.createTextNode('hello'), flor.document.createTextNode(' world')
    ])
    flor.renderer.renderElement(el)
    expect(flor.renderer.printBuffer(true)).toContain(`

          ╔══════════════╗
          ║hello world   ║
          ║              ║
          ║              ║
          ║              ║
          ╚══════════════╝
`)
    done()
  })

})
