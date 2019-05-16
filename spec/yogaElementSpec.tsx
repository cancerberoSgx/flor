import { BorderStyle, Flor, debug, FlorDocument, ProgramDocumentRenderer, createElement, installExitKeys, ProgramDocument } from '../src';
import * as yoga from '../src/programDom/yogaElement';
import { YogaDocument } from '../src/programDom/yogaElement';
import { FlorDocumentTesting } from './florTestHelper';
import { toContain } from './testUtil';
import { sleep } from 'misc-utils-of-mine-generic';
import {getInstanceCount} from 'yoga-layout'

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
    const renderer = new ProgramDocumentRenderer({programOptions: {buffer: true}})
    installExitKeys(renderer.program)
    const document = new YogaDocument()
    Flor.setDocument(document)
    // document.body.props.assign({ height: renderer.program.rows, width: renderer.program.cols, top: 0, left: 0, minHeight: renderer.program.rows, minWidth: renderer.program.cols ,   ...fo} //flexGrow: 1
    // )
    document._setManagers({renderer, focus: null as any, events: null as any, cursor: null as any})
    // document.body.props.assign({ height: this.program.rows, width: this.program.cols, top: 0, left: 0 })
    // renderer.renderElement( document.body)
    const el = Flor.render<yoga.YogaElement>(
      <box width={50} height={20}  border={{ type: BorderStyle.round }} 
        flexDirection={yoga.FLEX_DIRECTION_ROW}
      >
        <box  height={13} width={32} flex={1}>1</box>
        <box  height={13} width={32} flex={0}>2</box>
      </box>)
    renderer.renderElement(document.body)
    await toContain(renderer, '────────')
    expect('\n'+renderer.printBuffer(true)+'\n').toContain(`
╭────────────────────────────────────────────────╮
│1──────────────╮2──────────────────────────────╮│
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
││              ││                              ││
│╰──────────────╯╰──────────────────────────────╯│
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
╰────────────────────────────────────────────────╯
`)
renderer.destroy()
    // debug('expect: /n' +renderer.printBuffer(true)+'/n', JSON.stringify(el.yogaDebug(), null, 2)+'/n', JSON.stringify(el.debugAsJson(), null, 2)+'/n', el.debugAsXml())
    done()
  })


  it('FLEX_DIRECTION_ROW, row using flex width and height', async done => {
    const el = flor.create<yoga.YogaElement>(
      <box top={2} left={2} height={13} width={32} border={{ type: BorderStyle.round }}
        flexDirection={yoga.FLEX_DIRECTION_ROW}
      >
        <box width={6} height={8} flex={1}></box>
        <box width={6} height={8} flex={0}></box>
      </box>)
    flor.render()
    await toContain(flor.renderer, '────────')
    flor.expect.toContain(`

  ╭──────────────────────────────╮
  │╭──────────────────────╮╭────╮│
  ││                      ││    ││
  ││                      ││    ││
  ││                      ││    ││
  ││                      ││    ││
  ││                      ││    ││
  ││                      ││    ││
  │╰──────────────────────╯╰────╯│
  │                              │
  │                              │
  │                              │
  ╰──────────────────────────────╯
`)
    // el.render()
    debug('expect: /n' + flor.printBuffer()+'/n', JSON.stringify(el.yogaDebug(), null, 2)+'/n', JSON.stringify(el.debugAsJson(), null, 2)+'/n', el.debugAsXml())
    done()
  })

  it('depth, percent bounds', async done => {
    const el = flor.create<yoga.YogaElement>(
      <box top={2} left={2} height={27} width={62} 
      // preventChildrenCascade={true}
      // border={{ type: BorderStyle.round }} 
        flexDirection={yoga.FLEX_DIRECTION_ROW} 
      >        
        <box width={.4} height={.999} flexShrink={1}  
        // preventChildrenCascade={true}
          // border={undefined} 
         flexDirection={yoga.FLEX_DIRECTION_COLUMN_REVERSE}>
          <box width={.999} flexShrink={1} border={{ type: BorderStyle.round }} height={.3} fg="red"></box>
          <box width={.999} height={.7} flexShrink={1} border={{ type: BorderStyle.roundTripleDash }}  
          padding={{top: 1, bottom: 2, left: 2, right: 2}} ch="/" fg="yellow"
          // flexDirection={yoga.FLEX_DIRECTION_ROW}
          //  flexWrap={yoga.WRAP_WRAP} 
          // justifyContent={yoga.JUSTIFY_CENTER} 
          // alignContent={yoga.JUSTIFY_SPACE_EVENLY} preventChildrenCascade={true}
          >
          {/* <box height={1} width={2}>hi</box> */}
          {/* {'Sint mollit velit et reprehenderit in reprehenderit fugiat eu.'.split(' ').map(w=><box 
          // minWidth={w.length+1} maxWidth={w.length+1} minHeight={1}
          flexShrink={1}  
          width={w.length+1} height={1}
          >{w}</box>)} */}
          </box> 
        </box>
        <box width={.6} flexShrink={1} height={.999} 
      flexDirection={yoga.FLEX_DIRECTION_COLUMN_REVERSE}>
        <box width={.999}  height={.3} flexShrink={1} ch="." border={{ type: BorderStyle.roundQuadrupleDash }} >
        </box>
          <box width={.999} height={.3}  ch="-" 
          flexShrink={1} flexGrow={1} border={{ type: BorderStyle.round }} >
          </box> 
          <box width={.999} flexShrink={1} border={{ type: BorderStyle.double }} ch="|"  height={.4}></box> 
        </box>
      </box>)
      // el.doLayout()
      flor.render()
      debug('expect: /n' + flor.printBuffer()+'/n', JSON.stringify(el.yogaDebug(), null, 2)+'/n', JSON.stringify(el.debugAsJson(), null, 2)+'/n', el.debugAsXml())
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
        // el.render()
        done()
  })



 it('align center', async done => {
   debug('init', getInstanceCount())
    const el = flor.create<yoga.YogaElement>(
      <box height={18} width={30} 
       direction={yoga.DIRECTION_LTR}  
      // border={{ type: BorderStyle.round }}
      //  preventChildrenCascade={true}
      // padding={{top: 2, bottom: 2, left: 2, right: 2}} flexShrink={1}
      justifyContent={yoga.JUSTIFY_CENTER} alignItems={yoga.ALIGN_CENTER} ch='·'
      >        
        <box width={5} height={4} 
        // flexShrink={1} 
        ch="s"
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
···········Sebas··············
···········sssss··············
···········sssss··············
···········sssss··············
······························
······························
······························
······························
······························
······························
······························
······························
······························
`, {trimAndRemoveEmptyLines: true}) 
        // el.render()
        // debug('expect: /n' + flor.printBuffer()+'/n', JSON.stringify(el.yogaDebug(), null, 2)+'/n', JSON.stringify(el.debugAsJson(), null, 2)+'/n', el.debugAsXml())
        done()
  })



//   xit('simple row, with columns, one grow', async done => {
//     const flor = new FlorDocumentTesting({
//       documentImplementation() { return new YogaDocument() }
//     })
//     const el = flor.create<yoga.YogaElement>(
//       <box top={2} left={2} height={23} width={62} border={{ type: BorderStyle.round }} preventChildrenCascade={true}
//         display={yoga.DISPLAY_FLEX}
//         // dire
//         // flex={0}
//         flexShrink={1}
//         direction={yoga.DIRECTION_LTR}
//         justifyContent={yoga.JUSTIFY_FLEX_START}
//         alignItems={yoga.ALIGN_STRETCH}
//         alignContent={yoga.ALIGN_STRETCH}
//         // justifyContent={yoga.JUSTIFY_SPACE_EVENLY}

//         flexDirection={yoga.FLEX_DIRECTION_ROW}
//       >
//         <box border={{ type: BorderStyle.round }} preventChildrenCascade={true}
//           flexDirection={yoga.FLEX_DIRECTION_COLUMN}
//           // flex={0}
//           alignItems={yoga.ALIGN_STRETCH}
//           alignContent={yoga.ALIGN_AUTO}
//           alignSelf={yoga.ALIGN_AUTO}
//           justifyContent={yoga.JUSTIFY_FLEX_START}
//           flexGrow={1} flexShrink={1}
//           width={Infinity} height={Infinity}
//           top={Infinity} left={Infinity}
//         >
//           <box border={{ type: BorderStyle.round }} preventChildrenCascade={true}
//             //  flexGrow={2} 
//             // alignItems={yoga.ALIGN_AUTO}
//             // alignContent={yoga.ALIGN_AUTO}
//             // alignSelf={yoga.ALIGN_AUTO}
//             // justifyContent={yoga.JUSTIFY_FLEX_START}
//             flexGrow={1} flexShrink={1}
//             flexDirection={yoga.FLEX_DIRECTION_ROW}
//             width={Infinity} height={Infinity}
//             top={Infinity} left={Infinity}
//           // flex={1}
//           >11</box>
//           <box border={{ type: BorderStyle.round }}
//             width={Infinity} height={Infinity} flexDirection={yoga.FLEX_DIRECTION_ROW}
//             //  flexGrow={1}
//             // alignItems={yoga.ALIGN_AUTO}
//             // alignContent={yoga.ALIGN_AUTO}
//             // alignSelf={yoga.ALIGN_AUTO}
//             // justifyContent={yoga.JUSTIFY_FLEX_START}
//             flexGrow={1} flexShrink={1}
//             top={Infinity} left={Infinity}
//           // flex={2}
//           >12</box>
//         </box>

//         <box border={{ type: BorderStyle.round }} preventChildrenCascade={true}
//           flexDirection={yoga.FLEX_DIRECTION_COLUMN}
//           alignContent={yoga.ALIGN_STRETCH}
//           alignItems={yoga.ALIGN_STRETCH}
//           // alignContent={yoga.ALIGN_AUTO}
//           // alignSelf={yoga.ALIGN_AUTO}
//           justifyContent={yoga.JUSTIFY_FLEX_START}
//           // flex={0}
//           width={Infinity} height={Infinity}
//           top={Infinity} left={Infinity}
//           flexGrow={1} flexShrink={1}
//         >
//           <box border={{ type: BorderStyle.round }}
//             alignSelf={yoga.ALIGN_STRETCH}
//             width={Infinity} height={Infinity}
//             flexGrow={1} flexShrink={1}
//             top={Infinity} left={Infinity}
//           // alignItems={yoga.ALIGN_AUTO}
//           // alignContent={yoga.ALIGN_AUTO}
//           // alignSelf={yoga.ALIGN_AUTO}
//           // justifyContent={yoga.JUSTIFY_FLEX_START}
//           // flexDirection={yoga.FLEX_DIRECTION_ROW}
//           // width={Infinity} height={Infinity}

//           // flex={1}
//           >21</box>
//           <box border={{ type: BorderStyle.round }}
//             //  flexGrow={2}
//             // width={Infinity} height={Infinity} flexDirection={yoga.FLEX_DIRECTION_ROW}
//             // flexGrow={2}  flexShrink={0}
//             // alignItems={yoga.ALIGN_AUTO}
//             // alignContent={yoga.ALIGN_AUTO}
//             alignSelf={yoga.ALIGN_STRETCH}
//             // justifyContent={yoga.JUSTIFY_FLEX_START}
//             width={Infinity} height={Infinity}
//             flexGrow={1} flexShrink={1}
//             top={Infinity} left={Infinity}

//           // flex={2}
//           >22</box>

//         </box>

//       </box>)
//     flor.render()

//     // flor.render(el)
//     // await sleep(2000)
//     // debug('expect: /n' + flor.printBuffer()+'/n', JSON.stringify(el.yogaDebug(), null, 2)+'/n', JSON.stringify(el.debugAsJson(), null, 2)+'/n', el.debugAsXml())

//     // debug('expect: /n' + flor.printBuffer()+'/n', JSON.stringify(el.yogaDebug(), null, 2))
//     //     await toContain(flor.renderer, '────────')
//     //     flor.expect.toContain(`
//     //  ╭──────────────────────────────╮
//     //  │╒═════════════════════╕╒═════╕│
//     //  ││                     ││     ││
//     //  ││                     ││     ││
//     //  ││                     ││     ││
//     //  ││                     ││     ││
//     //  ││                     ││     ││
//     //  ││                     ││     ││
//     //  │╘═════════════════════╛╘═════╛│
//     //  │                              │
//     //  │                              │
//     //  │                              │
//     //  ╰──────────────────────────────╯
//     //  ` )  // TODO: why do I have to do this ? no left, no top... ISSUE
//     // flor.destroy()
//     // done()
//   })
})
