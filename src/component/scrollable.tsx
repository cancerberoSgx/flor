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
  protected renderer: ProgramDocumentRenderer | undefined
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
    verticalGotoEndKeys:  [''],
    verticalGotoStartKeys:  [''],
    horizontalGotoEndKeys:  [''],
    horizontalGotoStartKeys:  ['']
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
  }
  protected renderChildren(r: ProgramDocumentRenderer) {return this.props.throttleVertical ? throttle(this._renderChildren, this.props.throttleVertical, { trailing: true, leading: true }) : nextTick(this._renderChildren, r)}
  elArea: Rectangle = null as any
  protected _renderChildren(renderer: ProgramDocumentRenderer) {

    if (!this.renderer) {
      this.elArea = this.element!.getBounds()
      this.renderer = renderer
      this.renderer.  writeArea = this.elArea

    // this.element!.onBoundsChange(()=>{

    // })
    }
    // TODO: clean this, remove first, last, use some() , performance
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
      } else {
        if (first && (!last || !r)) return true
      }
    })
    // TODO: assuming children ordered top-down!!!
    this.vChildren.forEach(c => {
      if (isElement(c)) {
        const y = c.absoluteTop - this.element!.absoluteTop - this.yOffset
        if (y >= -this.element!.absoluteTop) {
          const top = c.props.top
          c.props.setTop(y, true)
          this.renderElement(c)
          c.props.setTop(top, true)
        }
      }
    })
  }

  protected elementInViewportPredicate(c: ProgramElement, el: ProgramElement): any {
    return rectangleIntersects(c.getBounds(), rectanglePlusOffsets(el.getBounds(), 0, this.yOffset))
  }
  private isContained(c: ProgramElement, e: ProgramElement, ratio: number) {
    return this.yOffset + e.absoluteTop - ratio <= c.absoluteTop && c.absoluteTop + c.props.height - ratio <= this.yOffset + e.absoluteTop + e.props.height
  }

  stopAnimation: () => void = () => {}

  protected onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    if (!this.element!.props.focused) {
      return //
    } else if (this.scrolling) {
      if (this.props.interruptAnimation) {
        this.stopAnimation()
        this.scrolling = false
      } else {
        this.scrolling = false
        this.stopAnimation()
        this.renderer!.program.bell()
        return
      }
    } else if (this.p.fastScrollUpKeys.includes(e.name)) {
      this.scrolling = true
      const start = this.yOffset
      animate({
        duration: this.p.verticalAnimationDuration,
        draw: t => {
          const final =  Math.round(Math.max(this.yi,start + this.p.fastVerticalScrollStep * t))
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi, final)
            this.renderElement()
          }
        },
        timing: this.p.verticalAnimation,
        onEnd: () => {
          this.scrolling = false
          this.stopAnimation()
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
          const final =  Math.round(Math.max(this.yi,start - this.p.fastVerticalScrollStep * t))
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi,final)
            this.renderElement()
          }
        },
        timing: this.p.verticalAnimation,
        onEnd: () => {
          this.scrolling = false
          this.stopAnimation()
        },
        onStop: (l => this.stopAnimation = l)
      })
      return
    } else if (this.p.normalScrollUpKeys.includes(e.name)) {
      this.yOffset = Math.min(this.yl, this.yOffset + this.p.verticalStep)
      this.renderElement()
    } else if (this.p.normalScrollDownKeys.includes(e.name)) {
      this.yOffset = Math.max(this.yi, this.yOffset - this.p.verticalStep)
      this.renderElement()
    }
  }

  private renderElement(c= this.element!.parentNode as ProgramElement) {
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
