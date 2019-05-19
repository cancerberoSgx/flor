import { MouseEvent } from '..'
import { Component, Flor } from '../jsx'
import { ElementProps, ProgramElement } from '../programDom'
import { ClicksListener, clicks, ClicksEvent } from '../manager/clicks';

interface ButtonProps extends  Partial<ElementProps> {
  children?: string[]
  onClicks?: ClicksListener
}

/**
 * Simple Button component. It supports multiple clicks like double click.
 */
export class Button extends Component<ButtonProps, {}> {
  protected defaultProps: ButtonProps = {

  }

  constructor(p: ButtonProps, s: {}) {
    super(p, s)
    if(this.props.onClicks){
      this.elementReady.then(target=>clicks({target, handler: this.props.onClicks!}))
    }
  }

  render() {
    return <box {...this.defaultProps}{...this.props} onClick={this.props.onClick}>{this.props.children}</box>
  }

}

export function button(props: ButtonProps) {
  return Flor.render(<Button {...{ ...props, children: undefined }}>{props.children}</Button>)
}
