import { BorderStyle, createElement, Flor, FlorDocument } from '../src';
import { defaultTestSetup } from './testUtil';

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

  it('all percent', async done => {
    const le = Flor.render(<el width={33} height={22}
    >
      <el name="c1" border={{ type: BorderStyle.round }} width={.5} height={.99}>

        <el name="c11" border={{ type: BorderStyle.round }} width={.99} height={.6} >c11
        </el>
        <el name="c12" border={{ type: BorderStyle.round }} top={.6} height={.4} width={.99} >c12
        </el>
      </el>

      <el name="c2" border={{ type: BorderStyle.round }} left={.5} width={.5} height={.99}>

        <el name="c21" border={{ type: BorderStyle.round }} width={.99} height={.4} >c21
        </el>
        <el name="c22" border={{ type: BorderStyle.round }} top={.4} height={.6} width={.99} >c22
        </el>

      </el>

    </el>)
    flor.renderer.renderElement(le)
    expect(flor.renderer.printBuffer(true)).toContain(`
╭───────────────╮╭───────────────╮
│╭─────────────╮││╭─────────────╮│
││c11          ││││c21          ││
││             ││││             ││
││             ││││             ││
││             ││││             ││
││             ││││             ││
││             ││││             ││
││             │││╰─────────────╯│
││             │││╭─────────────╮│
││             ││││c22          ││
││             ││││             ││
│╰─────────────╯│││             ││
│╭─────────────╮│││             ││
││c12          ││││             ││
││             ││││             ││
││             ││││             ││
││             ││││             ││
││             ││││             ││
││             ││││             ││
│╰─────────────╯││╰─────────────╯│
╰───────────────╯╰───────────────╯
    `.trim())
    done()
  })

})
