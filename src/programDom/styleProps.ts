import { LayoutOptions } from '../util'
import { AttrsImpl } from './attrProps'
import { isElement } from './elementUtil'
import { Attrs, BorderProps, Padding, StyleProps } from './types'

export class StylePropsImpl< T extends StyleProps = StyleProps> extends AttrsImpl<Partial<T>> implements Partial<StyleProps> {

  public get textWrap(): boolean | undefined {
    return this._data.textWrap
  }
  public set textWrap(value: boolean | undefined) {
    this._data.textWrap = value
  }

  public get border() {
    return this._data.border
  }
  public set border(value: Partial<BorderProps> | undefined) {
    this._data.border = value
  }

  public get padding(): Padding | undefined {
    return this._data.padding
  }
  public set padding(value: Padding | undefined) {
    this._data.padding = value
  }

  /**
   * returns the calculated width. in cols. It always perform the calculation if the value was given as ratio.
   */
  public get width(): number {
    if (!this._data.width) {
      return 0
    }
    if (this._data.width > -1 && this._data.width < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentWidth * this._data.width) || this._data.width
    }
    return this._data.width || 0
  }
  public set width(value: number) {
    if (this._data.width !== value) {
      this._data.width = value
    }
  }

  /**
   * returns the calculated Height. in rows. It always perform the calculation if the value was given as ratio.
   */
  public get height(): number {
    if (!this._data.height) {
      return 0
    }
    if (this._data.height > -1 && this._data.height < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentHeight * this._data.height) || this._data.height
    }
    return this._data.height || 0
  }
  public set height(value: number) {
    if (this._data.height !== value) {
      this._data.height = value
    }
  }

  get left(): number {
    if (!this._data.left) {
      return 0
    }
    if (this._data.left > -1 && this._data.left < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentWidth * this._data.left) || this._data.left
    }
    return this._data.left || 0
  }
  set left(value: number) {
    if (this._data.left !== value) {
      this.owner._positionDirty = true
      this._data.left = value
    }
  }

  get top(): number {
    if (!this._data.top) {
      return 0
    }
    if (this._data.top > -1 && this._data.top < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentHeight * this._data.top) || this._data.top
    }
    return this._data.top || 0
  }
  set top(value: number) {
    if (this._data.top !== value) {
      this.owner._positionDirty = true
      this._data.top = value
    }
  }

  // /**
  //  * With [[markDirty===false]] it can be used to change position without marking the elemnt position dirty, which eill cause to recalculate its absolute coords on next getter. By default [[markDirty]] is true.
  //  */
  // setTop(value: number, markDirty= true) {
  //   // if (this._data.top !== value) {
  //   if (markDirty) {
  //       this.owner._positionDirty = true
  //     }
  //   this._data.top = value
  //   // }
  // }
  public get layout(): LayoutOptions | undefined {
    return this._data.layout
  }
  public set layout(value: LayoutOptions | undefined) {
    this._data.layout = value
    this.owner._positionDirty = true
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
