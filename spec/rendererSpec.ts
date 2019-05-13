import { FlorDocument } from '../src'
import { BorderStyle } from '../src/util/border'
import { createElement } from '../src/util/util'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('renderer', () => {
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

  it('renderElementWithoutChildren', async done => {
    const div1 = flor.document.createElement('Div')
    flor.document.appendChild(div1)
    Object.assign(div1.props, { bg: 'red', fg: 'blue', left: 4, top: 2, height: 5, width: 6, ch: 'X' })
    flor.renderer.renderElementWithoutChildren(div1)
    expect(flor.renderer.printBuffer(true)).toContain(`

    XXXXXX
    XXXXXX
    XXXXXX
    XXXXXX
    XXXXXX
`)
    done()
  })

  it('renderElement ', async done => {
    const div1 = createElement(flor.document, 'Div', flor.document.body, { bg: 'red', fg: 'blue', left: 3, top: 2, height: 9, width: 12, ch: 'X' })
    const d2 = createElement(flor.document, 'Span', div1, { bg: 'green', fg: 'yellow', left: 4, top: 2, height: 3, width: 4, ch: 'O' })
    flor.renderer.renderElement(div1)
    expect(flor.renderer.printBuffer(true)).toContain(`

   XXXXXXXXXXXX
   XXXXXXXXXXXX
   XXXXOOOOXXXX
   XXXXOOOOXXXX
   XXXXOOOOXXXX
   XXXXXXXXXXXX
   XXXXXXXXXXXX
   XXXXXXXXXXXX
   XXXXXXXXXXXX
`)
    done()
  })

  it('children 2nd level ', async done => {
    const div1 = createElement(flor.document, 'Div', flor.document.body, { bg: 'red', fg: 'blue', left: 4, top: 2, height: 16, width: 24, ch: '_' })
    const d2 = createElement(flor.document, 'Span', div1, { bg: 'green', fg: 'black', left: 4, top: 2, height: 12, width: 19, ch: 'O' }, [
      createElement(flor.document, 'Ul', undefined, { bg: 'blue', fg: 'white', left: 5, top: 3, height: 6, width: 11, ch: 'w' })
    ])
    flor.renderer.renderElement(div1)
    expect(flor.renderer.printBuffer(true)).toContain(`

    ________________________
    ________________________
    ____OOOOOOOOOOOOOOOOOOO_
    ____OOOOOOOOOOOOOOOOOOO_
    ____OOOOOOOOOOOOOOOOOOO_
    ____OOOOOwwwwwwwwwwwOOO_
    ____OOOOOwwwwwwwwwwwOOO_
    ____OOOOOwwwwwwwwwwwOOO_
    ____OOOOOwwwwwwwwwwwOOO_
    ____OOOOOwwwwwwwwwwwOOO_
    ____OOOOOwwwwwwwwwwwOOO_
    ____OOOOOOOOOOOOOOOOOOO_
    ____OOOOOOOOOOOOOOOOOOO_
    ____OOOOOOOOOOOOOOOOOOO_
    ________________________
    ________________________
`)
    done()
  })

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
