import { Component, ElementProps, Flor, Input, Layout, Text } from '../../../src';
import { State } from './state';

export class Status extends Component<{
  state: State;
}> {
  render() {
    return null
  }
}

export class Settings extends Component<{
  state: State;
}> {
  render() {
    return <Col width={.99}   >
      <Row height={.3}>
        <Text>Speed (interval milliseconds):</Text>
        <Input value={this.props.state.settings.speed + ''} onChange={e => this.props.state.settings.speed = parseInt(e.value) || this.props.state.settings.speed}></Input>
      </Row>
      <Row height={.3}>
        <Text>Difficulty</Text>
        <Input value={this.props.state.settings.speed + ''} onChange={e => this.props.state.settings.speed = parseInt(e.value) || this.props.state.settings.speed}></Input>
      </Row>
    </Col>
  }
}

interface ColProps extends Partial<ElementProps> {
}
export class Col extends Component<ColProps> {
  render() {
    return <box height={.99} layout={{ layout: Layout.topDown }} {...this.props}>
      {this.props.children}
    </box>
  }
}

interface RowProps extends Partial<ElementProps> {
}
export class Row extends Component<RowProps> {
  render() {
    return <box width={.99} layout={{ layout: Layout.leftRight }} {...this.props}>
      {this.props.children}
    </box>
  }
}

interface SelectProps extends Partial<ElementProps> {
}
/**
<Select onChange={debug(e.value)}>
<Option>foo</Option>
<Option>bar</Option>
</Select>
 */
export class Select extends Component<SelectProps> {
  render() {
    return <box width={.99} layout={{ layout: Layout.leftRight }} {...this.props}>
      {this.props.children}
    </box>
  }
}
