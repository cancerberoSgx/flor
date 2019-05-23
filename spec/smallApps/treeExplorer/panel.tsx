// import { Component, ElementProps, Flor, Input, Layout, Text, Col } from '../../../src'
// import { State } from './state'
// import { Row } from '../shipShootingGame/panel';

// export class Status extends Component<{
//   state: State;
// }> {
//   render() {
//     return null
//   }
// }

// export class Settings extends Component<{
//   state: State;
// }> {
//   render() {
//     return <Col   {...this.props} height={.99} width={.5} left={.5} >
//       <Row   >
//         <Text>Editor</Text>
//         <Input value={this.props.state.settings.speed + ''} onChange={e => this.props.state.settings.speed = parseInt(e.value) || this.props.state.settings.speed}></Input>
//       </Row>
//       <Row  >
//         <Text>Examples and help</Text>
//         <Input value={this.props.state.settings.speed + ''} onChange={e => this.props.state.settings.speed = parseInt(e.value) || this.props.state.settings.speed}></Input>
//       </Row>
//     </Col>
//   }
// }

// // interface SelectProps extends Partial<ElementProps> {
// // }
// // /**
// // <Select onChange={debug(e.value)}>
// // <Option>foo</Option>
// // <Option>bar</Option>
// // </Select>
// //  */
// // export class Select extends Component<SelectProps> {
// //   render() {
// //     return <box width={.99} layout={{ layout: Layout.leftRight }} {...this.props}>
// //       {this.props.children}
// //     </box>
// //   }
// // }
