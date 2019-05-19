import { Component, Flor } from '../jsx'
import { ElementProps } from '../programDom'
import { focusableProps } from './commonProps'
import { YogaElementProps } from '../yogaDom';

interface ButtonProps extends Partial<YogaElementProps> {
  children?: string[]
}

/**
 * Simple Button component. It supports multiple clicks like double click.
 */
export class Button extends Component<ButtonProps, {}> {

  render() {
    return <box {...focusableProps()} {...this.props}>{this.props.children}</box>
  }

}

export function button(props: ButtonProps) {
  return Flor.render(<Button {...{ ...props, children: undefined }}>{props.children}</Button>)
}
