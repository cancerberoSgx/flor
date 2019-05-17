import { asArray, throttle } from 'misc-utils-of-mine-generic'
import { animate, easing } from '..'
import { Node } from '../dom'
import { Component, Flor } from '../jsx'
import { KeyEvent, KeyPredicate, MouseEvent, ProgramDocumentRenderer } from '../manager'
import { ElementProps, isElement, ProgramDocument, ProgramElement, Rectangle, rectangleIntersects, rectanglePlusOffsets } from '..'
import { Animation } from '../util'
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

export interface ScrollHandlerProps {

  /**
   * Number of rows to advance / retrocede on a normal vertical  scroll.
   */
  normalVerticalStep?: number
  /**
   * Number of cols to advance / retrocede on a normal horizontal scroll.
   */
  normalHorizontalStep?: number
  /**
  * Keys that activate normal scroll up. Default: `[e => e.ctrl === false && e.name === 'up']`.
  */
  normalScrollUpKeys?: KeyPredicate[]
  /**
   * Keys that activate normal scroll down. Default: `[e => e.ctrl === false && e.name === 'down']`.
   */
  normalScrollDownKeys?: KeyPredicate[]
  /**
   * Keys that activate normal scroll up. Default: `[e => e.ctrl === false && e.name === 'left']`.
   */
  normalScrollLeftKeys?: KeyPredicate[]
  /**
   * Keys that activate normal scroll up. Default: `[e => e.ctrl === false && e.name === 'right']`.
   */
  normalScrollRightKeys?: KeyPredicate[]

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
   * By default, mouse wheel will scroll vertical (or horizontal if used with control key). If
   * [[disableMouseWheel]] is false then this behavior will be disabled.
   */
  disableMouseWheel?: boolean
}
interface ConcreteScrollableProps extends ScrollHandlerProps {
  /**
   * Listener notified when a scroll event happens.
   */
  onScroll?: (e: ScrollEvent) => void

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
   * Extra cols as scrolled area right padding. By default 5.
   */
  rightExtraOffset?: number
  /**
   * What to do when user activates while the widget is still in an animation. By default `true`.
   */
  interruptAnimation?: boolean
  verticalGotoEndKeys?: string[]
  verticalGotoStartKeys?: string[]
  horizontalGotoEndKeys?: string[]
  horizontalGotoStartKeys?: string[]

  /**
   * If true, the scrollable won't listen to any mouse or key events. Also it won't be focusable.
   *
   * Instead it needs to be programmatically managed by an external actor. This is useful in cases where its
   * children are highly interactive and need to receive keyboard events themselves that might collapse with
   * scrollable keys. Example, a text area with scroll, the textarea itself is responsible of calling
   * [[scroll]] methods when is needed.
   */
  managed?: boolean
}

export interface ScrollableProps extends ConcreteScrollableProps, Partial<ElementProps> {

}

export const defaultScrollHandleProps: () => Required<ScrollHandlerProps> = () => ({
  largeVerticalScrollStep: 40,
  largeScrollUpKeys: [e => e.ctrl && e.name === 'w'],
  largeScrollDownKeys: [e => e.ctrl && e.name === 's'],
  normalScrollUpKeys: [e => !e.ctrl && e.name === 'up' || !e.ctrl && e.name === 'w'],
  normalScrollDownKeys: [e => !e.ctrl && e.name === 'down' || !e.ctrl && e.name === 's'],
  normalScrollLeftKeys: [e => !e.ctrl && e.name === 'left' || !e.ctrl && e.name === 'a'],
  normalScrollRightKeys: [e => !e.ctrl && e.name === 'right' || !e.ctrl && e.name === 'd'],
  normalVerticalStep: 2,
  normalHorizontalStep: 1,
  disableMouseWheel: false
})

export const defaultScrollableProps: () => Required<ConcreteScrollableProps> = () => ({
  ...defaultScrollHandleProps(),
  interruptAnimation: true,
  leftExtraOffset: 0,
  rightExtraOffset: 3,
  topExtraOffset: 0,
  bottomExtraOffset: 3,
  throttleVertical: 0,
  largeScrollAnimation: easing.bounceEasyOut(),
  verticalAnimationDuration: 1000,
  onScroll(e) { },
  verticalGotoEndKeys: [''],
  verticalGotoStartKeys: [''],
  horizontalGotoEndKeys: [''],
  horizontalGotoStartKeys: [''],
  managed: false
})

/**
 * Scrollable box to  add vertical and/or horizontal scroll support for its children. Supports:
 *  * keyboard and mouse events with configurable keys
 *  * different size scroll actions like normal, large, and going to the end/beginning.
 *  * animations for large scroll
 *
 * TODO resolve focus:
 *   * Doesn't work with self padding
 *   * how inner elemets get foused ?
 *   * how the scrollable gets focus again ?
 *   * descendants need to receive  key and mouse events
 *
 * TODO (partially solves above problems): managed
 *   * if props.managed===true then the scrollable dont listen to any event and gets managed by another actor
 *     that
 */
export class Scrollable extends Component<ScrollableProps, {}> {
  protected yOffset: number
  protected xOffset: number
  protected yi: number = +Infinity
  protected yl: number = -Infinity
  protected xi: number = +Infinity
  protected xl: number = -Infinity

  /**
   * Children currently "inside" the viewport, The "inside" predicate is implemented in method
   * [[elementInViewportPredicate]] and currently are those children that intersects the viewport area.
   */
  protected vChildren: Node[] = []
  protected scrolling: boolean = false

  protected p: Required<ConcreteScrollableProps>

  constructor(p: ScrollableProps, s: {}) {
    super(p, s)
    this.p = { ...defaultScrollableProps(), ...p }
    this.onKeyPressed = this.onKeyPressed.bind(this)
    this.onWheelDown = this.onWheelDown.bind(this)
    this.onWheelUp = this.onWheelUp.bind(this)
    this.renderChildren = this.renderChildren.bind(this)
    this.yOffset = 0 - this.p.topExtraOffset
    this._renderChildren = this._renderChildren.bind(this)
    this.xOffset = 0 - this.p.leftExtraOffset
    this.handleScrollEnd = this.handleScrollEnd.bind(this)
    // this.onKeyPressed = this.onKeyPressed.bind(this)
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
    this.calcScrollArea()
    this.vChildren.forEach(c => {
      if (isElement(c)) {
        const y = c.absoluteTop - this.element!.absoluteTop - this.yOffset
        const x = c.absoluteLeft - this.element!.absoluteLeft - this.xOffset
        const top = c.props.top
        const left = c.props.left
        c.props.top = y // we need to make position dirty
        c.props.left = x
        this.renderElement(c) // and call render so it gets updated but on the children, if calling on this.element will get infinite recursion
        c.props.top = top
        c.props.left = left
      }
    })
  }

  private _calcScrollAreaRun = false

  /**
   * Iterate children to get: 1) the current children in the current viewport. The predicate to if child is or
   * not inside is [[elementInViewportPredicate]]. 2) . The while Rect area being scrolled [[yi]], [[yl]],
   * [[xi]], [[xl]]. Heads up, this function is called on each render.
   */
  protected calcScrollArea() {
    let first: ProgramElement | undefined
    let last: ProgramElement | undefined
    const viewportArea = this.getViewportArea()
    this.vChildren = Array.from(this.element!.childNodes).filter((c, i, a) => {
      if (last && this._calcScrollAreaRun) {
        return false
      }
      let r
      if (isElement(c)) {
        if (!this._calcScrollAreaRun) {
          c.forceUpdate()
          const cyi = c.absoluteTop - this.element!.absoluteTop - this.p.topExtraOffset
          if (this.yi > cyi) {
            this.yi = cyi
          }
          const cyl = c.absoluteTop - this.element!.absoluteTop - this.element!.props.height + c.props.height + this.p.bottomExtraOffset
          if (this.yl < cyl) {
            this.yl = cyl
          }
          const cxi = c.absoluteLeft - this.element!.absoluteLeft - this.p.leftExtraOffset
          if (this.xi > cxi) {
            this.xi = cxi
          }
          const cxl = c.absoluteLeft - this.element!.absoluteLeft - this.element!.props.width + c.props.width + this.p.rightExtraOffset
          if (this.xl < cxl) {
            this.xl = cxl
          }
        }
        const r = rectangleIntersects(c.getBounds(), viewportArea)
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
    this._calcScrollAreaRun = true
  }

  /**
   * Overridden by animate implementation. Don't call.
   */
  private _stopAnimation: () => void = () => {
  }

  protected handleScrollEnd() {
    this.scrolling = false
    this._stopAnimation()
    if (this.props.onScroll) {
      this.props.onScroll({ currentTarget: this.element!, xOffset: this.xOffset, yOffset: this.yOffset })
    }
  }

  protected onKeyPressed<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): boolean | void {
    if (!this.element!.props.focused) {
    } else if (this.scrolling) {
      if (this.p.interruptAnimation) {
        this.handleScrollEnd()
        nextTick(() => this.onKeyPressed(e))
      } else {
        this.renderer!.program.bell()
        this.handleScrollEnd()
      }
    } else if (this.p.normalScrollUpKeys.find(p => p(e))) {
      this.handleNormalVerticalScroll(-1)
    } else if (this.p.normalScrollDownKeys.find(p => p(e))) {
      this.handleNormalVerticalScroll(1)
    } else if (this.p.normalScrollRightKeys.find(p => p(e))) {
      this.handleNormalHorizontalScroll(1)
    } else if (this.p.normalScrollLeftKeys.find(p => p(e))) {
      this.handleNormalHorizontalScroll(-1)
    } else if (this.p.largeScrollUpKeys.find(p => p(e))) {
      this.handleLargeVerticalScroll(-1)
    } else if (this.p.largeScrollDownKeys.find(p => p(e))) {
      this.handleLargeVerticalScroll(1)
    }
    this.props.onKeyPressed && this.props.onKeyPressed(e)
  }

  protected handleNormalHorizontalScroll(direction: 1 | -1) {
    if (direction === 1) {
      this.xOffset = Math.min(this.xl, this.xOffset + this.p.normalHorizontalStep)
    } else {
      this.xOffset = Math.max(this.xi, this.xOffset - this.p.normalHorizontalStep)
    }
    this.renderElement()
    this.handleScrollEnd()
  }

  protected handleNormalVerticalScroll(direction: 1 | -1) {
    if (direction === 1) {
      this.yOffset = Math.min(this.yl, this.yOffset + this.p.normalVerticalStep)
    } else {
      this.yOffset = Math.max(this.yi, this.yOffset - this.p.normalVerticalStep)
    }
    this.renderElement()
    this.handleScrollEnd()
  }

  protected onWheelUp<T extends ProgramElement = ProgramElement>(e: MouseEvent<T>) {
    if (!e.ctrl) {
      this.handleNormalVerticalScroll(-1)
    } else {
      this.handleNormalHorizontalScroll(-1)
    }
    this.props.onWheelUp && this.props.onWheelUp(e)
  }

  protected onWheelDown<T extends ProgramElement = ProgramElement>(e: MouseEvent<T>) {
    if (!e.ctrl) {
      this.handleNormalVerticalScroll(1)
    } else {
      this.handleNormalHorizontalScroll(1)
    }
    this.props.onWheelDown && this.props.onWheelDown(e)
  }

  protected handleLargeVerticalScroll(direction: 1 | -1) {
    this.scrolling = true
    if (this.props.largeScrollAnimation) {
      const start = this.yOffset
      animate({
        duration: this.p.verticalAnimationDuration,
        draw: t => {
          const final = Math.round(Math.max(this.yi, start + this.p.largeVerticalScrollStep * t * direction))
          if (this.yOffset !== final) {
            this.yOffset = Math.max(this.yi, final)
            this.renderElement()
          }
        },
        timing: this.p.largeScrollAnimation,
        onEnd: () => {
          this.handleScrollEnd()
        },
        onStop: (l => this._stopAnimation = l)
      })
    } else {
      if (direction < 0) {
        this.yOffset = Math.max(this.yi, this.yOffset - this.p.largeVerticalScrollStep)
      } else {
        this.yOffset = Math.min(this.yl, this.yOffset + this.p.largeVerticalScrollStep)
      }
      this.renderElement()
      this.handleScrollEnd()
    }
  }

  protected renderElement(c = this.element!.parentNode as ProgramElement) {
    const p = this.renderer!.writeArea
    this.renderer!.writeArea = this.element!.getContentBounds()
    this.renderer!.renderElement(c)
    this.renderer!.writeArea = p
  }

  /**
   * Gets the current whole scrolled area, optionally recalculating it. TODO: forceCalc.
   */
  getScrollArea(forceCalc: boolean = false): Rectangle {
    return {
      yi: this.yi,
      yl: this.yl,
      xi: this.xi,
      xl: this.xl
    }
  }

  /**
   * Bounds of current viewport in absolute coordinates.
   */
  getViewportArea() {
    return rectanglePlusOffsets(this.element!.getBounds(), this.xOffset, this.yOffset)
  }

  /**
   * Sets the [[xOffset]] and [[yOffset]] offsets of this scrollable programmatically. Offset i measure in
   * columns and rows and independent on steps. It will respect [[xi]], [[xl]], [[yi]], [[yi]] limits. If
   * [[x]] or [[y]] are not given it won't scroll on that direction. Use negative values to subtract offset
   * (scroll left or scroll top.). If the scroll amount is greater than [[largeVerticalScrollStep]] then
   * animation will be used if any.
   */
  scroll(offset: { x?: number, y?: number }) {
    this.xOffset = offset.x || this.xOffset
    this.yOffset = offset.y || this.yOffset
  }
  /**
   * Similar to [[scroll]] but accepts offset ratios (percentages), that are numbers between 0 and 1. No
   * negative values accepted. If the scroll amount is greater than [[largeVerticalScrollStep]] then animation
   * will be used if any.
   */
  scrollRatio(offsetRatio: { x?: number, y?: number }) {
    throw new Error('not implemented')
  }

  render() {
    const layout = this.props.layout ? { ...this.props.layout, neverResizeContainer: true } : undefined
    return <el focusable={true}
      {...{ ...this.props, onScroll: undefined, children: undefined }}
      layout={layout}
      onKeyPressed={this.onKeyPressed}
      onWheelUp={this.props.disableMouseWheel ? this.props.onWheelUp : this.onWheelUp}
      onWheelDown={this.props.disableMouseWheel ? this.props.onWheelDown : this.onWheelDown}
      renderChildren={this.renderChildren}
      overflow="hidden"
      preventChildrenCascade={true}
    >
      {...Array.isArray(this.props.children) ? this.props.children : asArray(this.props.children)}
    </el>
  }
}

/**
 * Create a new [[Scrollable]].
 */
export function scrollable(props: ScrollableProps & { document: ProgramDocument }) {
  return Flor.render(<Scrollable {...props} />, { document: props.document })
}
