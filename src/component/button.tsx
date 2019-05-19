import { Component, Flor } from '../jsx'
import { MouseEvent } from '..'
import { ElementProps } from '../programDom';

interface ButtonProps extends  Partial<ElementProps> {
  children?: string[]
}

/**
 * Simple Button component.
 */
export class Button extends Component<ButtonProps, {}> {
  protected defaultProps: ButtonProps = {

  }

  constructor(p: ButtonProps, s: {}) {
    super(p, s)
    this.onClick = this.onClick.bind(this)
  }

  onClick(r: MouseEvent): boolean | void | undefined {
    if (this.props.onClick) {
      this.props.onClick(r)
    }
  }

  render() {
    return <box {...this.defaultProps}{...this.props} onClick={this.onClick}>{this.props.children}</box>
  }

}

export function button(props: ButtonProps) {
  return Flor.render(<Button {...{ ...props, children: undefined }}>{props.children}</Button>)
}
