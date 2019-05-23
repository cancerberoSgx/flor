import { array, indent, objectKeys, objectMap } from 'misc-utils-of-mine-generic'
import { BorderProps, Component, createElement, ElementPropsImpl, EventListener, FullProps, isElement, KeyEvent, KeyListener, layoutChildren, LayoutOptions, mouseActionNames, MouseListener, Padding, ProgramDocument, Rectangle } from '..'
import { Element } from '../dom'
import { RenderElementOptions } from '../manager'
import { clicks, ClicksListener } from '../manager/clicks'
import { nextTick } from '../util/misc'
import { rectangleIntersects } from './elementUtil'

export class ProgramElement extends Element {
  // resolvePropValue<K extends keyof ElementProps = keyof ElementProps>(k: K): ElementProps[K] {
  //   return this.props.data[k]||this.parentElement && this.parentElement.resolvePropValue(k)||undefined
  // }
  private static counter = 1

  props: ElementPropsImpl

  /** @internal */
  _renderCounter: number = -1

  private _component?: Component
  protected __boundsDirty: boolean
  protected __positionDirty: boolean

  /**
   * An unique id for this element instance that won't change.
   */
  readonly internalId: number

  constructor(public readonly tagName: string, ownerDocument: ProgramDocument) {
    super(tagName, ownerDocument)
    this._ownerDocument = ownerDocument
    this.internalId = ProgramElement.counter++
    this.props = new ElementPropsImpl(undefined, this as any)
    this.__positionDirty = true
    this.__boundsDirty = true
  }

  /**
   * Called by `Flor.render()` after all children `ProgramElement` are created and appended to this element.
   *
   * @internal
   */
  _childrenReady() {
    if (!this.props.childrenReady || !this.props.childrenReady()) {
      this.doLayout()
    }
  }

  /**
   * Runs the layout algorithm possibly changing children and self position and dimension.
   *
   * @internal
   */
  doLayout() {
    if (this.layout
      // && (
      // !this.layout.manualLayout ||
      // !this._layoutOnce
      // )
      && (this._positionDirty || this._boundsDirty)
    ) {
      layoutChildren({
        el: this, ...this.layout
      })
      // this._layoutOnce = trCue
    }
  }
  // private _layoutOnce = false

  public forceUpdate(descendants = false) {
    // this._layoutOnce = false
    this._positionDirty = true
    this._boundsDirty = true
    this.updateBounds(descendants)
  }

  protected _renderedOnce = false
  /**
   * Called by the rendered just after the element all all its children were rendered to the screen
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   * @internal
   */
  _afterRender() {
    this.props.afterRender && this.props.afterRender(this)
    if (!this._renderedOnce) {
      this._renderedOnce = true
      this.props.onceRendered && this.props.onceRendered(this)
    }
  }

  /**
   * Called by the renderer just after rendering this element. It's children were not yet rendered and will be
   * next.
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   * @internal
   */
  _afterRenderWithoutChildren() {
    this.props.afterRenderWithoutChildren && this.props.afterRenderWithoutChildren()
  }

  /**
   * Called by the renderer just before rendering this element. It's children will follow.
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   * @internal
   */
  _beforeRender() {
    if (!this.props.beforeRender || !this.props.beforeRender()) {
      if (this._positionDirty || this._boundsDirty) {
        this.updateBounds()
      }
    }
  }

  /**
   * Will calculate again position related properties such as [[absoluteTop]] and [[absoluteLeft]] and if
   * `descendant` argument is passed also recursively for all descendants.
   *
   * on render() , descendants doesn't need to be calculated since they are rendered after the parent and
   * updateBounds will be called for them individually
   */
  protected updateBounds(descendants?: boolean, force?: boolean) {
    if (force) {
      // this._layoutOnce = false
      this._positionDirty = true
      this._boundsDirty = true
    }
    if (this._positionDirty || this._boundsDirty) {
      this.doLayout()
      this._useExpression(this.absoluteBottom + this.absoluteRight)
      this._positionDirty = false
      this._boundsDirty = false
    }
    if (descendants) {
      this.getChildrenElements().forEach(e => {
        e.updateBounds(descendants, force)
      })
    }
  }

  private _useExpression(a: any) {

  }

  get parentNode(): ProgramElement | ProgramDocument {
    return this._parentNode as any
  }

  get parentElement(): ProgramElement | undefined {
    return isElement(this._parentNode) ? this._parentNode : undefined
  }

  private _absoluteLeft = 0
  get absoluteLeft() {
    if (this._positionDirty) {
      let x = this.left
      let n: ProgramElement | ProgramDocument = this
      while (n.parentNode !== n.ownerDocument) {
        x = x + (n.parentNode as ProgramElement).left + ((n.parentNode as ProgramElement).padding && (n.parentNode as ProgramElement).padding!.left || 0) + ((n.parentNode as ProgramElement).border ? 1 : 0)
        n = n.parentNode
      }
      this._absoluteLeft = x
    }
    return this._absoluteLeft
  }

  get absoluteRight() {
    return this.absoluteLeft + this.width
  }

  private _absoluteTop = 0
  get absoluteTop() {
    if (this._positionDirty) {
      let y = this.top
      let n: ProgramElement | ProgramDocument = this
      while (n.parentNode && n.parentNode !== n.ownerDocument) {
        y = y + (n.parentNode as ProgramElement).top + ((n.parentNode as ProgramElement).padding && (n.parentNode as ProgramElement).padding!.top || 0) + ((n.parentNode as ProgramElement).border ? 1 : 0)
        n = n.parentNode
      }
      this._absoluteTop = y
    }
    return this._absoluteTop
  }

  get absoluteBottom() {
    return this.absoluteTop + this.height
  }

  /**
   * Left coordinate, calculated in columns, relative to parent's content bounds.
   */
  get left() {
    return this.props.left
  }
  /**
   * Left coordinate, calculated in columns, relative to parent's content bounds.
   */
  set left(value: number) {
    this.props.left = value
  }

  /**
   * Top coordinate, calculated in rows, relative to parent's content bounds.
   */
  get top() {
    return this.props.top
  }
  /**
   * Top coordinate, calculated in rows, relative to parent's content bounds.
   */
  set top(value: number) {
    this.props.top = value
  }

  public get padding(): Padding | undefined {
    return this.props.padding
  }
  public set padding(value: Padding | undefined) {
    this.props.padding = value
  }

  public get border(): Partial<BorderProps> | undefined {
    return this.props.border
  }
  public set border(value: Partial<BorderProps> | undefined) {
    this.props.border = value
  }

  public get layout(): LayoutOptions | undefined {
    return this.props.layout
  }
  public set layout(value: LayoutOptions | undefined) {
    this.props.layout = value
  }

  get width() {
    return this.props.width
  }
  set width(value: number) {
    this.props.width = value
  }

  get height() {
    return this.props.height
  }
  set height(value: number) {
    this.props.height = value
  }

  get absoluteContentTop() {
    return this.absoluteTop + (this.border ? 1 : 0) + (this.padding ? this.padding.top : 0)
  }

  get absoluteContentLeft() {
    return this.absoluteLeft + (this.border ? 1 : 0) + (this.padding ? this.padding.left : 0)
  }

  get contentHeight() {
    return this.height - (this.border ? 2 : 0) - (this.padding ? (this.padding.top + this.padding.bottom) : 0)
  }
  set contentHeight(value: number) {
    this.height = value + (this.border ? 2 : 0) + (this.padding ? (this.padding.top + this.padding.bottom) : 0)
  }

  get contentWidth() {
    return this.width - (this.border ? 2 : 0) - (this.padding ? (this.padding.left + this.padding.right) : 0)
  }
  set contentWidth(value: number) {
    this.width = value + (this.border ? 2 : 0) + (this.padding ? (this.padding.left + this.padding.right) : 0)
  }

  get absoluteInnerTop() {
    return this.absoluteTop + (this.border ? 1 : 0)
  }

  get absoluteInnerLeft() {
    return this.absoluteLeft + (this.border ? 1 : 0)
  }

  get innerHeight() {
    return this.height - (this.border ? 1 : 0)
  }

  get innerWidth() {
    return this.width - (this.border ? 1 : 0)
  }

  /** @internal */
  get _positionDirty() {
    return this.__positionDirty
  }
  /** @internal */
  set _positionDirty(d: boolean) {
    if (d !== this.__positionDirty) {
      this.__positionDirty = d
      if (d) {
        this.getChildrenElements().forEach(e => {
          e._positionDirty = true
        })
      }
    }
  }

  /** @internal */
  get _boundsDirty() {
    return this.__boundsDirty
  }
  /** @internal */
  set _boundsDirty(d: boolean) {
    if (d !== this.__boundsDirty) {
      this.__boundsDirty = d
      if (d) {
        this.getChildrenElements().forEach(e => {
          e._positionDirty = true
          e._boundsDirty = true
        })
      }
    }
  }

  getBounds(relative = false): Rectangle {
    if (!relative) {
      return {
        yi: this.absoluteTop,
        xi: this.absoluteLeft,
        yl: this.absoluteTop + this.height,
        xl: this.absoluteLeft + this.width
      }
    } else {
      throw new Error('Not implemented')
    }
  }

  getContentBounds(relative = false): Rectangle {
    if (!relative) {
      return {
        yi: this.absoluteContentTop,
        xi: this.absoluteContentLeft,
        yl: this.absoluteContentTop + this.contentHeight,
        xl: this._absoluteLeft + this.contentWidth
      }
    } else {
      throw new Error('Not implemented')
    }
  }

  /**
   * Similar to [[getContentBounds]] but without consider padding.
   */
  getInnerBounds(relative = false): Rectangle {
    if (!relative) {
      return {
        yi: this.absoluteInnerTop,
        xi: this.absoluteInnerLeft,
        yl: this.absoluteInnerTop + this.innerHeight,
        xl: this._absoluteLeft + this.innerWidth
      }
    } else {
      throw new Error('TODO')
    }
  }

  intersects(r: Rectangle, options: { relative?: boolean, regionKind?: 'outer' | 'inner' | 'content' } = { relative: false }) {
    let cr: Rectangle
    if (!options.relative) {
      if (options.regionKind === 'inner') {
        cr = this.getInnerBounds()
      } else if (options.regionKind === 'content') {
        cr = this.getContentBounds()
      } else {
        cr = this.getBounds()
      }
    } else {
      throw new Error('Not implemented')
    }
    return rectangleIntersects(cr, r)
  }

  /**
   * Creates a new element and appends it to this element.
   */
  create(props: Partial<FullProps>) {
    if (!this.ownerDocument) {
      throw new Error('Cannot invoke this method on an unattached element')
    }
    return createElement(this.ownerDocument, { ...props, parent: this })
  }

  /**
   * @internal
   */
  _addEventListener(name: string, listener: EventListener): void {
    if (name === 'onFocus') {
      this.ownerDocument._registerListener({ type: 'focus', listener: { els: [this], listener } })
    } else if (name === 'onBlur') {
      this.ownerDocument._registerListener({ type: 'blur', listener: { els: [this], listener } })
    } else if (name === 'onClicks') {
      this.ownerDocument._registerListener({ type: 'clicks', listener: { el: this, listener } })
    } else {
      this.ownerDocument._registerListener({ type: 'event', listener: { el: this, name: _getEventName(name), listener } })
    }
    function _getEventName(name: string): string {
      if (['onclick', 'click'].includes(name.toLowerCase())) {
        return 'mouseup'
      }
      if (['keypress', 'keypressed', 'onkeypressed'].includes(name.toLowerCase())) {
        return 'keypress'
      }
      if (name.startsWith('on')) {
        const n = name.substring(2)
        if (mouseActionNames.includes(n)) {
          return n
        }
      }
      return name.toLowerCase()
    }
  }

  /**
   * Gets the component instance associated with this element, if any.
   */
  getComponent<T extends Component = Component>() {
    return this._component as T | undefined
  }

  get ownerDocument(): ProgramDocument {
    return this._ownerDocument as ProgramDocument
  }

  /**
   * If the owner document has a renderer available it request to render this element on the screen.
   */
  render(options?: RenderElementOptions) {
    this.ownerDocument.renderer && this.ownerDocument.renderer.renderElement(this, options)
  }

  /**
   * If the owner document has a renderer available it request to erase this element from the screen.
   */
  erase() {
    this.ownerDocument.renderer && this.ownerDocument.renderer.eraseElement(this)
  }

  /**
   * Gets only childNodes that are elements.
   */
  getChildrenElements() {
    return (this.childNodes).filter(isElement)
  }

  debugAsJson(): DebugJsonNode {
    return { ...this.props.data, children: (this.childNodes).map(e => isElement(e) ? e.debugAsJson() : 'Text(' + e.textContent + ')') }
  }

  /**
   * Returns a XML like string representation of this element instance.
   */
  debugAsXml(o: DebugOptions = { level: 0 }): string {
    const noF = objectMap(this.props.data, (k, v) => typeof v === 'function' ? v.toString() : v)
    return `${indent(o.level)}<${this.tagName} ${
      objectKeys({ ...noF })
        .map(p => `${p}=${JSON.stringify(noF[p])}`)
        .join(' ')} ${
      this.textContent ? `textContent="${this.textContent}"` : ''}>\n${indent(o.level + 1)}${
      this.childNodes
        .map(e => isElement(e) ? e.debugAsXml({ ...o, level: (o.level) + 1 }) : `${indent(o.level)}Text(${e.textContent})`)
        .join(`\n${indent(o.level + 1)}`)}\n${
      indent(o.level)}</${this.tagName}>\n`
  }

  addKeyListener(l: KeyListener, name = 'keypress') {
    this.ownerDocument.managersReady.then(({ events }) => events.addKeyListener(l, this, name))
  }

  removeKeyListener(l: KeyListener, name: string) {
    this.ownerDocument.managersReady.then(({ events }) => events.removeKeyListener(l, this, name))
  }

  addMouseListener(l: MouseListener | ClicksListener, name = 'click') {
    if (name === 'clicks') {
      clicks({ target: this, handler: l })
    } else {
      this.ownerDocument.managersReady.then(({ events }) => events.addMouseListener(l as MouseListener, this, name))
    }
  }

  removeMouseListener(l: MouseListener | ClicksListener, name: string) {
    if (name === 'clicks') {
      clicks({ target: this, handler: l, remove: true })
    } else {
      this.ownerDocument.managersReady.then(({ events }) => events.removeMouseListener(l as MouseListener, this, name))
    }
  }

  /**
   * Makes the element to loose focus (if focused) and optionally makes [[focused]] to gain focus.
   */
  blur(focused?: ProgramElement) {
    this.ownerDocument.focus && this.ownerDocument.focus.blur(this, focused)
  }

  /**
   * Triggers a click event on this element.
   */
  click() {
    this.ownerDocument.events && this.ownerDocument.events.click(this)
  }

  /**
   * Triggers a key event on this element.
   */
  key(e: string | Partial<KeyEvent>, count = 1) {
    array(count).forEach(() => {
      this.ownerDocument.events && this.ownerDocument.events.triggerKeyEvent(typeof e === 'string' ? e : undefined, typeof e === 'string' ? { name: e } : e)
    })
  }

  enterText(s: string) {
    return new Promise(resolve => {
      s.split('').forEach(i => nextTick(() => this.key(i)))
      setTimeout(resolve, 100)
    })
  }

  /**
   * Focus this element.
   */
  focus() {
    if (this.ownerDocument.focus) {
      this.ownerDocument.focus.focused = this
    }
  }

  get visible(){
    return !this.findAscendant(a=>isElement(a)&&!a.props.visible, {andSelf: true})
  }

}

interface DebugJsonNode { [s: string]: any, children: (DebugJsonNode | string)[] }

interface DebugOptions {
  level: number
}
