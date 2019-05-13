import { FlorDocument } from '../src'
import { BorderStyle } from '../src/util/border'
import { createElement } from '../src/util/util'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('border', () => {
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
