import { BorderStyle, Flor, debug } from '../src';
import * as yoga from '../src/programDom/yogaElement';
import { YogaDocument } from '../src/programDom/yogaElement';
import { FlorDocumentTesting } from './florTestHelper';
import { toContain } from './testUtil';

describe('yogaElement', () => {

  it('FLEX_DIRECTION_ROW, flexGrow, descendants bounds not needed', async done => {
    const flor = new FlorDocumentTesting({
      documentImplementation() { return new YogaDocument() }
    })
    const el = flor.create(
      <box top={2} left={2} height={13} width={32} border={{ type: BorderStyle.round }}
        flexDirection={yoga.FLEX_DIRECTION_ROW}
      >
        <box flexGrow={1}></box>
        <box></box>
      </box>)
    flor.render()
    await toContain(flor.renderer, '────────')
    flor.expect.toContain(`

  ╭──────────────────────────────╮
  │╭─────────────────────╮╭─────╮│
  ││                     ││     ││
  ││                     ││     ││
  ││                     ││     ││
  ││                     ││     ││
  ││                     ││     ││
  ││                     ││     ││
  │╰─────────────────────╯╰─────╯│
  │                              │
  │                              │
  │                              │
  ╰──────────────────────────────╯
`)  // TODO: why do I have to do this ? no left, no top... ISSUE
    flor.destroy()
    done()
  })


  xit('simple row, with columns, one grow', async done => {
    const flor = new FlorDocumentTesting({
      documentImplementation() { return new YogaDocument() }
    })
    const el = flor.create<yoga.YogaElement>(
      <box top={2} left={2} height={23} width={62} border={{ type: BorderStyle.round }}
        flexDirection={yoga.FLEX_DIRECTION_ROW}
      >
        <box
          // flexDirection={yoga.FLEX_DIRECTION_COLUMN}
          flexGrow={2}
        >
          <box></box>
          <box></box>
        </box>

        <box
          // flexDirection={yoga.FLEX_DIRECTION_COLUMN}
          flexGrow={1}
        >
          <box></box>
          <box></box>

        </box>

      </box>)
    flor.render()
    debug('expect: \n' + flor.printBuffer()+'\n', el.yogaDebug())
    //     await toContain(flor.renderer, '────────')
    //     flor.expect.toContain(`
    //  ╭──────────────────────────────╮
    //  │╒═════════════════════╕╒═════╕│
    //  ││                     ││     ││
    //  ││                     ││     ││
    //  ││                     ││     ││
    //  ││                     ││     ││
    //  ││                     ││     ││
    //  ││                     ││     ││
    //  │╘═════════════════════╛╘═════╛│
    //  │                              │
    //  │                              │
    //  │                              │
    //  ╰──────────────────────────────╯
    //  ` )  // TODO: why do I have to do this ? no left, no top... ISSUE
    //     flor.destroy()
    //     done()
  })
})
