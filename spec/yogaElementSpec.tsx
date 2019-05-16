import { BorderStyle, Flor, debug } from '../src';
import * as yoga from '../src/programDom/yogaElement';
import { YogaDocument } from '../src/programDom/yogaElement';
import { FlorDocumentTesting } from './florTestHelper';
import { toContain } from './testUtil';
import { sleep } from 'misc-utils-of-mine-generic';

describe('yogaElement', () => {

  it('FLEX_DIRECTION_ROW, flexGrow, descendants bounds not needed', async done => {
    const flor = new FlorDocumentTesting({
      documentImplementation() { return new YogaDocument() }
    })
    const el = flor.create<yoga.YogaElement>(
      <box top={2} left={2} height={13} width={32} border={{ type: BorderStyle.round }}
        display={yoga.DISPLAY_FLEX}
        flexDirection={yoga.FLEX_DIRECTION_ROW}
      >
        <box flex={1}></box>
        <box flex={0}></box>
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
    // el.erase()
    el.render()
    // debug('expect: \n' + flor.printBuffer()+'\n', JSON.stringify(el.yogaDebug(), null, 2)+'\n', JSON.stringify(el.debugAsJson(), null, 2)+'\n', el.debugAsXml())

    flor.destroy()
    done()
  })


  xit('simple row, with columns, one grow', async done => {
    const flor = new FlorDocumentTesting({
      documentImplementation() { return new YogaDocument() }
    })
    const el = flor.create<yoga.YogaElement>(
      <box top={2} left={2} height={23} width={62} border={{ type: BorderStyle.round }} preventChildrenCascade={true}
        display={yoga.DISPLAY_FLEX}
        // dire
        // flex={0}
        flexShrink={1}

        justifyContent={yoga.JUSTIFY_FLEX_START}
        alignItems={yoga.ALIGN_STRETCH}
        alignContent={yoga.ALIGN_STRETCH}
        // justifyContent={yoga.JUSTIFY_SPACE_EVENLY}

        flexDirection={yoga.FLEX_DIRECTION_ROW}
      >
        <box border={{ type: BorderStyle.round }}preventChildrenCascade={true}
          flexDirection={yoga.FLEX_DIRECTION_COLUMN}
          // flex={0}
          alignItems={yoga.ALIGN_STRETCH}
          alignContent={yoga.ALIGN_AUTO}
          alignSelf={yoga.ALIGN_AUTO}
          justifyContent={yoga.JUSTIFY_FLEX_START}
          flexGrow={1} flexShrink={1}
          width={Infinity} height={Infinity}
          top={Infinity} left={Infinity}
        >
          <box border={{ type: BorderStyle.round }}preventChildrenCascade={true}
            //  flexGrow={2} 
          // alignItems={yoga.ALIGN_AUTO}
          // alignContent={yoga.ALIGN_AUTO}
          // alignSelf={yoga.ALIGN_AUTO}
          // justifyContent={yoga.JUSTIFY_FLEX_START}
            flexGrow={1} flexShrink={1}
            flexDirection={yoga.FLEX_DIRECTION_ROW}            
            width={Infinity} height={Infinity}
            top={Infinity} left={Infinity}
          // flex={1}
          >11</box>
          <box border={{ type: BorderStyle.round }}
            width={Infinity} height={Infinity} flexDirection={yoga.FLEX_DIRECTION_ROW}
            //  flexGrow={1}
          // alignItems={yoga.ALIGN_AUTO}
          // alignContent={yoga.ALIGN_AUTO}
          // alignSelf={yoga.ALIGN_AUTO}
          // justifyContent={yoga.JUSTIFY_FLEX_START}
            flexGrow={1}  flexShrink={1}
            top={Infinity} left={Infinity}
          // flex={2}
          >12</box>
        </box>

        <box border={{ type: BorderStyle.round }}preventChildrenCascade={true}
          flexDirection={yoga.FLEX_DIRECTION_COLUMN}
          alignContent={yoga.ALIGN_STRETCH}
          alignItems={yoga.ALIGN_STRETCH}
          // alignContent={yoga.ALIGN_AUTO}
          // alignSelf={yoga.ALIGN_AUTO}
          justifyContent={yoga.JUSTIFY_FLEX_START}
          // flex={0}
          width={Infinity} height={Infinity}
          top={Infinity} left={Infinity}
          flexGrow={1}         flexShrink={1}
        >
          <box border={{ type: BorderStyle.round }}
            alignSelf={yoga.ALIGN_STRETCH}             
          width={Infinity} height={Infinity}
          flexGrow={1}                flexShrink={1}
             top={Infinity} left={Infinity}
            // alignItems={yoga.ALIGN_AUTO}
            // alignContent={yoga.ALIGN_AUTO}
            // alignSelf={yoga.ALIGN_AUTO}
            // justifyContent={yoga.JUSTIFY_FLEX_START}
            // flexDirection={yoga.FLEX_DIRECTION_ROW}
            // width={Infinity} height={Infinity}
       
          // flex={1}
          >21</box>
          <box border={{ type: BorderStyle.round }}
            //  flexGrow={2}
            // width={Infinity} height={Infinity} flexDirection={yoga.FLEX_DIRECTION_ROW}
            // flexGrow={2}  flexShrink={0}
            // alignItems={yoga.ALIGN_AUTO}
            // alignContent={yoga.ALIGN_AUTO}
            alignSelf={yoga.ALIGN_STRETCH}
            // justifyContent={yoga.JUSTIFY_FLEX_START}
          width={Infinity} height={Infinity}
          flexGrow={1}         flexShrink={1}
          top={Infinity} left={Infinity}
          
          // flex={2}
          >22</box>

        </box>

      </box>)
    flor.render()

    // flor.render(el)
    // await sleep(2000)
    // debug('expect: \n' + flor.printBuffer()+'\n', JSON.stringify(el.yogaDebug(), null, 2)+'\n', JSON.stringify(el.debugAsJson(), null, 2)+'\n', el.debugAsXml())

    // debug('expect: \n' + flor.printBuffer()+'\n', JSON.stringify(el.yogaDebug(), null, 2))
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
    // flor.destroy()
    // done()
  })
})
