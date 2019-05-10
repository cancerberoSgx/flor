import { asArray } from 'misc-utils-of-mine-generic'
import { Component, Flor } from '../jsx'
import { ElementProps, ProgramDocument, ProgramElement, isElement } from '../programDom'
import { KeyEvent, ProgramDocumentRenderer } from '../render'
import { Minimatch } from 'minimatch';
import { Node } from '../dom';
import { debug } from '../util';
import { animate, easing } from '..'
import { TODO } from 'misc-utils-of-mine-typescript';

interface ConcreteScrollableProps {
  onScroll?: (e: { currentTarget: ProgramElement, Scrollable: string }) => void
  verticalStep?: number
  horizontalStep?: number
  topExtraOffset?: number 
  bottomExtraOffset?: number 
  throttleVertical?: number
  verticalAnimation?: TODO
  verticalAnimationDuration?: number
}
interface ScrollableProps extends ConcreteScrollableProps, Partial<ElementProps> {

}
export class Scrollable extends Component<ScrollableProps, {}> {
  protected yOffset = 0
  protected xOffset = 0
  // protected vStep: number;
  protected yi: number =+Infinity
  protected yl: number = -Infinity
  protected renderer: ProgramDocumentRenderer | undefined
  protected vChildren:  Node[] = []
  protected canScrollVertical: boolean=true

  protected defaultProps:  Required<ConcreteScrollableProps> = {
verticalStep: 2, horizontalStep: 2, topExtraOffset: 5, bottomExtraOffset: 5, throttleVertical: 0, verticalAnimation: undefined, verticalAnimationDuration: 0, onScroll(e){}
}

protected p: Required<ConcreteScrollableProps>
constructor(p: ScrollableProps, s: {}) {
  super(p, s)
  // this.p.verticalStepvStep = this.props.verticalStep || 1
  this.onKeyPressed = this.onKeyPressed.bind(this)
  this.renderChildren = this.renderChildren.bind(this)
  this.p = {...this.defaultProps, ...p}
}
elementReady(){
  this.element!.getChildrenElements().forEach(e=>{
    if(this.yi>e.absoluteTop- this.element!.absoluteTop -this.p.topExtraOffset){
      this.yi=e.absoluteTop- this.element!.absoluteTop  -this.p.topExtraOffset
    }
    if(this.yl<e.absoluteTop-this.element!.absoluteTop - this.element!.props.height + e.props.height + this.p.bottomExtraOffset){
      this.yl=e.absoluteTop- this.element!.absoluteTop - this.element!.props.height + e.props.height + this.p.bottomExtraOffset
    }
  })
  // this.yi = first ? first.absoluteTop - this.element!.absoluteTop : this.element!.absoluteTop
  // this.yl = last ? last.absoluteTop - this.element!.absoluteTop + last.props.height : this.element!.absoluteTop + this.element!.props.height
}

  protected renderChildren(renderer: ProgramDocumentRenderer) {
    this.renderer = renderer
    let first: ProgramElement | undefined
    let last: ProgramElement | undefined
    this.vChildren = Array.from(this.element!.childNodes).filter((c, i, a) => {
      if (last) { return false }
      let r
      if (isElement(c)) {
        r = this.isContained(c, this.element!, Math.round(c.props.height/2))//Math.round(c.props.height/2)) //&&( c.absoluteTop - this.element!.absoluteTop - this.yOffset)>=-this.element!.absoluteTop
        // r = this.intersect(c, this.element!)
        if (r && !first) {
          first = c
          return true
        }
        if (first && !r||i===a.length-1) {
          last = c
          return true
        }
        return r
      }
      else {
        if (first && (!last || !r)) return true
      }
    })
    if(this.vChildren.length){
      first = first || this.vChildren.find(isElement)
      last = last || [...this.vChildren].reverse().find(isElement)
    }
    first = first
    // TODO: assuming children ordered top-down!!! 
    this.vChildren.forEach(c => {
      if (isElement(c)) {
        // renderer.eraseElement(c)
        const y = c.absoluteTop - this.element!.absoluteTop - this.yOffset
        if (y >= -this.element!.absoluteTop ) {
          // dont draw elements that got totally outside the screen
          const top = c.props.top
          c.props.top = y
          renderer.renderElement(c)
          c.props.top = top
        }
      }
    })
  }

  // get contentHeight() {
  //   return 
  // }
private   intersect(c: ProgramElement, e: ProgramElement): any {
    return e.absoluteTop >= c.absoluteTop && c.absoluteTop <= e.absoluteTop + e.props.height || c.absoluteTop >= e.absoluteTop && e.absoluteTop <= c.absoluteTop + c.props.height
  }
private   isContained(c: ProgramElement, e: ProgramElement, ratio: number) {
    return this.yOffset + e.absoluteTop-ratio <= c.absoluteTop && c.absoluteTop + c.props.height -ratio <= this.yOffset + e.absoluteTop + e.props.height
  }

  protected onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    if (!this.element!.props.focused) {
    }
    const action = ['up', 'down', 'left', 'right'].includes(e.name) ? e.name : undefined
    if (!action) {
      return
    }
    // debug(''+this.yl+this.yi+'')
    if (action === 'up') {
      if(this.canScrollVertical){
        // if(this.props.v)
        this.yOffset = Math.min(this.yl, this.yOffset + this.p.verticalStep)
      }
    }
    else      if (action === 'down') {
        this.yOffset = Math.max(this.yi, this.yOffset - this.p.verticalStep)
      }
    if (this.renderer) {
      this.renderer!.renderElement(this.element!.parentNode! as ProgramElement)
    }
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
