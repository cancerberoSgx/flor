import { array, serial, sleep } from 'misc-utils-of-mine-generic';
import { createElement } from '../src';
import { createProgramRendererDocumentAndElement } from '../src/manager/programUtil';
import { BorderStyle, Layout } from '../src/util';
import { int } from './data';

describe('layout', () => {

  it('all layouts should make all text visible if there is enough space - invoking layoutChildren manually', async done => {
    const { renderer, el, document } = createProgramRendererDocumentAndElement()
    document.body.props.assign({ width: renderer.program.cols, height: renderer.program.rows })
    renderer.renderElement(document.body)
    const N = 5
    await serial([
      'top-down', 'left-right', 'diagonal', 'alt-diagonal', 'binary-tree', 'justified-layout'
    ].map(l => async () => {
      const el = createElement(document, 'Div', document.body, { bg: 'yellow', fg: 'black', layout: { layout: l as any }, border: { type: BorderStyle.double }, left: 2, top: 0, width: renderer.program.cols, height: renderer.program.rows, ch: ' ' },
        array(N).map(i => createElement(document, 'Div', undefined, { bg: 'white', fg: 'black', top: int(0, 4), left: int(0, 7), height: int(3, 4), width: int(8, 12), ch: '.', border: { type: BorderStyle.round } }, [
          document.createTextNode('N' + i + 'th')
        ]))
      )
      renderer.renderElement(el)
      await sleep(100)
      const output = renderer.printBuffer(true)
      array(N).map(i => 'N' + i + 'th').forEach(l => expect(output).toContain(l))
    }
    ))
    renderer.destroy()
    done()
  })

  it('justify-layout should make all text visible if there is enough space', async done => {
    const N = 10
    const { renderer, el } = createProgramRendererDocumentAndElement()
    el.props.assign({ width: renderer.program.cols, height: renderer.program.rows, layout: { layout: Layout['justifiedLayout'], justifiedLayout: { targetRowHeight: 6, targetRowHeightTolerance: 0 } } })
    renderer.eraseElement(el)
    el.empty()
    array(N).map(i => ({
      top: int(4, 8), left: int(4, 12), width: int(8, 12), height: int(4, 8), bg: 'white', fg: 'black', border: {}
      , children: [`N${i}`]
    })).forEach(el.create.bind(el))
    renderer.renderElement(el)
    await sleep(100)
    const output = renderer.printBuffer(true)
    array(N).map(i => `N${i}`).forEach(l => expect(output).toContain(l))
    renderer.destroy()
    done()
  })
})
