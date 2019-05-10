import { Component, Flor } from '../jsx'
import { ElementProps, ProgramDocument, ProgramElement } from '../programDom'
import { asArray } from 'misc-utils-of-mine-generic';
import { KeyEvent } from '../render';

interface ScrollableProps extends Partial<ElementProps> {
  onScroll?: (e: { currentTarget: ProgramElement, Scrollable: string }) => void
  children: JSX.FlorJsxNode|JSX.FlorJsxNode[]
}

export class Scrollable extends Component<ScrollableProps, {}> {
  onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    if(!this.element!.props.focused){
      return
    }
    const action  =  ['up', 'down', 'left', 'right'].includes(e.name)? e.name : undefined
    if(!action){
      return
    }
    
  }
  // constructor(p: ScrollableProps, s: {}) {
  //   super(p, s)
  // }
elementReady(){
  // this.element!.props.on
}  
  render() {
    return <box focusable={true} {...{...this.props, onScroll: undefined, children: undefined}} onKeyPressed={this.onKeyPressed}>
      {...asArray(this.props.children)}
    </box>
  }
}

export function scrollable(props: ScrollableProps & { document: ProgramDocument }) {
  return Flor.render(<Scrollable {...props} />, { document: props.document })
}
