import { asArray } from 'misc-utils-of-mine-generic'
import { Component, Flor } from '../jsx'
import { ElementProps, ProgramDocument, ProgramElement, isElement } from '../programDom'
import { KeyEvent, ProgramDocumentRenderer } from '../render'

interface ScrollableProps extends Partial<ElementProps> {
  onScroll?: (e: { currentTarget: ProgramElement, Scrollable: string }) => void
  // children: JSX.FlorJsxNode | JSX.FlorJsxNode[]
  verticalStep?: number
  horizontalStep?: number
}

export class Scrollable extends Component<ScrollableProps, {}> {
  protected yOffset = 0
  protected xOffset = 0
  vStep: number;
  yi: number=-Infinity
  yl: number=+Infinity
  renderer: ProgramDocumentRenderer|undefined

  protected renderChildren(renderer: ProgramDocumentRenderer) {
    this.renderer = renderer
  // debug('renderChildren')
  // flor.debug('renderChildren')
  // flor.debug(Array.from(this.element!.childNodes).length+' - '+ this.yOffset)
let first: ProgramElement|undefined
let last : ProgramElement|undefined
// this.y0  = this.element!.absoluteTop
  const vChildren = Array.from(this.element!.childNodes).filter((c, i, a)=>{
    if(last){return false}
    let r
    // let r = false
    if(isElement(c) ){
      // r =  this.intersect(c, this.element!)
      r = this.isContained(c, this.element!)
if(r && !first){
first = c
//   this.yi = c.absoluteTop
}
if(first&&!r){
last = c
//   this.yl = c.absoluteTop+c.props.width
// last = a[i-1]
}
return r
   }
   else {
     if(first&&(!last||!r))return true
   }
  })
  this.yi = first ? first.absoluteTop-this.element!.absoluteTop : this.element!.absoluteTop
  this.yl = last ? last.absoluteTop -this.element!.absoluteTop+ last.props.height: this.element!.absoluteTop+this.element!.props.height
  // flor.debug(vChildren.length+'')
    vChildren.forEach(c=>{
      if(isElement(c)){
        // c.props.bg='magenta'
        const top = c.props.top
        c.props.top = c.absoluteTop-  this.element!.absoluteTop - this.yOffset 
        renderer.renderElement(c)
        c.props.top = top
      }
    })
    // vChildren.forEach(c=>{
      // if(isElement(c)){
      //   c.props.top = c.absoluteTop-  this.element!.absoluteTop - this.yOffset 
      // }
    // })
  }
  intersect(c: ProgramElement, e: ProgramElement): any {
    return e.absoluteTop>=c.absoluteTop && c.absoluteTop<= e.absoluteTop+e.props.height||   c.absoluteTop>=e.absoluteTop && e.absoluteTop<= c.absoluteTop+c.props.height //   +c.props.height || e.absoluteTop+e.props.height<c.absoluteTop//  <=c.absoluteTop && c.absoluteTop+c.props.height<=this.yOffset +e.absoluteTop+ e.props.height
    // throw new Error('Method not implemented.');
  }
  isContained(c: ProgramElement, e: ProgramElement): any {
   return e.absoluteTop<=c.absoluteTop && c.absoluteTop+c.props.height<=this.yOffset +e.absoluteTop+ e.props.height
  }

  protected onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    if (!this.element!.props.focused) {
    //   return
    }
    const action  =  ['up', 'down', 'left', 'right'].includes(e.name) ? e.name : undefined
    if (!action) {
      return
    }
    if(action==='up'){
      this.yOffset= Math.min(this.yl, this.yOffset+this.vStep)
    }
    else 
    if(action==='down'){
      this.yOffset= Math.max(this.yi, this.yOffset-this.vStep)
    }
    // flor.debug(e.name+this.yOffset)
    // flor.render()
this.renderer&&    this.renderer!.renderElement(this.element!.parentNode! as ProgramElement)
  }
  constructor(p: ScrollableProps, s: {}) {
    super(p, s)
    this.vStep = this.props.verticalStep || 1
    this.onKeyPressed = this.onKeyPressed.bind(this)
    this.renderChildren = this.renderChildren.bind(this)
  }
  render() {
    return <box focusable={true} 
    {...{ ...this.props, onScroll: undefined, children: undefined }} 
    onKeyPressed={this.onKeyPressed} 
    renderChildren={this.renderChildren}
    overflow='hidden'
    >
      {...Array.isArray(this.props.children) ? this.props.children : asArray(this.props.children)}
    </box>
  }
}


export function scrollable(props: ScrollableProps & { document: ProgramDocument }) {
  return Flor.render(<Scrollable {...props} />, { document: props.document })
}
