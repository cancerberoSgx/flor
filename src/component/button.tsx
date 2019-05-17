import { array } from 'misc-utils-of-mine-generic'
import * as yoga from 'yoga-layout'
import { Component, Flor } from '../jsx'
import { ProgramDocumentRenderer, MouseEvent } from '../manager'
import { ElementProps } from '..'
import { YogaElementProps, YogaElement } from '../yogaDom';
import { ProgramElement } from '../programDom';

interface ButtonProps extends Partial<YogaElementProps> {
  children?: string[]
}

/**
 * Component specialized on rendering Button.
 */
export class Button extends Component<ButtonProps, {}> {
  protected defaultProps: ButtonProps ={

  }

  onClick(r: MouseEvent) : boolean | void| undefined{
    if(this.props.onClick){
      this.onClick(r)
    }
  }

  constructor(p: ButtonProps, s: {}) {
    super(p, s)
    this.onClick = this.onClick.bind(this)
  }

  render() {
    return <box {...this.defaultProps}{...this.props} onClick={this.onClick}> </box>
  }

}

export function button(props: ButtonProps) {
  return Flor.render(<Button {...{ ...props, children: undefined }}>{props.children}</Button>)
}
