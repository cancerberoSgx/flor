import { asArray, throttle } from 'misc-utils-of-mine-generic'
import { animate, easing } from '..'
import { Node } from '../dom'
import { Component, Flor } from '../jsx'
import { ElementProps, isElement, ProgramDocument, ProgramElement, Rectangle, rectangleIntersects, rectanglePlusOffsets } from '../programDom'
import { KeyEvent, ProgramDocumentRenderer } from '../render'
import { Animation } from '../util'
import { nextTick } from '../util/misc'

interface ScrollEvent {
  currentTarget: ProgramElement,
  /** number of rows considered to build the vertical offset. in other words the height ot the scrolled area. */
  rows: number,
  /** number of  cols considered to build the horizontal offset. in other words the height ot the scrolled area. */
  cols: number,
  /** current horizontal scroll position. [[cols]] / [[xOffset]] is the horizontal scrolled current percentage */
  xOffset: number
  /** current vertical scroll position. [[rows]] / [[yOffset]] is the vertical scrolled current percentage */
  yOffset: number
  /** Bounds of the scrolled region */
  bounds: Rectangle
}
interface ConcreteScrollableProps {
  onScroll?: (e: ScrollEvent) => void
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
  /**
   * What to do when user actionates while the widget is still in an animation.
   */
  interruptAnimation?: boolean
  verticalGotoEndKeys?: string[]
  verticalGotoStartKeys?: string[]
  horizontalGotoEndKeys?: string[]
  horizontalGotoStartKeys?: string[]

}
interface ScrollableProps extends ConcreteScrollableProps, Partial<ElementProps> {

}
export class Scrollable extends Component<ScrollableProps, {}> {
  protected yOffset: number
  protected xOffset: number
  // protected vStep: number;
  protected yi: number = +Infinity
  protected yl: number = -Infinity
  protected xi: number = +Infinity
  protected xl: number = -Infinity
  protected renderer: ProgramDocumentRenderer | undefined
  /**
   * Children currently "inside" the viewport, The "inside" predicate is [[elementInViewportPredicate]]
   */
  protected vChildren: Node[] = []
  protected scrolling: boolean = false

  protected defaultProps: Required<ConcreteScrollableProps> = {
    fastVerticalScrollStep: 20,
    fastScrollDownKeys: ['s'],
    interruptAnimation: false,
    fastScrollUpKeys: ['a'],
    leftExtraOffset: 5,
    normalScrollDownKeys: ['down'],
    normalScrollUpKeys: ['up'],
    verticalStep: 2,
    horizontalStep: 2,
    topExtraOffset: 5,
    bottomExtraOffset: 5,
    throttleVertical: 0,
    verticalAnimation: easing.bounceEasyOut(),
    verticalAnimationDuration: 2000,
    onScroll(e) { },
    verticalGotoEndKeys: [''],
    verticalGotoStartKeys: [''],
    horizontalGotoEndKeys: [''],
    horizontalGotoStartKeys: ['']
  }

  protected p: Required<ConcreteScrollableProps>

  constructor(p: ScrollableProps, s: {}) {
    super(p, s)
    this.onKeyPressed = this.onKeyPressed.bind(this)
    this.renderChildren = this.renderChildren.bind(this)
    this.p = { ...this.defaultProps, ...p }
    this.yOffset = 0 - this.p.topExtraOffset
    this._renderChildren = this._renderChildren.bind(this)
    this.xOffset = 0 - this.p.leftExtraOffset
    this.handleScrollEnd = this.handleScrollEnd.bind(this)
  }

  /** called from rendered to render our children. Delegates to [[_renderChildren]] */
  protected renderChildren(r: ProgramDocumentRenderer) {
    return this.props.throttleVertical ?
      throttle(this._renderChildren, this.props.throttleVertical, { trailing: true, leading: true }) :
      nextTick(this._renderChildren, r)
  }

  elArea: Rectangle = null as any

  protected _renderChildren(renderer: ProgramDocumentRenderer) {
    let forceCalcArea = false
    if (!this.renderer) {
      this.elArea = this.element!.getBounds()
      this.renderer = renderer
      this.renderer.writeArea = this.elArea
      // forceCalcArea = true
      // this.element!.onBoundsChange(()=>{
      // })
    }
    // TODO: clean this, remove first, last, use some() , performance
    // this.calcScrollArea(forceCalcArea);
    this.calcScrollArea()
    // TODO: assuming children ordered top-down!!!
    this.vChildren.forEach(c => {
      if (isElement(c)) {
        const y = c.absoluteTop - this.element!.absoluteTop - this.yOffset
        if (y >= -this.element!.absoluteTop) {
          const top = c.props.top
          // c.props.setTop(y, true)
          c.props.top = y // we need to make position dirty
          this.renderElement(c) // and call render so it get's updated
          // c.props.setTop(top, true)
          c.props.top = top
        }
      }
    })
  }

  /**
   * iterate children to get: 1) the current children in the current viewport. The predicate to if child is or not inside is
   * [[elementInViewportPredicate]]. 2) . The while Rect area being scrolled [[yi]], [[yl]], [[xi]], [[xl]]. Heads up,
   * this function is called on each render.
   */
  private calcScrollArea(forceCalc = false) {
    let first: ProgramElement | undefined
    let last: ProgramElement | undefined
    this.vChildren = Array.from(this.element!.childNodes).filter((c, i, a) => {
      if (last) {// } && !forceCalc) {
        return false
      }
      let r
      if (isElement(c)) {
        // forceCalc && this.addChildToScrollAreaCalc(c);
        // this.addChildToScrollAreaCalc(c);
        const cyi = c.absoluteTop - this.element!.absoluteTop - this.p.topExtraOffset
        if (this.yi > cyi) {
          this.yi = cyi
        }
        const cyl = c.absoluteTop - this.element!.absoluteTop - this.element!.props.height + c.props.height + this.p.bottomExtraOffset
        if (this.yl < cyl) {
          this.yl = cyl
        }
        // TODO: the same for xi xl

        r = this.elementInViewportPredicate(c, this.element!)
        if (r && !first) {
          first = c
          return true
        }
        if (first && !r || i === a.length - 1) {
          last = c
          return true
        }
        return r
      } else if (first && (!last || !r)) {
        return true
      }
    })
  }

  // private addChildToScrollAreaCalc(c: ProgramElement) {
  //   const cyi = c.absoluteTop - this.element!.absoluteTop - this.p.topExtraOffset
  //   if (this.yi > cyi) {
  //     this.yi = cyi
  //   }
  //   const cyl = c.absoluteTop - this.element!.absoluteTop - this.element!.props.height + c.props.height + this.p.bottomExtraOffset
  //   if (this.yl < cyl) {
  //     this.yl = cyl
  //   }
  //   //TODO: the same for xi xl
  // }

  protected elementInViewportPredicate(c: ProgramElement, el: ProgramElement): any {
    return rectangleIntersects(c.getBounds(), rectanglePlusOffsets(el.getBounds(), 0, this.yOffset))
  }
  private isContained(c: ProgramElement, e: ProgramElement, ratio: number) {
    return this.yOffset + e.absoluteTop - ratio <= c.absoluteTop && c.absoluteTop + c.props.height - ratio <= this.yOffset + e.absoluteTop + e.props.height
  }

  stopAnimation: () => void = () => { }

  handleScrollEnd() {
    this.scrolling = false
    this.stopAnimation && this.stopAnimation()
    // const e = {
    //   currentTarget: this,
    //   // /** number of rows considered to build the vertical offset. in other words the height ot the scrolled area. */
    //   // rows: this.yl-this.,
    //   // /** number of  cols considered to build the horizontal offset. in other words the height ot the scrolled area. */
    //   // cols: number,
    //   /** current horizontal scroll position. [[cols]] / [[xOffset]] is the horizontal scrolled current percentage */
    //   xOffset: 0,
    //   /** current vertical scroll position. [[rows]] / [[yOffset]] is the vertical scrolled current percentage */
    //   yOffset: this.yOffset,
    //   bounds: this.getScrollArea()
    // }
  }

  // /** Gets the current whole scrolled area, optionally recalculating it. */
  // getScrollArea(forceCalc?: boolean): Rectangle {
  //   return { yi: this.yi, yl: this.yl, xi: this.xi, xl: this.xl }
  // }

  protected onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    if (!this.element!.props.focused) {
      return //
    } else if (this.scrolling) {
      if (this.props.interruptAnimation) {
        this.handleScrollEnd()
      } else {
        this.renderer!.program.bell()
        this.handleScrollEnd()
        return
      }
    } else if (this.p.fastScrollUpKeys.includes(e.name)) {
      this.scrolling = true
      const start = this.yOffset
      animate({
        duration: this.p.verticalAnimationDuration,
        draw: t => {
          const final = Math.round(Math.max(this.yi, start + this.p.fastVerticalScrollStep * t))
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi, final)
            this.renderElement()
          }
        },
        timing: this.p.verticalAnimation,
        onEnd: () => {
          this.handleScrollEnd()
        },
        onStop: (l => this.stopAnimation = l)
      })
      return
    } else if (this.p.fastScrollDownKeys.includes(e.name)) {
      this.scrolling = true
      const start = this.yOffset
      animate({
        duration: this.p.verticalAnimationDuration,
        draw: t => {
          const final = Math.round(Math.max(this.yi, start - this.p.fastVerticalScrollStep * t))
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi, final)
            this.renderElement()
          }
        },
        timing: this.p.verticalAnimation,
        onEnd: () => {

          this.handleScrollEnd()
        },
        onStop: (l => this.stopAnimation = l)
      })
      return
    } else if (this.p.normalScrollUpKeys.includes(e.name)) {
      this.yOffset = Math.min(this.yl, this.yOffset + this.p.verticalStep)
      this.renderElement()
      // this.handleScrollEnd()
      // nextTick(this.handleScrollEnd)C
    } else if (this.p.normalScrollDownKeys.includes(e.name)) {
      this.yOffset = Math.max(this.yi, this.yOffset - this.p.verticalStep)
      this.renderElement()
      // this.handleScrollEnd()
      nextTick(this.handleScrollEnd)
    }
  }

  private renderElement(c = this.element!.parentNode as ProgramElement) {
    this.renderer!.renderElement(c
      //    , {
      //   writeArea: this.element!.getBounds()
      // }
    )
  }

  render() {
    return <box focusable={true}
      {...{ ...this.props, onScroll: undefined, children: undefined }}
      onKeyPressed={this.onKeyPressed}
      renderChildren={this.renderChildren}
      overflow="hidden"
    >
      {...Array.isArray(this.props.children) ? this.props.children : asArray(this.props.children)}
    </box>
  }
}

export function scrollable(props: ScrollableProps & { document: ProgramDocument }) {
  return Flor.render(<Scrollable {...props} />, { document: props.document })
}
