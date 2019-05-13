import { asArray, throttle } from 'misc-utils-of-mine-generic'
import { animate, easing } from '..'
import { Node } from '../dom'
import { Component, Flor } from '../jsx'
import { ElementProps, isElement, ProgramDocument, ProgramElement, Rectangle, rectangleIntersects, rectanglePlusOffsets } from '../programDom'
import { KeyEvent, ProgramDocumentRenderer } from '../render'
import { Animation, debug } from '../util'
import { nextTick } from '../util/misc'

interface ScrollEvent {
  currentTarget: ProgramElement
  /** 
   * Current horizontal scroll position. getS [[cols]] / [[xOffset]] is the horizontal scrolled current
   * percentage 
   */
  xOffset: number
  /** 
   * Current vertical scroll position. `rows` / [[yOffset]] is the vertical scrolled current percentage, where
   * `rows` is `scrollArea.yl -  scrollArea.yi`. 
   */
  yOffset: number
}

interface ConcreteScrollableProps {
  /**
   * Listener notified when a scroll event happens. 
   */
  onScroll?: (e: ScrollEvent) => void
  /**
   * Number of rows to advance / retrocede on a normal vertical  scroll. 
   */
  normalVerticalStep?: number
  /**
   * Number of cols to advance / retrocede on a normal horizontal scroll. 
   */
  normalHorizontalStep?: number
  /**
   * Extra rows as scrolled area top padding. By default 5. 
   */
  topExtraOffset?: number
  /**
   * Extra cols as scrolled area left padding. By default 5. 
   */
  leftExtraOffset?: number
  /**
   * Extra rows as scrolled area bottom padding. By default 5. 
   */
  bottomExtraOffset?: number
  /**
   * If given, vertical scroll will be throttled by [[throttleVertical]] milliseconds. Use it only if really
   * necessary since it adds flickering.
   */
  throttleVertical?: number
  /**
   * Vertical easing animation to perform on fast scrolls or when scrolling to the end or start. By default
   * `bounceEasyOut`. Example: `largeScrollAnimation: easing.bounceEasyOut()`.
   */
  largeScrollAnimation?: Animation
  /**
   * Duration in milliseconds, for [[verticalAnimation]].
   */
  verticalAnimationDuration?: number
  /**
   * Keys that activate normal scroll down. Default: `[e => e.ctrl === false && e.name === 'down']`.
   */
  normalScrollDownKeys?: KeyPredicate[]
  /**
   * Keys that activate normal scroll up. Default: `[e => e.ctrl === false && e.name === 'up']`.
   */
  normalScrollUpKeys?: KeyPredicate[]
  /**
   * Keys that activate normal scroll down. Default: `[e => e.ctrl === true && e.name === 'down']`.
   */
  largeScrollDownKeys?: KeyPredicate[]
  /**
   * Keys that activate large scroll up. Default: `[e => e.ctrl === true && e.name === 'up']`.
   */
  largeScrollUpKeys?: KeyPredicate[]
  /**
   * Amount of rows to advance or retrocede on large scrolls. Default: 40.
   */
  largeVerticalScrollStep?: number
  /**
   * What to do when user activates while the widget is still in an animation. By default `true`.
   */
  interruptAnimation?: boolean
  verticalGotoEndKeys?: string[]
  verticalGotoStartKeys?: string[]
  horizontalGotoEndKeys?: string[]
  horizontalGotoStartKeys?: string[]
}

type KeyPredicate = (e: KeyEvent) => boolean
interface ScrollableProps extends ConcreteScrollableProps, Partial<ElementProps> {

}

/**
 * Scrollable box to  add vertical and/or horizontal scroll support for its children. Supports:
 *  * keyboard and mouse events with configurable keys 
 *  * different size scroll actions like normal, large, and going to the end/beginning. 
 *  * animations for large scroll
 */
export class Scrollable extends Component<ScrollableProps, {}> {
  protected yOffset: number
  protected xOffset: number
  protected yi: number = +Infinity
  protected yl: number = -Infinity
  protected xi: number = +Infinity
  protected xl: number = -Infinity
  protected renderer: ProgramDocumentRenderer | undefined

  /**
   * Children currently "inside" the viewport, The "inside" predicate is implemented in method
   * [[elementInViewportPredicate]] and currently are those children that intersects the viewport area.
   */
  protected vChildren: Node[] = []
  protected scrolling: boolean = false

  protected defaultProps: Required<ConcreteScrollableProps> = {
    largeVerticalScrollStep: 40,
    largeScrollUpKeys: [e => e.ctrl && e.name === 'w'],
    largeScrollDownKeys: [e => e.ctrl && e.name === 's'],
    interruptAnimation: true,
    leftExtraOffset: 5,
    normalScrollUpKeys: [e => !e.ctrl && e.name === 'up'||!e.ctrl && e.name === 'w'],
    normalScrollDownKeys: [e => !e.ctrl && e.name === 'down'|| !e.ctrl && e.name === 's'],
    normalVerticalStep: 2,
    normalHorizontalStep: 2,
    topExtraOffset: 5,
    bottomExtraOffset: 5,
    throttleVertical: 0,
    largeScrollAnimation: easing.bounceEasyOut(),
    verticalAnimationDuration: 1000,
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

  /** 
   * Called from rendered to render our children. Delegates to [[_renderChildren]].
   */
  protected renderChildren(r: ProgramDocumentRenderer) {
    return this.props.throttleVertical ?
      throttle(this._renderChildren, this.props.throttleVertical, { trailing: true, leading: true }) :
      nextTick(this._renderChildren, r)
  }

  protected _renderChildren(renderer: ProgramDocumentRenderer) {
    if (!this.renderer) {
      this.renderer = renderer
    }
    // TODO: clean this, remove first, last, use some() , performance this.calcScrollArea(forceCalcArea);
    this.calcScrollArea()
    this.vChildren.forEach(c => {
      if (isElement(c)) {
        const y = c.absoluteTop - this.element!.absoluteTop - this.yOffset
        if (y >= -this.element!.absoluteTop) {
          const top = c.props.top
          c.props.top = y // we need to make position dirty
          this.renderElement(c) // and call render so it gets updated
          c.props.top = top
        }
      }
    })
  }

  /**
   * Iterate children to get: 1) the current children in the current viewport. The predicate to if child is or
   * not inside is [[elementInViewportPredicate]]. 2) . The while Rect area being scrolled [[yi]], [[yl]],
   * [[xi]], [[xl]]. Heads up, this function is called on each render.
   */
  protected calcScrollArea() {
    let first: ProgramElement | undefined
    let last: ProgramElement | undefined
    this.vChildren = Array.from(this.element!.childNodes).filter((c, i, a) => {
      if (last) {
        return false
      }
      let r
      if (isElement(c)) {
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

  protected elementInViewportPredicate(c: ProgramElement, el: ProgramElement): any {
    const isContained = (c: ProgramElement, e: ProgramElement, ratio: number) => {
      return this.yOffset + e.absoluteTop - ratio <= c.absoluteTop && c.absoluteTop + c.props.height - ratio <=
        this.yOffset + e.absoluteTop + e.props.height
    }
    return rectangleIntersects(c.getBounds(), rectanglePlusOffsets(el.getBounds(), 0, this.yOffset))
  }

  /** 
   * Overridden by animate implementation. Don't call.  
   */
  private _stopAnimation: () => void = () => { }

  protected handleScrollEnd() {
    this.scrolling = false
    this._stopAnimation()
    if (this.props.onScroll) {
        this.p.onScroll({ currentTarget: this.element!, xOffset: 0, yOffset: this.yOffset })
    }
  }

  protected onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    if (!this.element!.props.focused) {
    } else if (this.scrolling) {
      if (this.p.interruptAnimation) {
        this.handleScrollEnd()
        nextTick(()=>this.onKeyPressed(e))
      } else {
        this.renderer!.program.bell()
        this.handleScrollEnd()
      }
    }    
    else if (this.p.largeScrollUpKeys.find(p => p(e))) {
      this.handleLargeScroll(-1);
      return
    } else if (this.p.largeScrollDownKeys.find(p => p(e))) {
      this.handleLargeScroll(1);
      return
    } else if (this.p.normalScrollUpKeys.find(p => p(e))) {
      this.yOffset = Math.max(this.yi, this.yOffset - this.p.normalVerticalStep)
      this.renderElement()
      this.handleScrollEnd()
    } else if (this.p.normalScrollDownKeys.find(p => p(e))) {
      this.yOffset = Math.min(this.yl, this.yOffset + this.p.normalVerticalStep)
      this.renderElement()
      this.handleScrollEnd()
    }
  }

  protected handleLargeScroll(multiplier: number) {
    this.scrolling = true;
    if (this.props.largeScrollAnimation) {
      const start = this.yOffset;
      animate({
        duration: this.p.verticalAnimationDuration,
        draw: t => {
          const final = Math.round(Math.max(this.yi, start + this.p.largeVerticalScrollStep * t * multiplier));
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi, final);
            this.renderElement();
          }
        },
        timing: this.p.largeScrollAnimation,
        onEnd: () => {
          this.handleScrollEnd();
        },
        onStop: (l => this._stopAnimation = l)
      });
    }
    else {
      if (multiplier < 0) {
        this.yOffset = Math.max(this.yi, this.yOffset - this.p.largeVerticalScrollStep)
      }
      else {
        this.yOffset = Math.min(this.yl, this.yOffset + this.p.largeVerticalScrollStep)
      }
      this.renderElement()
      this.handleScrollEnd()
    }
  }

  protected renderElement(c = this.element!.parentNode as ProgramElement) {
    const p = this.renderer!.writeArea
    this.renderer!.writeArea = this.element!.getBounds()
    this.renderer!.renderElement(c)
    this.renderer!.writeArea = p
  }

  /** 
   * Gets the current whole scrolled area, optionally recalculating it. TODO: forceCalc.
   */
  getScrollArea(forceCalc: boolean = false): Rectangle {
    return { yi: this.yi, yl: this.yl, xi: this.xi, xl: this.xl }
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

/**
 * Create a new [[Scrollable]].
 */
export function scrollable(props: ScrollableProps & { document: ProgramDocument }) {
  return Flor.render(<Scrollable {...props} />, { document: props.document })
}
