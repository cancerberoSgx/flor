// import { Flor, FlorDocument, YogaDocument, ProgramElement, debug, isElement } from '../src';
// import { defaultTestSetup } from './testUtil';
// import { int } from './data';
// import { FlorDocumentTesting } from './florTestHelper';
// import { sleep } from 'misc-utils-of-mine-generic';
// var AutoLayout = require('autolayout') as any

// describe('auto layout - boundConstrain', () => {
//   let flor: FlorDocumentTesting
//   beforeEach(() => {
//     flor = new FlorDocumentTesting()
//   })
//   afterEach(() => {
//     flor.destroy()
//   })

//   xit('1', async done => {

//     const el = flor.create(
//     <box width={.9} height={.9} top={.1} left={.1}>test123
      
//     </box>
//     )

//     el.create(<box top={0.1} left={0.1}  width={0.4} height={0.8} bg='red'>test123</box>    )
//     flor.render()

//     expect(YogaDocument.is(flor.document)).toBe(false)
//     await sleep(1000)

//     var constraints = AutoLayout.VisualFormat.parse([
//       'H:|[view1(==view2)]-10-[view2]|',
//       'V:|[view1,view2]|'
//     ], { extended: true, spacing: 1 });
//     var view = new AutoLayout.View({ constraints: constraints });
//     view.setSize(50, 40);

//     function extractBounds(view: View) {
//       return {
//         left: view.left, top: view.top, right: view.right, bottom: view.bottom
//       }
//     }

//     const b2 = el.findDescendantContaining<ProgramElement>('view2')!;    
//     const b1 = el.findDescendantContaining<ProgramElement>('view1')!;
//     debug(!!b1, !!b2, b1 &&   b1.parentNode!!, b2 && !!b2.parentNode!!);
//     b2 && isElement(b2.parentNode) && b2.parentNode.props.assign(extractBounds(view.subViews.view2));    
//     b1 && isElement(b1.parentNode)&& b1.parentNode&& b1.parentNode!.props.assign(extractBounds(view.subViews.view1));
//     await sleep(122)
//     flor.render()

//     // extractBounds(view.subViews.view1)

//     interface View {
//       left: number, top: number, right: number, bottom: number, width: number, height: number
//     }
//     // debug(view.subViews.view1); // {left: 0, top: 0, width: 195, height: 500}
//     // debug(view.subViews.view2); // {left: 205, top: 0, width: 195, height: 500}

//     await sleep(50000)


//     // el.findDescendantContaining<ProgramElement>('view2')!.props.assign(view.subViews.view2)
//     // flor.destroy()
//     // done()
//   })
// })
