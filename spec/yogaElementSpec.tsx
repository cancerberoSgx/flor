import { FlorDocument, Flor, BorderStyle, debug } from '../src'
import { defaultTestSetup, toContain } from './testUtil'
import { YogaDocument , JUSTIFY_FLEX_START} from '../src/programDom/yogaElement';
import * as yoga from  '../src/programDom/yogaElement'
import { int } from './data';
import { FlorDocumentTesting } from './florTestHelper';

describe('yogaElement', () => {

  it('simple row, grow, no need for left, right, width, height in descendants', async done => {
   const flor = new FlorDocumentTesting({
     documentImplementation () {return new YogaDocument()}
   })
  const el = flor.create( 
    <box top={2} left={2} height={13} width={32} border={{type: BorderStyle.round}} preventChildrenCascade={false}
    flexDirection={yoga.FLEX_DIRECTION_ROW} 
    // alignContent={yoga.ALIGN_CENTER}
    // alignItems={yoga.ALIGN_CENTER}
    flexWrap={yoga.WRAP_NO_WRAP}
    // justifyContent={yoga.ALIGN_STRETCH}
    // direction={yoga.DIRECTION_LTR}
    // flexShrink={1}
     >
      <box  
      // top={2} left={3} 
      // height={23} width={32} 
       border={{type: BorderStyle.doubleLight}} preventChildrenCascade={false}
      // flexDirection={yoga.FLEX_DIRECTION_COLUMN} 
      flexGrow={1}
      // flexShrink={1}
     >
        {/* <box  
        height={7} width={12}
         border={{type: BorderStyle.double}}>box 11</box>
      <box  height={9} width={15} border={{type: BorderStyle.double}}  >box 12</box> */}
      </box>  

       <box 
      //  top={2} left={3} 
      //  height={20} width={22}  
       border={{type: BorderStyle.doubleLight}} preventChildrenCascade={false}
        // flexDirection={yoga.FLEX_DIRECTION_COLUMN} 
      // flexGrow={1}
      // flexShrink={1}
       >
        {/* <box  height={8} width={14} border={{type: BorderStyle.double}}  >box 21</box>
      <box  height={6} width={13} border={{type: BorderStyle.double}}  >box 22</box> */}
      </box>
 
  </box>)
  flor.render()
  await toContain(flor.renderer, '────────')
  flor.expect.toContain(`
╭──────────────────────────────╮
│╒═════════════════════╕╒═════╕│
││                     ││     ││
││                     ││     ││
││                     ││     ││
││                     ││     ││
││                     ││     ││
││                     ││     ││
│╘═════════════════════╛╘═════╛│
│                              │
│                              │
│                              │
╰──────────────────────────────╯
`, {trimAndRemoveEmptyLines: true})  // TODO: why do I have to do this ? no left, no top... ISSUE
  flor.destroy()
  done()
  })
})
