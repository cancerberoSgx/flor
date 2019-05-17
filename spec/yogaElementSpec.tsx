import { BorderStyle, Flor, installExitKeys, isDomText, ProgramDocumentRenderer } from '../src'
import * as yoga from '../src/programDom/yogaElement'
import { YogaDocument } from '../src/programDom/yogaElement'
import { FlorDocumentTesting } from './florTestHelper'
import { toContain } from './testUtil'

describe('yogaElement', () => {
  let flor: FlorDocumentTesting
  beforeEach(() => {
    flor = new FlorDocumentTesting({
      documentImplementation() { return new YogaDocument() }
    })
  })
  afterEach(() => {
    flor.destroy()
  })

  it('using YogaDocument directly', async done => {
    const renderer = new ProgramDocumentRenderer({ programOptions: { buffer: true } })
    installExitKeys(renderer.program)
    const document = new YogaDocument()
    Flor.setDocument(document)
    document._setManagers({ renderer, focus: null as any, events: null as any, cursor: null as any })
    const el = Flor.render<yoga.YogaElement>(
      <box top={2} left={2} width={50} height={20} border={{ type: BorderStyle.round }}
        flexDirection={yoga.FLEX_DIRECTION_ROW} flexShrink={1}
      >
        <box height={13} width={32} flex={1}>1</box>
        <box height={13} width={32} flex={0}>2</box>
      </box>)
    renderer.renderElement(document.body)
    await toContain(renderer, '────────')
    expect(renderer.printBuffer(true)).toContain(`

  ╭────────────────────────────────────────────────╮
  │1───────────────2──────────────────────────────╮│
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  ││               │                              ││
  │╰───────────────╰──────────────────────────────╯│
  │                                                │
  │                                                │
  │                                                │
  │                                                │
  │                                                │
  ╰────────────────────────────────────────────────╯
`)
// debug('expect: /n' +renderer.printBuffer(true) + '/n', JSON.stringify(el.yogaDebug(), null, 2) + '/n', JSON.stringify(el.debugAsJson(), null, 2) + '/n', el.debugAsXml())
    renderer.destroy()
    done()
  })

  it('FLEX_DIRECTION_ROW, row using heightAuto and widthAuto', async done => {
    const el = flor.create<yoga.YogaElement>(
      <box top={2} left={2} height={13} width={32} border={{ type: BorderStyle.round }}
        flexDirection={yoga.FLEX_DIRECTION_ROW} preventChildrenCascade={true}
        display={yoga.DISPLAY_FLEX}
      >
        <box
        heightAuto
        widthAuto
        border={{ type: BorderStyle.heavyDoubleDash }}
        flexGrow={1}
        >1</box>
        <box
        widthAuto
        border={{ type: BorderStyle.heavyDoubleDash }}
        heightAuto
        ><box height={4} width={4}>4x4</box></box>
      </box>)
    flor.render()
    await toContain(flor.renderer, '────────')
    flor.expect.toContain(`

  ╭──────────────────────────────╮
  │┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍┓┏╍╍╍╍┓│
  │╏1                     ╏╏4x4 ╏│
  │╏                      ╏╏    ╏│
  │╏                      ╏╏    ╏│
  │╏                      ╏╏    ╏│
  │╏                      ╏╏    ╏│
  │╏                      ╏╏    ╏│
  │╏                      ╏╏    ╏│
  │╏                      ╏╏    ╏│
  │╏                      ╏╏    ╏│
  │┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍┛┗╍╍╍╍┛│
  ╰──────────────────────────────╯
`)
    // debug('expect: /n' + flor.printBuffer() + '/n', JSON.stringify(el.yogaDebug(), null, 2) + '/n', JSON.stringify(el.debugAsJson(), null, 2) + '/n', el.debugAsXml())
    done()
  })

  it('depth, percent bounds', async done => {
    const el = flor.create<yoga.YogaElement>(
      <box top={2} left={2} height={27} width={62}
        flexDirection={yoga.FLEX_DIRECTION_ROW}
      >
        <box width={.4} height={.999} flexShrink={1}
          flexDirection={yoga.FLEX_DIRECTION_COLUMN_REVERSE}>
          <box width={.999} flexShrink={1} border={{ type: BorderStyle.round }} height={.3} fg="red"></box>
          <box width={.999} height={.7} flexShrink={1} border={{ type: BorderStyle.roundTripleDash }}
            padding={{ top: 1, bottom: 2, left: 2, right: 2 }} ch="/" fg="yellow"
          >
          </box>
        </box>
        <box width={.6} flexShrink={1} height={.999}
          flexDirection={yoga.FLEX_DIRECTION_COLUMN_REVERSE}>
          <box width={.999} height={.3} flexShrink={1} ch="." border={{ type: BorderStyle.roundQuadrupleDash }} >
          </box>
          <box width={.999} height={.3} ch="-"
            flexShrink={1} flexGrow={1} border={{ type: BorderStyle.round }} >
          </box>
          <box width={.999} flexShrink={1} border={{ type: BorderStyle.double }} ch="|" height={.4}></box>
        </box>
      </box>)
    flor.render()
    // debug('expect: /n' + flor.printBuffer() + '/n', JSON.stringify(el.yogaDebug(), null, 2) + '/n', JSON.stringify(el.debugAsJson(), null, 2) + '/n', el.debugAsXml())
    await toContain(flor.renderer, '═════════════')
    flor.expect.toContain(`

  ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮╔═══════════════════════════════════╗
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆║|||||||||||||||||||||||||||||||||||║
  ┆///////////////////////┆╚═══════════════════════════════════╝
  ┆///////////////////////┆╭───────────────────────────────────╮
  ┆///////////////////////┆│-----------------------------------│
  ┆///////////////////////┆│-----------------------------------│
  ┆///////////////////////┆│-----------------------------------│
  ┆///////////////////////┆│-----------------------------------│
  ┆///////////////////////┆│-----------------------------------│
  ┆///////////////////////┆│-----------------------------------│
  ╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯╰───────────────────────────────────╯
  ╭───────────────────────╮╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮
  │                       │┊...................................┊
  │                       │┊...................................┊
  │                       │┊...................................┊
  │                       │┊...................................┊
  │                       │┊...................................┊
  │                       │┊...................................┊
  ╰───────────────────────╯╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯
`)
    done()
  })

  it('align center', async done => {
    const el = flor.create<yoga.YogaElement>(
      <box height={18} width={30} top={1} left={2}
        direction={yoga.DIRECTION_LTR}
        justifyContent={yoga.JUSTIFY_CENTER} alignItems={yoga.ALIGN_CENTER} ch="·"
      >
        <box width={5} height={4} ch="s"
        >Seba
        </box>
      </box>)
    flor.render()
    await toContain(flor.renderer, 'Seba')
    flor.expect.toContain(`
  ······························
  ······························
  ······························
  ······························
  ······························
  ······························
  ······························
  ·············Sebas············
  ·············sssss············
  ·············sssss············
  ·············sssss············
  ······························
  ······························
  ······························
  ······························
  ······························
  ······························
  ······························
`)
    done()
  })

  it('Should update when props or text change (makes bounds dirty)', async done => {
    const o = { flexShrink: 1 }
    const el = flor.create<yoga.YogaElement>(
      <box top={3} left={4} height={33} width={52} border={{ type: BorderStyle.round }}
        flexDirection={yoga.FLEX_DIRECTION_COLUMN} flexWrap={yoga.WRAP_WRAP} direction={yoga.DIRECTION_LTR}
      >
        <box {...o} width={.5} height={3}>1</box>
        <box  {...o} width={.4} height={8}>2</box>
        <box  {...o} width={.3} height={5}>3</box>
        <box  {...o} width={.1} height={9}>4</box>
        <box {...o} width={.5} height={4}>5</box>
        <box  {...o} width={.4} height={11}>6</box>
        <box  {...o} width={.3} height={7}>7</box>
        <box  {...o} width={.1} height={11}>8</box>
      </box>)
    flor.render()
    await flor.expect.willContain('1')
    flor.expect.toContain(`


    ╭──────────────────────────────────────────────────╮
    │1───────────────────────╮6──────────────────╮     │
    ││                       ││                  │     │
    │╰───────────────────────╯│                  │     │
    │2──────────────────╮     │                  │     │
    ││                  │     │                  │     │
    ││                  │     │                  │     │
    ││                  │     │                  │     │
    ││                  │     │                  │     │
    ││                  │     │                  │     │
    ││                  │     │                  │     │
    │╰──────────────────╯     ╰──────────────────╯     │
    │3─────────────╮          7─────────────╮          │
    ││             │          │             │          │
    ││             │          │             │          │
    ││             │          │             │          │
    │╰─────────────╯          │             │          │
    │4───╮                    │             │          │
    ││   │                    ╰─────────────╯          │
    ││   │                    8───╮                    │
    ││   │                    │   │                    │
    ││   │                    │   │                    │
    ││   │                    │   │                    │
    ││   │                    │   │                    │
    ││   │                    │   │                    │
    │╰───╯                    │   │                    │
    │5───────────────────────╮│   │                    │
    ││                       ││   │                    │
    ││                       ││   │                    │
    │╰───────────────────────╯╰───╯                    │
    │                                                  │
    │                                                  │
    ╰──────────────────────────────────────────────────╯
`)

    await flor.expect.wontContain('seba')
    el.props.flexDirection = yoga.FLEX_DIRECTION_ROW
    el.findDescendant(n => isDomText(n) && !!n.textContent && n.textContent.includes('1'))!.textContent = 'seba'
    flor.render()
    await flor.expect.willContain('seba')
    await flor.expect.wontContain('1')

    flor.expect.toContain(`


    ╭──────────────────────────────────────────────────╮
    │seba────────────────────╮2──────────────────╮     │
    ││                       ││                  │     │
    │╰───────────────────────╯│                  │     │
    │                         │                  │     │
    │                         │                  │     │
    │                         │                  │     │
    │                         │                  │     │
    │                         ╰──────────────────╯     │
    │3─────────────╮4───╮5───────────────────────╮     │
    ││             ││   ││                       │     │
    ││             ││   ││                       │     │
    ││             ││   │╰───────────────────────╯     │
    │╰─────────────╯│   │                              │
    │               │   │                              │
    │               │   │                              │
    │               │   │                              │
    │               ╰───╯                              │
    │6──────────────────╮7─────────────╮8───╮          │
    ││                  ││             ││   │          │
    ││                  ││             ││   │          │
    ││                  ││             ││   │          │
    ││                  ││             ││   │          │
    ││                  ││             ││   │          │
    ││                  │╰─────────────╯│   │          │
    ││                  │               │   │          │
    ││                  │               │   │          │
    ││                  │               │   │          │
    │╰──────────────────╯               ╰───╯          │
    │                                                  │
    │                                                  │
    │                                                  │
    ╰──────────────────────────────────────────────────╯
`)
    // debug('expect: /n' + flor.printBuffer() + '/n', JSON.stringify(el.yogaDebug(), null, 2) + '/n', JSON.stringify(el.debugAsJson(), null, 2) + '/n', el.debugAsXml())
    done()
  })

})
