import { notFalsy } from 'misc-utils-of-mine-typescript'
import { Component, Flor } from '../jsx'
import { YogaElementProps } from '../yogaDom'
import { focusableProps } from './commonProps'

interface ButtonProps extends Partial<YogaElementProps> {
  children?: string[]
}

/**
 * Simple Button component. It supports multiple clicks like double click.
 */
export class Button extends Component<ButtonProps, {}> {

  render() {
    return <box {...focusableProps()} width={.4} height={3} left={0} top={0} {...{ ...this.props, children: undefined }}>
      {(this.props.children || []).filter(notFalsy).join(' ')}
      {/* <box {...baseProps()} border={undefined}>{(this.props.children || []).filter(notFalsy).join(' ')}</box> */}
    </box>
  }

}

export function button(props: ButtonProps) {
  return Flor.render(<Button {...props}></Button>)
}
