import { tryTo } from 'misc-utils-of-mine-generic'
import { Program, ProgramDocument, ProgramDocumentRenderer } from '../src'
import { BorderStyle } from '../src/util/border'
import { installExitKeys } from '../src/util/programUtil'

describe('overflow', () => {
  let program: Program
  let doc: ProgramDocument
  let renderer: ProgramDocumentRenderer

  beforeEach(() => {
    program = new Program()
    installExitKeys(program)
    program.reset()
    doc = new ProgramDocument()
    renderer = new ProgramDocumentRenderer({ program })
  })

  afterEach(() => {
    tryTo(() => {
      renderer.destroy()
    })
  })

  it('by default overflow visible', async done => {
    const el = doc.create({top: 8, left: 12, width: 24, height: 16, ch: '0', border: { type: BorderStyle.double },
      children: [
      { top: 5, left: 13, width: 22, height: 4, bg: 'red', ch: '2' },
      { top: 10, left: 8, width: 3, height: 8, ch: 'K', fg: 'cyan' },
      { top: -5, left: 4, width: 4, height: 12, ch: '-', fg: 'magenta' },
      { top: 7, left: -6, width: 14, height: 4, ch: '-', fg: 'green' }
      ]})
    renderer.renderElement(el)
    expect(renderer.printBuffer(true)).toContain(`

                 ╔══╗
                 ║--║
                 ║--║
                 ║--║
            ╔════║--║══════════════╗
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000╔════════════════════╗
            ║0000╚══╝00000║22222222222222222222║
       ╔════════════╗00000║22222222222222222222║
       ║------------║00000╚════════════════════╝
       ║------------║00000000000000║
       ╚════════════╝╔═╗00000000000║
            ║00000000║K║00000000000║
            ║00000000║K║00000000000║
            ║00000000║K║00000000000║
            ╚════════║K║═══════════╝
                     ║K║
                     ║K║
                     ╚═╝
`)
    done()
  })

  it('by default overflow: hidden should prevent regions out of parent viewport to be rendered', async done => {
    const el = doc.create({top: 8, left: 12, width: 24, height: 16, ch: '0', border: { type: BorderStyle.double }, overflow: 'hidden',
      children: [
      { top: 5, left: 13, width: 22, height: 4, bg: 'red', ch: '2' },
      { top: 10, left: 8, width: 3, height: 8, ch: 'K', fg: 'cyan' },
      { top: -5, left: 4, width: 4, height: 12, ch: '-', fg: 'magenta' },
      { top: 7, left: -6, width: 14, height: 4, ch: '-', fg: 'green' }
      ]})
    renderer.renderElement(el)
    expect(renderer.printBuffer(true)).toContain(`




            ╔══════════════════════╗
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000000000000║
            ║0000║--║00000╔════════║
            ║0000╚══╝00000║22222222║
            ║═══════╗00000║22222222║
            ║-------║00000╚════════║
            ║-------║00000000000000║
            ║═══════╝╔═╗00000000000║
            ║00000000║K║00000000000║
            ║00000000║K║00000000000║
            ║00000000║K║00000000000║
            ╚══════════════════════╝
`)
    done()
  })

  it('test with padding and multiple levels', async done => {
    const el = doc.create({top: 8, left: 12, width: 24, height: 16, ch: '0', border: { type: BorderStyle.double }, padding: { top: 1, left: 1, right: 1, bottom: 1 }, overflow: 'hidden',
      children: [
      { top: 5, left: 13, width: 22, height: 4, bg: 'red', ch: '2' },
      { top: 10, left: 8, width: 3, height: 8, ch: 'K', fg: 'cyan' },
      { top: -5, left: 4, width: 4, height: 9, ch: '-', fg: 'magenta' },
      { top: 7, left: -6, width: 14, height: 4, ch: '-', fg: 'green' }
      ]})
    renderer.renderElement(el)
    expect(renderer.printBuffer(true)).toContain(`

            ╔══════════════════════╗
            ║0000000000000000000000║
            ║00000║--║0000000000000║
            ║00000║--║0000000000000║
            ║00000║--║0000000000000║
            ║00000╚══╝0000000000000║
            ║0000000000000000000000║
            ║00000000000000╔═════00║
            ║00000000000000║2222200║
            ║0═══════╗00000║2222200║
            ║0-------║00000╚═════00║
            ║0-------║0000000000000║
            ║0═══════╝╔═╗0000000000║
            ║000000000║K║0000000000║
            ║0000000000000000000000║
            ╚══════════════════════╝
`)
    done()
  })
})
