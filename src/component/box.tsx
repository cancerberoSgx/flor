import { Component, Flor } from '../jsx'
import { YogaElementProps } from '../yogaDom';
import { containerProps } from './commonProps';
import { asArray } from 'misc-utils-of-mine-generic';
import { isArray } from 'util';

interface BoxProps extends Partial<YogaElementProps> {
}

/**
 * Simple flex - enabled container.
 */
export class Box extends Component<BoxProps, {}> {
  render() {
    return <box {...containerProps()} {...{ ...this.props, children: undefined }}>{this.props.children}</box>
  }
}

export function box(props: BoxProps) {
  return Flor.render(<Box {...props}>{props.children}</Box>)
}
