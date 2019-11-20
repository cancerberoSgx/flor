import { Component, Flor } from '../jsx';
import { ElementProps } from '../programDom';
import { Layout } from '../util';
import { containerProps } from './commonProps';

interface BoxProps extends Partial<ElementProps> {
}

/**
 * Simple flex - enabled container.
 */
export class Box extends Component<BoxProps, {}> {
  render() {
    return <box {...containerProps()} width={.99} height={.99}  {...{ ...this.props, children: undefined }}>
      {this.props.children}
    </box>
  }
}

export function box(props: BoxProps) {
  return Flor.render(<Box {...props}>{props.children}</Box>)
}

interface ColProps extends Partial<ElementProps> {
  width: number
}
export class Col extends Component<ColProps> {
  render() {
    return <box {...containerProps()} height={.99} width={.99} {...{ ...this.props, children: undefined }} layout={{ layout: Layout.topDown }}>
      {this.props.children}
    </box>
  }
}

interface RowProps extends Partial<ElementProps> {
  height: number
}
export class Row extends Component<RowProps> {
  render() {
    return <box {...containerProps()} width={.99} height={.99}{...{ ...this.props, children: undefined }} layout={{ layout: Layout.leftRight }}                         >
      {this.props.children}
    </box>
  }
}
