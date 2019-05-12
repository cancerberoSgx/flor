import { array, serial } from 'misc-utils-of-mine-generic'
import { BorderStyle, Layout } from '../src/util'
import { createProgramRendererDocumentAndElement } from '../src/util/programUtil'
import { createElement } from '../src/util/util'
import { int } from './data'

describe('layout', () => {
  it('all layouts should make all text visible if there is enough space - invoking layoutChildren manually', async done => {
    const { renderer, el, document } = createProgramRendererDocumentAndElement()
    document.body.props.assign({ width: renderer.program.cols, height: renderer.program.rows })
    renderer.renderElement(document.body)

    const N = 10
    await serial([
      'top-down', 'left-right', 'diagonal', 'alt-diagonal', 'binary-tree', 'justified-layout'
    ].map(l => async() => {
      const el = createElement(document, 'Div', document.body, { bg: 'yellow', fg: 'black', layout: { layout: l as any }, border: { type: BorderStyle.double }, left: 20, top: 2, height: 26, width: 60, ch: ' ' },
        array(N).map(i => createElement(document, 'Div', undefined, { bg: 'white', fg: 'black', top: int(2, 12), left: int(2, 8), height: int(2, 4), width: int(6, 12), ch: '.', border: { type: BorderStyle.round } }, [
          document.createTextNode('N' + i + 'th')
        ]))
      )
      renderer.renderElement(el)
      const output = renderer.printBuffer(true)
      array(N).map(i => 'N' + i + 'th').forEach(l => expect(output).toContain(l))
    }
    ))
    renderer.destroy()
    done()
  })

  it('justify-layout should make all text visible if there is enough space', async done => {
    const N = 20
    const { renderer, el } = createProgramRendererDocumentAndElement()
    el.props.assign({ width: renderer.program.cols, height: renderer.program.rows, layout: { layout: Layout['justifiedRows'], justifiedLayout: { targetRowHeight: 10, targetRowHeightTolerance: 0 } } })
    renderer.eraseElement(el)
    el.empty()
    array(N).map(i => ({
      top: int(0, 20), left: int(20), width: int(23, 40), height: int(12, 20), bg: 'white', fg: 'black', border: {}
      , children: [`N${i}th`]
    })).forEach(el.create.bind(el))
    renderer.renderElement(el)
    const output = renderer.printBuffer(true)
    array(N).map(i => `N${i}th`).forEach(l => expect(output).toContain(l))
    renderer.destroy()
    done()
  })
})
