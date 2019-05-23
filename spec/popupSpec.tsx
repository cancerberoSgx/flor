// import { sleep } from 'misc-utils-of-mine-generic'
// import { FlorDocument, MouseAction, MouseEvent, Component, ElementProps, Box, Button, ElementOfComponent, isElement, ProgramElement } from '../src'
// import { Flor } from '../src/jsx/createElement'
// import { defaultTestSetup, expectNotToContain, expectToContain, willContain } from './testUtil'
// import { Selector, parseSelector } from '../src/dom/querySelector';


// interface PopUpProps extends Partial<ElementProps> {
//   target?: ProgramElement|(()=>ProgramElement)|Selector|string
//   targetRelativePosition?: 'bottom'|'top'
// }
// export class PopUp extends Component<PopUpProps> {
//   show(): any {
//     this.element!.props.visible=true
//   }
//   static elementType = 'flor.popUp'
//   static is(a: any): a is ElementOfComponent<PopUp>{
//     return isElement(a) && a.props.elementType===PopUp.elementType
//   }
//   render() {
//     return  <box position="absolute" visible={this.props.visible||false} {...this.props} elementType={PopUp.elementType}>{this.props.children}</box>
//   }
// }

// describe('popup', () => {
//   // let flor: FlorDocument
//   // defaultTestSetup(f => flor = f || flor)

//   // fit('should popup under the target element by default', async done => {
//   //   const p = <Box    >
//   //    <Button name="button" onClick={e=>{
//   //      const ee = e.currentTarget!.ownerDocument.body.findDescendant(PopUp.is)!//.getComponent()!.show()
//   //    }}>click me</Button>
//   //    {/* <PopUp target='[name="button"]' */}
//   //    </Box>
//   //   // <el width={..99} height={.99} >
//   //   //   text
//   //   // </el>
//   //   const el = flor.create(p)
//   //   flor.render()
//   //   await willContain(flor, 'click me')
//   //   // done()
//   // })


//   fit('should popup under the target element by default', async done => {
//     const s = '.class1 #id2>[name=value]'
//    const expected =  `
//     Started
// [
//   {
//     "name": "class1",
//     "value": true,
//     "operator": "equals",
//     "type": "class",
//     "descendants": [
//       {
//         "name": "id2",
//         "value": true,
//         "operator": "equals",
//         "type": "id",
//         "children": [
//           {
//             "name": "name",
//             "value": "value",
//             "type": "prop",
//             "operator": "equals"
//           }
//         ]
//       }
//     ]
//   }
// ]
//     `
//     const r = parseSelector(s)
//     console.log(JSON.stringify(r, null, 2))
//     done()
//   })

// })
