import { asArray, throttle } from 'misc-utils-of-mine-generic'
import { Component, Flor } from '../jsx'
import { ElementProps, ProgramDocument, ProgramElement, isElement, Rectangle } from '../programDom'
import { KeyEvent, ProgramDocumentRenderer } from '../render'
import { Minimatch } from 'minimatch';
import { Node } from '../dom';
import { debug, Animation } from '../util';
import { animate, easing } from '..'
import { TODO } from 'misc-utils-of-mine-typescript';
import { nextTick } from '../util/misc';

interface ConcreteScrollableProps {
  onScroll?: (e: { currentTarget: ProgramElement, Scrollable: string }) => void
  verticalStep?: number
  horizontalStep?: number
  topExtraOffset?: number
  leftExtraOffset?: number
  bottomExtraOffset?: number
  throttleVertical?: number
  verticalAnimation?: Animation
  verticalAnimationDuration?: number
  normalScrollDownKeys?: string[]
  normalScrollUpKeys?: string[]
  fastScrollDownKeys?: string[]
  fastScrollUpKeys?: string[]
  fastVerticalScrollStep?: number
  // scrollVerticalEndKeys?: string[]
  // scrollVerticalBeginningKeys?: string[]
  // scrollUpBeginningKeys?: string[]
}
interface ScrollableProps extends ConcreteScrollableProps, Partial<ElementProps> {

}
export class Scrollable extends Component<ScrollableProps, {}> {
  protected yOffset: number
  protected xOffset: number
  // protected vStep: number;
  protected yi: number = +Infinity
  protected yl: number = -Infinity
  protected renderer: ProgramDocumentRenderer | undefined
  protected vChildren: Node[] = []
  protected scrolling: boolean = false

  protected defaultProps: Required<ConcreteScrollableProps> = {
    fastVerticalScrollStep: 20, fastScrollDownKeys: ['s'], fastScrollUpKeys: ['a'], leftExtraOffset: 5, normalScrollDownKeys: ['down'], normalScrollUpKeys: ['up'],
    verticalStep: 2, horizontalStep: 2, topExtraOffset: 5, bottomExtraOffset: 5, throttleVertical: 0, verticalAnimation: easing.bounceEasyOut(), verticalAnimationDuration: 2000, onScroll(e) { }
  }

  protected p: Required<ConcreteScrollableProps>
  constructor(p: ScrollableProps, s: {}) {
    super(p, s)
    // this.p.verticalStepvStep = this.props.verticalStep || 1
    this.onKeyPressed = this.onKeyPressed.bind(this)
    this.renderChildren = this.renderChildren.bind(this)
    this.p = { ...this.defaultProps, ...p }
    this.yOffset = 0 - this.p.topExtraOffset
    this._renderChildren = this._renderChildren.bind(this)
    this.xOffset = 0 - this.p.leftExtraOffset
  }
  // elementReady(){
  //   this.element!.getChildrenElements().forEach(e=>{
  //     if(this.yi>e.absoluteTop- this.element!.absoluteTop -this.p.topExtraOffset){
  //       this.yi=e.absoluteTop- this.element!.absoluteTop  -this.p.topExtraOffset
  //     }
  //     if(this.yl<e.absoluteTop-this.element!.absoluteTop - this.element!.props.height + e.props.height + this.p.bottomExtraOffset){
  //       this.yl=e.absoluteTop- this.element!.absoluteTop - this.element!.props.height + e.props.height + this.p.bottomExtraOffset
  //     }
  //   })
  //   // this.yi = first ? first.absoluteTop - this.element!.absoluteTop : this.element!.absoluteTop
  //   // this.yl = last ? last.absoluteTop - this.element!.absoluteTop + last.props.height : this.element!.absoluteTop + this.element!.props.height
  // }

  // private tc =
  protected renderChildren(r: ProgramDocumentRenderer){nextTick(this._renderChildren, r)}
    // (r)=>this._renderChildren(r))}
  // throttle(this._renderChildren.bind(this), 100, {leading: true})
  // (renderer: ProgramDocumentRenderer) {
    
  // }C
  elArea : Rectangle = null as any
  protected _renderChildren(renderer: ProgramDocumentRenderer) {
    if(!this.renderer){
      this.elArea = this.element!.getBounds()
      this.renderer = renderer
      this.renderer.  writeArea= this.elArea
    }
    let first: ProgramElement | undefined
    let last: ProgramElement | undefined
    this.vChildren = Array.from(this.element!.childNodes).filter((c, i, a) => {
      if (last) { return false }
      let r
      if (isElement(c)) {
        if (this.yi > c.absoluteTop - this.element!.absoluteTop - this.p.topExtraOffset) {
          this.yi = c.absoluteTop - this.element!.absoluteTop - this.p.topExtraOffset
        }
        if (this.yl < c.absoluteTop - this.element!.absoluteTop - this.element!.props.height + c.props.height + this.p.bottomExtraOffset) {
          this.yl = c.absoluteTop - this.element!.absoluteTop - this.element!.props.height + c.props.height + this.p.bottomExtraOffset
        }

        r = this.elementInViewportPredicate(c, this.element!)//, Math.round(c.props.height/2))//Math.round(c.props.height/2)) //&&( c.absoluteTop - this.element!.absoluteTop - this.yOffset)>=-this.element!.absoluteTop
        // r = this.intersect(c, this.element!)
        if (r && !first) {
          first = c
          return true
        }
        if (first && !r || i === a.length - 1) {
          last = c
          return true
        }
        return r
      }
      else {
        if (first && (!last || !r)) return true
      }
    })
    // if (this.vChildren.length) {
    //   first = first || this.vChildren.find(isElement)
    //   last = last || [...this.vChildren].reverse().find(isElement)
    // }
    // first = first
    // TODO: assuming children ordered top-down!!! 
    this.vChildren.forEach(c => {
      if (isElement(c)) {
        // renderer.eraseElement(c)
        const y = c.absoluteTop - this.element!.absoluteTop - this.yOffset
        if (y >= -this.element!.absoluteTop) {
          // dont draw elements that got totally outside the screen
          const top = c.props.top
          c.props.top = y
         this.renderElement(c)
          c.props.top = top
        }
      }
    })
  }

  protected elementInViewportPredicate(c: ProgramElement, el: ProgramElement): any {
    return this.isContained(c, this.element!, Math.round(c.props.height / 2))
  }
  private intersect(c: ProgramElement, e: ProgramElement): any {
    return e.absoluteTop >= c.absoluteTop && c.absoluteTop <= e.absoluteTop + e.props.height || c.absoluteTop >= e.absoluteTop && e.absoluteTop <= c.absoluteTop + c.props.height
  }
  private isContained(c: ProgramElement, e: ProgramElement, ratio: number) {
    return this.yOffset + e.absoluteTop - ratio <= c.absoluteTop && c.absoluteTop + c.props.height - ratio <= this.yOffset + e.absoluteTop + e.props.height
  }

  protected onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    // if(this.scrolling){
    //   return
    // }
    // if (!this.element!.props.focused) {
    //   return //
    // }

    if (this.p.fastScrollUpKeys.includes(e.name)) {
      this.scrolling = true
      const start = this.yOffset
      animate({
        duration: this.p.verticalAnimationDuration,
        draw: t => {
          // debug('onKeyPressed', e.name, t, dy, this.p.fastVerticalScrollStep, this.yOffset, Math.min(this.yl, start + dy))
          const final =  Math.round( Math.max(this.yi,start +this.p.fastVerticalScrollStep * t))
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi, final)
            this.renderElement()
          }
        },
        timing: this.p.verticalAnimation,
        onEnd: () => {
          this.scrolling = false
        }
      })
      return
    }
    if (this.p.fastScrollDownKeys.includes(e.name)) {
      this.scrolling = true
      const start = this.yOffset
      animate({
        duration: this.p.verticalAnimationDuration,
        draw: t => {
          const final =  Math.round( Math.max(this.yi,start -this.p.fastVerticalScrollStep * t))
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi,final)
            this.renderElement()
          }
        },
        timing: this.p.verticalAnimation,
        onEnd: () => {
          this.scrolling = false
        }
      })
      return
    }
    if (this.p.normalScrollUpKeys.includes(e.name)) {
      this.yOffset = Math.min(this.yl, this.yOffset + this.p.verticalStep)
      this.renderElement();    
    }
    else if (this.p.normalScrollDownKeys.includes(e.name)) {
      this.yOffset = Math.max(this.yi, this.yOffset - this.p.verticalStep)
      this.renderElement();
    }
  }
  
  private renderElement(c=this.element!.parentNode as ProgramElement) {
    this.renderer!.renderElement(c     
    //    , {
    //   writeArea: this.element!.getBounds()
    // }  
      );
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
