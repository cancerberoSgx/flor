import { LayoutOptions } from '../util'
import { AttrsImpl } from './attrProps'
import { isElement } from './elementUtil'
import { Attrs, BorderProps, Padding, StyleProps } from './types'

export class StylePropsImpl<T extends StyleProps = StyleProps> extends AttrsImpl<Partial<T>> implements Partial<StyleProps> {

  assign(o: Partial<T>) {
    if (typeof o.width !== 'undefined') {
      this.width = o.width
      delete o.width
    }
    if (typeof o.height !== 'undefined') {
      this.height = o.height
      delete o.height
    }
    if (typeof o.top !== 'undefined') {
      this.top = o.top
      delete o.top
    }
    if (typeof o.left !== 'undefined') {
      this.left = o.left
      delete o.left
    }
    if (typeof o.padding !== 'undefined') {
      this.padding = o.padding
      delete o.padding
    }
    if (typeof o.border !== 'undefined') {
      this.border = o.border
      delete o.border
    }
    if (typeof o.layout !== 'undefined') {
      this.layout = o.layout
      delete o.layout
    }
    super.assign(o)
  }

  public get textWrap(): boolean | undefined {
    return this._data.textWrap
  }
  public set textWrap(value: boolean | undefined) {
    this._data.textWrap = value
  }

  public get border() {
    return this._data.border
  }
  public set border(value: Partial<BorderProps>  | undefined) {
    if (!!this._data.border !== !!value) {
      this.owner._boundsDirty = true
      this.owner._positionDirty = true
    }
    this._data.border = value
  }

  public get padding(): Padding | undefined {
    return this._data.padding
  }
  public set padding(value: Padding | undefined) {
    this._data.padding = value
    this.owner._boundsDirty = true
  }

  protected _calculatedWidth: number = 0
  protected calculatedWidth() {
    if (!this._data.width) {
      this._calculatedWidth = 0
    } else if (this.owner._boundsDirty || this._calculatedWidth === 0) {
      if (this._data.width > -1 && this._data.width < 1) {
        this._calculatedWidth = isElement(this.owner.parentNode) && Math.round(this.owner.parentNode.contentWidth * this._data.width) || this._calculatedWidth
      } else {
        this._calculatedWidth = this._data.width || 0
      }
    }
    return this._calculatedWidth
  }
  /**
   * Returns the calculated width in cols, relative to parent's . It always perform the calculation if the value was given as ratio.
   * Use [[getWidth]] to get the original value given by the user.
   */
  public get width(): number {
    return this.calculatedWidth()
  }
  public set width(value: number) {
    if (this._data.width !== value) {
      this.owner._boundsDirty = true
      this._data.width = value
      this.calculatedWidth()
    }
  }
  getWidth() {
    return this._data.width
  }

  protected _calculatedHeight: number = 0
  protected calculatedHeight() {
    if (!this._data.height) {
      this._calculatedHeight = 0
    } else if (this.owner._boundsDirty || this._calculatedHeight === 0) {
      if (this._data.height > -1 && this._data.height < 1) {
        this._calculatedHeight = this.owner.parentElement && Math.round(this.owner.parentElement.contentHeight * this._data.height) || this._calculatedHeight
      } else {
        this._calculatedHeight = this._data.height
      }
    }
    return this._calculatedHeight
  }
  /**
   * Returns the calculated Height in rows declared in this props, relative to parent's . It always perform the calculation if the value was given as ratio.
   * Use [[getHeight]] to get the original value given by the user.
   */
  public get height(): number {
    return this.calculatedHeight()
  }
  public set height(value: number) {
    if (this._data.height !== value) {
      this.owner._boundsDirty = true
      this._data.height = value
      this.calculatedHeight()
    }
  }
  /**
   * Gets the original height value as given by the user.
   */
  getHeight() {
    return this._data.height
  }

  protected _calculatedLeft = 0
  protected calculatedLeft() {
    if (!this._data.left) {
      this._calculatedLeft = 0
    } else if (this.owner._positionDirty || this._calculatedLeft === 0) {
      if (this._data.left > -1 && this._data.left < 1) {
        this._calculatedLeft = this.owner.parentElement && Math.round(this.owner.parentElement.contentWidth * this._data.left) || this._calculatedLeft
      } else {
        this._calculatedLeft = this._data.left || 0
      }
    }
    return this._calculatedLeft
  }
  /**
   * Returns the calculated left coordinate, relative to parent's, given in number of columns as declared in this props.. It always perform the calculation if the value was given as ratio.
   * Use [[getLeft]] to get the original value given by the user.
   */
  get left(): number {
    return this.calculatedLeft()
  }
  set left(value: number) {
    if (this._data.left !== value) {
      this.owner._positionDirty = true
      this._data.left = value
      this.calculatedLeft()
    }
  }
  /**
  * Gets the original left value as given by the user.
  */
  getLeft() {
    return this._data.left
  }

  protected _calculatedTop = 0
  protected calculatedTop() {
    if (!this._data.top) {
      this._calculatedTop = 0
    } else if (this.owner._positionDirty || this._calculatedTop === 0) {
      if (this._data.top > -1 && this._data.top < 1) {
        this._calculatedTop = this.owner.parentElement && Math.round(this.owner.parentElement.contentHeight * this._data.top) || this._calculatedTop
      } else {
        this._calculatedTop = this._data.top || 0
      }
    }

    return this._calculatedTop
  }
  /**
   * Returns the calculated top coordinate, , relative to parent's, given in number of columns as declared in this props.. It always perform the calculation if the value was given as ratio.
   * Use [[getTop]] to get the original value given by the user.
   */
  get top(): number {
    return this.calculatedTop()
  }
  set top(value: number) {
    if (this._data.top !== value) {
      this.owner._positionDirty = true
      this._data.top = value
      this.calculatedTop()
    }
  }
  /**
  * Gets the original top value as given by the user.
  */
  getTop() {
    return this._data.top
  }

  public get layout(): LayoutOptions | undefined {
    return this._data.layout
  }
  public set layout(value: LayoutOptions | undefined) {
    this._data.layout = value
    this.owner._positionDirty = true
    this.owner._boundsDirty = true
  }

  public get noFill(): boolean | undefined {
    return this._data.noFill
  }
  public set noFill(value: boolean | undefined) {
    this._data.noFill = value
  }
}
export type ColorString = string

export type PAttrs = Partial<Attrs>
