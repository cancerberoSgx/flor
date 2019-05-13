import { FlorDocument } from '../src'
import { BorderStyle } from '../src/util/border'
import { createElement } from '../src/util/util'
import { defaultTestSetup } from './testUtil'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('renderer', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

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

})
