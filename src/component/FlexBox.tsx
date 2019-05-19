import { Component, Flor } from '../jsx'
import { YogaElementProps } from '../yogaDom';
import { containerProps } from './commonProps';
import { asArray } from 'misc-utils-of-mine-generic';
import { isArray } from 'util';

interface BoxProps extends Partial<YogaElementProps> {
  // children: JSX.BlessedJsxChild[]
}

/**
 * Simple flex - enabled container.
 */
export class Box extends Component<BoxProps, {}> {
  render() {
    return <box {...this.props}>{...this.props.children as any}</box>
  }
}

// export function box(props: BoxProps) {
//   return Flor.render(<Box {...{ ...props, children: undefined as any }}>{...props.children ? asArray(props.children) : []}</Box>)
// }
