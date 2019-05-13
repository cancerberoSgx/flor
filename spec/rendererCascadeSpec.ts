import { tryTo } from 'misc-utils-of-mine-generic'
import { Program, ProgramDocument, ProgramDocumentRenderer, FlorDocument } from '../src'
import { BorderStyle } from '../src/util/border'
import { installExitKeys } from '../src/util/programUtil'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('props cascade', () => {
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

  it('flor.renderer.renderElement options, default( {preventChildrenCascade: false}), children to inherits parent\'s attrs', async done => {
    const el = flor.document.create({top: 2, left: 4, width: 24, height: 16, ch: '0', border: { type: BorderStyle.double }, children: [
      { top: 2, left: 3, width: 12, height: 9, bg: 'red', border: { type: BorderStyle.double } }
    ]})
    flor.renderer.renderElement(el)
    expect(flor.renderer.printBuffer(true)).toContain(`

    ╔══════════════════════╗
    ║0000000000000000000000║
    ║0000000000000000000000║
    ║000╔══════════╗0000000║
    ║000║0000000000║0000000║
    ║000║0000000000║0000000║
    ║000║0000000000║0000000║
    ║000║0000000000║0000000║
    ║000║0000000000║0000000║
    ║000║0000000000║0000000║
    ║000║0000000000║0000000║
    ║000╚══════════╝0000000║
    ║0000000000000000000000║
    ║0000000000000000000000║
    ║0000000000000000000000║
    ╚══════════════════════╝
`)
    done()
  })

  it('flor.renderer.renderElement options, {preventChildrenCascade: true} prevents children to inherits parent\'s attrs', async done => {
    const el = flor.document.create({top: 2, left: 4, width: 24, height: 16, ch: '0', border: { type: BorderStyle.double }, children: [
      { top: 2, left: 3, width: 12, height: 9, bg: 'red', border: { type: BorderStyle.double } }
    ]})
    flor.renderer.renderElement(el, { preventChildrenCascade: true, preventSiblingCascade: true })
    expect(flor.renderer.printBuffer(true)).toContain(`

    ╔══════════════════════╗
    ║0000000000000000000000║
    ║0000000000000000000000║
    ║000╔══════════╗0000000║
    ║000║          ║0000000║
    ║000║          ║0000000║
    ║000║          ║0000000║
    ║000║          ║0000000║
    ║000║          ║0000000║
    ║000║          ║0000000║
    ║000║          ║0000000║
    ║000╚══════════╝0000000║
    ║0000000000000000000000║
    ║0000000000000000000000║
    ║0000000000000000000000║
    ╚══════════════════════╝
`)
    done()
  })

  it('{preventSiblingCascade: false, preventChildrenCascade: true} children inherits previous sibling\'s attrs independently of parent', async done => {
    const el = flor.document.create({top: 2, left: 4, width: 27, height: 12, ch: '0', border: { type: BorderStyle.double }, children: [
      { top: 1, left: 1, width: 4, height: 3, ch: '1' },
      { top: 3, left: 18, width: 4, height: 3 }
    ]})
    flor.renderer.renderElement(el, { preventSiblingCascade: false, preventChildrenCascade: true })
    expect(flor.renderer.printBuffer(true)).toContain(`

    ╔═════════════════════════╗
    ║0000000000000000000000000║
    ║0111100000000000000000000║
    ║0111100000000000000000000║
    ║0111100000000000001111000║
    ║0000000000000000001111000║
    ║0000000000000000001111000║
    ║0000000000000000000000000║
    ║0000000000000000000000000║
    ║0000000000000000000000000║
    ║0000000000000000000000000║
    ╚═════════════════════════╝
`)
    done()
  })

  it('{preventSiblingCascade: false, preventChildrenCascade: false} children inherits parents and sibling - parent takes precedence', async done => {
    const el = flor.document.create({top: 2, left: 4, width: 27, height: 12, border: { type: BorderStyle.double }, children: [
      { top: 1, left: 1, width: 7, height: 4, ch: '1', border: { type: BorderStyle.round } },
      { top: 3, left: 11, width: 7, height: 4 }
    ]})
    flor.renderer.renderElement(el, { preventSiblingCascade: false, preventChildrenCascade: false })
    expect(flor.renderer.printBuffer(true)).toContain(`

    ╔═════════════════════════╗
    ║                         ║
    ║ ╭─────╮                 ║
    ║ │11111│                 ║
    ║ │11111│   ╔═════╗       ║
    ║ ╰─────╯   ║11111║       ║
    ║           ║11111║       ║
    ║           ╚═════╝       ║
    ║                         ║
    ║                         ║
    ║                         ║
    ╚═════════════════════════╝
`)
    done()
  })

  it('default behavior is {preventSiblingCascade: true, preventChildrenCascade: false} children inherits only from parent and never from sibling', async done => {
    const el = flor.document.create({top: 2, left: 4, width: 27, height: 12, border: { type: BorderStyle.double }, children: [
      { top: 1, left: 1, width: 7, height: 4, ch: '1', border: { type: BorderStyle.round } },
      { top: 3, left: 11, width: 7, height: 4 }
    ]})
    flor.renderer.renderElement(el)
    expect(flor.renderer.printBuffer(true)).toContain(`

    ╔═════════════════════════╗
    ║                         ║
    ║ ╭─────╮                 ║
    ║ │11111│                 ║
    ║ │11111│   ╔═════╗       ║
    ║ ╰─────╯   ║     ║       ║
    ║           ║     ║       ║
    ║           ╚═════╝       ║
    ║                         ║
    ║                         ║
    ║                         ║
    ╚═════════════════════════╝
`)
    done()
  })

  it('should declare as element props', async done => {
    const el = flor.document.create({top: 2, left: 4, width: 37, height: 22, border: { type: BorderStyle.double }, ch: 'P', preventChildrenCascade: true, children: [
      { // This child won't inherit from parent
        top: 1, left: 1, width: 33, height: 10, ch: '1',
        preventSiblingCascade: false,
        preventChildrenCascade: true, // need to re-declare : it won't inherits because of itself
        children: [
          {// this child won't inherits from parent
            top: 1, left: 1, width: 8, height: 6, ch: '_', border: { type: BorderStyle.round }},
          { // this child will inherit from sibling
            top: 2, left: 12, width: 7, height: 5}
        ]},
      { // This children should not inertia from parent nor from sibling  but it is (ch==='p') - preventChildrenCascade:true is problematic because it prevent itself to propagate... TODO
        top: 12, left: 2, width: 31, height: 7, preventChildrenCascade: false,     preventSiblingCascade: false,  border: { type: BorderStyle.singleRareCorners }, children: [
          {// inherits form parent
            top: 1, left: 3, width: 8, height: 4, ch: '_'} ,
          {// inherits form parent and sibling
            top: 1, left: 14, width: 8, height: 4}
        ]}
    ]})
    flor.renderer.renderElement(el)
    expect(flor.renderer.printBuffer(true)).toContain(`

    ╔═══════════════════════════════════╗
    ║PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP║
    ║P111111111111111111111111111111111P║
    ║P1╭──────╮111111111111111111111111P║
    ║P1│______│111_______11111111111111P║
    ║P1│______│111_______11111111111111P║
    ║P1│______│111_______11111111111111P║
    ║P1│______│111_______11111111111111P║
    ║P1╰──────╯111_______11111111111111P║
    ║P111111111111111111111111111111111P║
    ║P111111111111111111111111111111111P║
    ║P111111111111111111111111111111111P║
    ║PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP║
    ║PP⎡⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎤PP║
    ║PP⎢PPPPPPPPPPPPPPPPPPPPPPPPPPPPP⎥PP║
    ║PP⎢PPP⎡⎺⎺⎺⎺⎺⎺⎤PPP⎡⎺⎺⎺⎺⎺⎺⎤PPPPPPP⎥PP║
    ║PP⎢PPP⎢______⎥PPP⎢______⎥PPPPPPP⎥PP║
    ║PP⎢PPP⎢______⎥PPP⎢______⎥PPPPPPP⎥PP║
    ║PP⎢PPP⎣⎽⎽⎽⎽⎽⎽⎦PPP⎣⎽⎽⎽⎽⎽⎽⎦PPPPPPP⎥PP║
    ║PP⎣⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎦PP║
    ║PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP║
    ╚═══════════════════════════════════╝
`)
    done()
  })

})
