import { indent } from 'misc-utils-of-mine-generic'
import { mouseActionNames } from '../declarations/program'
import { Element } from '../dom'
import { EventListener } from '../dom/event'
import { Component } from '../jsx'
import { layoutChildren } from '../util'
import { createElement } from '../util/util'
import { ElementPropsImpl } from './elementProps'
import { isElement } from './elementUtil'
import { ProgramDocument } from './programDocument'
import { FullProps } from './types'

export class ProgramElement extends Element {

  private static counter = 1

  props: ElementPropsImpl

  /** @internal */
  _renderCounter: number = -1

  private _component?: Component

  constructor(public readonly tagName: string, ownerDocument: ProgramDocument) {
    super(tagName, ownerDocument)
    this._ownerDocument = ownerDocument
    this.internalId = ProgramElement.counter++
    this.props = new ElementPropsImpl({}, this)
    this.__positionDirty = true
  }

  /** A unique id for this element instance that won't change. */
  readonly internalId: number

  /**
   * Called by `Flor.render()` after all children `ProgramElement` are created and appended to this element.
   *
   * @internal
   */
  _childrenReady() {
    if (!this.props.childrenReady || !this.props.childrenReady()) {
      this.layout()
    }
  }

  /**
   * Runs the layout algorithm possibly changing children and self position and dimension.
   *
   * @internal
   */
  protected layout() {
    if (this.props.layout && this._positionDirty) {
      layoutChildren({
        el: this, ...this.props.layout
      })
    }
  }

  /**
   * Called by the rendered just after the element all all its children were rendered to the screen
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   * @internal
   */
  _afterRender(): any {
    this.props.afterRender && this.props.afterRender()
  }

  /**
   * Called by the renderer just after rendering this element. It's children were not yet rendered and will be next.
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   * @internal
   */
  _afterRenderWithoutChildren(): any {
    this.props.afterRenderWithoutChildren && this.props.afterRenderWithoutChildren()
  }

  /**
   * Called by the renderer just before rendering this element. It's children will follow.
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   * @internal
   */
  _beforeRender(): any {
    if (!this.props.beforeRender || !this.props.beforeRender()) {
      if (this._positionDirty) {
        this.update(true)
      }
    }
  }

  get parentNode(): ProgramElement | ProgramDocument {
    return this._parentNode as any
  }

  private _absoluteLeft = 0
  get absoluteLeft() {
    if (this._positionDirty) {
      let x = this.props.left
      let n: ProgramElement | ProgramDocument = this
      while (n.parentNode !== n.ownerDocument) {
        x = x + (n.parentNode as ProgramElement).props.left + ((n.parentNode as ProgramElement).props.padding && (n.parentNode as ProgramElement).props.padding!.left || 0) + ((n.parentNode as ProgramElement).props.border ? 1 : 0)
        n = n.parentNode
      }
      this._absoluteLeft = x
    }
    return this._absoluteLeft
  }

  private _absoluteTop = 0
  get absoluteTop() {
    if (this._positionDirty) {
      let y = this.props.top
      let n: ProgramElement | ProgramDocument = this
      while (n.parentNode && n.parentNode !== n.ownerDocument) {
        y = y + (n.parentNode as ProgramElement).props.top + ((n.parentNode as ProgramElement).props.padding && (n.parentNode as ProgramElement).props.padding!.top || 0) + ((n.parentNode as ProgramElement).props.border ? 1 : 0)
        n = n.parentNode
      }
      this._absoluteTop = y
    }
    return this._absoluteTop
  }

  get absoluteContentTop() {
    return this.absoluteTop + (this.props.border ? 1 : 0) + (this.props.padding ? this.props.padding.top  : 0)
  }

  get absoluteContentLeft() {
    return this.absoluteLeft + (this.props.border ? 1 : 0) + (this.props.padding ? this.props.padding.left  : 0)
  }

  get contentHeight() {
    return this.props.height - (this.props.border ? 1 : 0) - (this.props.padding ? (this.props.padding.top + this.props.padding.bottom) : 0)
  }

  get contentWidth() {
    return this.props.width - (this.props.border ? 1 : 0) - (this.props.padding ? (this.props.padding.left + this.props.padding.right) : 0)
  }

  protected __positionDirty: boolean
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

  /**
   * Will calculate again position related properties such as [[absoluteTop]] and [[absoluteLeft]] and if `descendant` argument is passed also recursively for all descendants.
   */
  protected update(descendants?: boolean) {
    if (this._positionDirty) {
      let a = this.absoluteLeft - this.absoluteTop
      this.layout()
      this._positionDirty = false
    }
    if (descendants) {
      this.getChildrenElements().forEach(e => {
        e.update(true)
      })
    }
  }

  /**
   * creates a new element and appends it to this element.
   */
  create(props: Partial<FullProps>) {
    if (!this.ownerDocument) {
      throw new Error('Cannot invoke this method on an unattached element')
    }
    return createElement(this.ownerDocument, { ...props, parent: this })
  }

  /** @internal */
  _addEventListener(name: string, listener: EventListener): void {
    if (ProgramDocument.is(this.ownerDocument)) {
      if (name === 'onFocus') {
        this.ownerDocument._registerListener({ type: 'focus', listener: { els: [this], listener } })
      } else if (name === 'onBlur') {
        this.ownerDocument._registerListener({ type: 'blur', listener: { els: [this], listener } })
      } else {
        this.ownerDocument._registerListener({ type: 'event', listener: { el: this, name: this._getEventName(name), listener } })
      }
    }
  }
  private _getEventName(name: string): string {
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

  /**
   * Gets the component instance associated with this element, if any.
   */
  getComponent<T extends Component = Component>() {
    return this._component as T | undefined
  }

  protected _ownerDocument: ProgramDocument
  get ownerDocument() {
    return this._ownerDocument
  }

  /**
   * Gets only childNodes that are elements.
   */
  getChildrenElements() {
    return Array.from(this.childNodes).filter(isElement)
  }

  /**
   * Returns a XML like string representation of this element instance.
   */
  debug(o: DebugOptions = { level: 0 }): string {
    return `${indent(o.level)}<${this.tagName} ${
      Object.keys({ ...this.props, ...this.props.data })
        .filter(f => f !== '_data').map(p => `${p}=${
          JSON.stringify(({ ...this.props, owner: undefined } as any)[p] || (this.props.data as any)[p] || '')}`).join(' ')} textContent="${this.textContent}">\n${indent(o.level + 1)}${
      Array.from(this.childNodes)
        .map(e => isElement(e) ? e.debug({ ...o, level: (o.level) + 1 }) : `${indent(o.level)}Text(${e.textContent})`).join('')}\n${indent(o.level)}<${this.tagName}>\n`
  }

}

interface DebugOptions {
  level: number
}
