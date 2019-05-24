import { Box as Row, Button, Col, Component, Flor, FlorDocument, Scrollable } from '../../../src'
import { Settings } from './panel'
import { State } from './state'

interface AppProps {
  state: State
  flor: FlorDocument
}
export class App extends Component<AppProps> {
  constructor(p: AppProps, s: {}) {
    super(p, s)
  }
  render() {

    return (
      <Row height={.99} width={.99} >
        <Col width={.5}>
          <Scrollable height={.99} width={.99} top={0} left={0}>

            <box > hello</box>

            <Button onClick={e => { }}>asdasdas</Button>
          </Scrollable>
        </Col>
        <Settings {...this.props}  >

        </Settings>
        {/* <Col width={.5} ch="2">
        <Row height={.7}></Row>
        <Row height={.3}></Row>
      </Col> */}
      </Row>)
  }
}

// return ( <box{...containerProps()} height={.99} width={.99}  border={{ type: BorderStyle.round }}
// layout={{ layout: Layout.leftRight}}     preventChildrenCascade={true} >

// <box {...containerProps()} height={.99} width={.4 } layout={{ layout: Layout.topDown}}
// preventChildrenCascade={true} >

//     <Scrollable
//      {...containerProps()}
//     // normalVerticalStep={1}
//     normalHorizontalStep={1} height={.99} width={.50} top={0} left={0} border={{ type: BorderStyle.round }}
//     layout={{ layout: Layout.topDown}} preventChildrenCascade={true}

//     //  width={50} height={30}
//      rightExtraOffset={3} bottomExtraOffset={3} focus={undefined}
//     // border={{ type: BorderStyle.double }}
//     // layout={{ layout: Layout.topDown }}         preventChildrenCascade={true}
//       >

//     {/* // <box width={.99} height={999} layout={{ layout: Layout.topDown}} > */}

//     <Text width={.999} border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}> consectetur fugiat. Quis sint aliquip qui eu occaecat cupidatat aliquip consequat. Proident et laboris et consequat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Excepteur incididunt incididunt dolore nulla laboris aute eiusmod consectetur. Id voluptate elit enim do incididunt culpa ea reprehenderit deserunt aliquip in. Commodo laborum exercitation duis ea velit excepteur laboris labore enim. Quis dolore nisi adipisicing est sunt culpa id incididunt reprehenderit quis. Nisi eu consectetur ea do eiusmod id ullamco adipisicing. Laboris nulla excepteur tempor deserunt amet ipsum deserunt aute minim amet culpa tempor eiusmod ad. Labore labore irure ad consectetur sunt enim fugiat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Consectetur est commodo dolore consequat culpa magna aliqua. Lorem tempor consectetur nostrud ut id adipisicing minim eiusmod cillum id enim magna magna. Incididunt anim aliquip deserunt dolore excepteur duis aliquip qui reprehenderit sint excepteur id culpa. Sit consectetur proident laboris cillum laborum quis. Ullamco sint laboris tempor ad. Amet Lorem qui cupidatat aute incididunt cupidatat aliqua velit aute aliqua occaecat nulla.</Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >Fugiat sunt do consectetur fugiat. Quis sint aliquip qui eu occaecat cupidatat aliquip consequat. Proident et laboris et consequat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Excepteur incididunt incididunt dolore nulla laboris aute eiusmod consectetur. Id voluptate elit enim do incididunt culpa ea reprehenderit deserunt aliquip in. Commodo laborum exercitation duis ea velit excepteur laboris labore enim. Quis dolore nisi adipisicing est sunt culpa id incididunt reprehenderit quis. Nisi eu consectetur ea do eiusmod id ullamco adipisicing. Laboris nulla excepteur tempor deserunt amet ipsum deserunt aute minim amet culpa tempor eiusmod ad. Labore labore irure ad consectetur sunt enim fugiat.

//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Consectetur est commodo dolore consequat culpa magna aliqua. Lorem tempor consectetur nostrud ut id adipisicing minim eiusmod cillum id enim magna magna. Incididunt anim aliquip deserunt dolore excepteur duis aliquip qui reprehenderit sint excepteur id culpa. Sit consectetur proident laboris cillum laborum quis. Ullamco sint laboris tempor ad. Amet Lorem qui cupidatat aute incididunt cupidatat aliqua velit aute aliqua occaecat nulla.</Text>

//     {/* </box> */}

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}> consectetur fugiat. Quis sint aliquip qui eu occaecat cupidatat aliquip consequat. Proident et laboris et consequat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Excepteur incididunt incididunt dolore nulla laboris aute eiusmod consectetur. Id voluptate elit enim do incididunt culpa ea reprehenderit deserunt aliquip in. Commodo laborum exercitation duis ea velit excepteur laboris labore enim. Quis dolore nisi adipisicing est sunt culpa id incididunt reprehenderit quis. Nisi eu consectetur ea do eiusmod id ullamco adipisicing. Laboris nulla excepteur tempor deserunt amet ipsum deserunt aute minim amet culpa tempor eiusmod ad. Labore labore irure ad consectetur sunt enim fugiat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Consectetur est commodo dolore consequat culpa magna aliqua. Lorem tempor consectetur nostrud ut id adipisicing minim eiusmod cillum id enim magna magna. Incididunt anim aliquip deserunt dolore excepteur duis aliquip qui reprehenderit sint excepteur id culpa. Sit consectetur proident laboris cillum laborum quis. Ullamco sint laboris tempor ad. Amet Lorem qui cupidatat aute incididunt cupidatat aliqua velit aute aliqua occaecat nulla.</Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >Fugiat sunt do consectetur fugiat. Quis sint aliquip qui eu occaecat cupidatat aliquip consequat. Proident et laboris et consequat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Excepteur incididunt incididunt dolore nulla laboris aute eiusmod consectetur. Id voluptate elit enim do incididunt culpa ea reprehenderit deserunt aliquip in. Commodo laborum exercitation duis ea velit excepteur laboris labore enim. Quis dolore nisi adipisicing est sunt culpa id incididunt reprehenderit quis. Nisi eu consectetur ea do eiusmod id ullamco adipisicing. Laboris nulla excepteur tempor deserunt amet ipsum deserunt aute minim amet culpa tempor eiusmod ad. Labore labore irure ad consectetur sunt enim fugiat.

//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Consectetur est commodo dolore consequat culpa magna aliqua. Lorem tempor consectetur nostrud ut id adipisicing minim eiusmod cillum id enim magna magna. Incididunt anim aliquip deserunt dolore excepteur duis aliquip qui reprehenderit sint excepteur id culpa. Sit consectetur proident laboris cillum laborum quis. Ullamco sint laboris tempor ad. Amet Lorem qui cupidatat aute incididunt cupidatat aliqua velit aute aliqua occaecat nulla.</Text>
//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}> consectetur fugiat. Quis sint aliquip qui eu occaecat cupidatat aliquip consequat. Proident et laboris et consequat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Excepteur incididunt incididunt dolore nulla laboris aute eiusmod consectetur. Id voluptate elit enim do incididunt culpa ea reprehenderit deserunt aliquip in. Commodo laborum exercitation duis ea velit excepteur laboris labore enim. Quis dolore nisi adipisicing est sunt culpa id incididunt reprehenderit quis. Nisi eu consectetur ea do eiusmod id ullamco adipisicing. Laboris nulla excepteur tempor deserunt amet ipsum deserunt aute minim amet culpa tempor eiusmod ad. Labore labore irure ad consectetur sunt enim fugiat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Consectetur est commodo dolore consequat culpa magna aliqua. Lorem tempor consectetur nostrud ut id adipisicing minim eiusmod cillum id enim magna magna. Incididunt anim aliquip deserunt dolore excepteur duis aliquip qui reprehenderit sint excepteur id culpa. Sit consectetur proident laboris cillum laborum quis. Ullamco sint laboris tempor ad. Amet Lorem qui cupidatat aute incididunt cupidatat aliqua velit aute aliqua occaecat nulla.</Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >Fugiat sunt do consectetur fugiat. Quis sint aliquip qui eu occaecat cupidatat aliquip consequat. Proident et laboris et consequat.
//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Excepteur incididunt incididunt dolore nulla laboris aute eiusmod consectetur. Id voluptate elit enim do incididunt culpa ea reprehenderit deserunt aliquip in. Commodo laborum exercitation duis ea velit excepteur laboris labore enim. Quis dolore nisi adipisicing est sunt culpa id incididunt reprehenderit quis. Nisi eu consectetur ea do eiusmod id ullamco adipisicing. Laboris nulla excepteur tempor deserunt amet ipsum deserunt aute minim amet culpa tempor eiusmod ad. Labore labore irure ad consectetur sunt enim fugiat.

//     </Text>

//     <Text border={undefined} focus={undefined}
//         padding={{ top: 1, right: 2, left: 3, bottom: 1 }}  >
//     Consectetur est commodo dolore consequat culpa magna aliqua. Lorem tempor consectetur nostrud ut id adipisicing minim eiusmod cillum id enim magna magna. Incididunt anim aliquip deserunt dolore excepteur duis aliquip qui reprehenderit sint excepteur id culpa. Sit consectetur proident laboris cillum laborum quis. Ullamco sint laboris tempor ad. Amet Lorem qui cupidatat aute incididunt cupidatat aliqua velit aute aliqua occaecat nulla.</Text>
//   </Scrollable>

//      </box>

//       <Settings {...this.props}></Settings>
//       {/* // <box {...containerProps()} height={.99}width={.5} ch="2"  layout={{ layout: Layout.topDown}}>
//       //   <box {...containerProps()} width={.99} height={.7} ch="3" layout={{ layout: Layout.leftRight}}></box>
//       //   <box {...containerProps()} width={.99} height={.3} ch="4"layout={{ layout: Layout.leftRight}}></box> */}
//       // </box>
//     // </box>
// )
