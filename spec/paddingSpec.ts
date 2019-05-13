import { FlorDocument } from '../src'
import { BorderStyle } from '../src/util/border'
import { createElement } from '../src/util/util'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('padding', () => {
  let flor: FlorDocument

  beforeEach(() => {
    flor = new FlorDocument({ buffer: true })
    flor.render()
    process.on('uncaughtException', function(err) {
      flor.destroy()
      console.log('Caught exception: ' + err, err, err.stack)
      process.exit(1)
    })
  })

  afterEach(() => {
    flor.destroy()
  })

  it('el.props.padding', async done => {
    const el = createElement(flor.document, 'Div', flor.document.body, { bg: 'yellow', ch: 'T', fg: 'black', border: { type: BorderStyle.double }, left: 10, top: 3, height: 13, width: 22 , padding: { top: 2, left: 3, right: 1, bottom: 1 } }, [createElement(flor.document, 'Div', undefined, { bg: 'green', ch: 'V', padding: { top: 1, left: 1, right: 1, bottom: 1 }, border: { type: BorderStyle.round }, top: 1, left: 1, width: 15, height: 6 }, [
      flor.document.createTextNode('hello'), flor.document.createTextNode(' world')])
    ])
    flor.renderer.renderElement(el)
    expect(flor.renderer.printBuffer(true)).toContain(`

          ╔════════════════════╗
          ║TTTTTTTTTTTTTTTTTTTT║
          ║TTTTTTTTTTTTTTTTTTTT║
          ║TTTTTTTTTTTTTTTTTTTT║
          ║TTTT╭─────────────╮T║
          ║TTTT│VVVVVVVVVVVVV│T║
          ║TTTT│Vhello worldV│T║
          ║TTTT│VVVVVVVVVVVVV│T║
          ║TTTT│VVVVVVVVVVVVV│T║
          ║TTTT╰─────────────╯T║
          ║TTTTTTTTTTTTTTTTTTTT║
          ║TTTTTTTTTTTTTTTTTTTT║
          ╚════════════════════╝
`)
    done()
  })

})