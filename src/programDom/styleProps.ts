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
    if (!!this._data.border !== !!value) {
      this.owner._boundsDirty = true
    }
    this._data.border = value
  }

  public get padding(): Padding | undefined {
    return this._data.padding
  }
  public set padding(value: Padding | undefined) {
    this.owner._boundsDirty = true
    this._data.padding = value
  }

  protected _calculatedWidth: number = 0
  /**
   * Returns the calculated width in cols. It always perform the calculation if the value was given as ratio. 
   * Use [[getWidth]] to get the original value given by the user. 
   */
  public get width(): number {
   return this.calculatedWidth()
  }
  public set width(value: number) {
    this.calculatedWidth();
    if (this._data.width !== value) {
      this.owner._boundsDirty = true
      this._data.width = value
    }
  }
  protected calculatedWidth() {
    if (this._data.width && this._data.width > -1 && this._data.width < 1) {
      if(this.owner._boundsDirty || this._calculatedWidth===0) {
        this._calculatedWidth = isElement(this.owner.parentNode) && Math.round(this.owner.parentNode.contentWidth * this._data.width) || 0//this._data.width;
      }
    } else if(  this._data.width) {
      this._calculatedWidth =    this._data.width
    }
    return this._calculatedWidth
  }
  getWidth(){
    return this._data.width
  }

  protected _calculatedHeight: number = 0
  protected calculatedHeight() {
    if(this._data.height && this._data.height > -1 && this._data.height < 1){
      if(this.owner._boundsDirty || this._calculatedHeight===0){
        this._calculatedHeight =  isElement(this.owner.parentNode) && Math.round(this.owner.parentNode.contentHeight * this._data.height) || 0//this._data.height
      }
    }
    else if(  this._data.height) {
      this._calculatedHeight =    this._data.height
    }
    return this._calculatedHeight
  }
  /**
   * Returns the calculated Height in rows declared in this props. It always perform the calculation if the value was given as ratio.
   * Use [[getHeight]] to get the original value given by the user. 
   */
  public get height(): number {   
    return this.calculatedHeight()
  }
  public set height(value: number) {
    this.calculatedHeight()
    if (this._data.height !== value) {
     
      this.owner._boundsDirty = true
      this._data.height = value
    }
  }
  /**
   * Gets the original height value as given by the user. 
   */
  getHeight(){
    return this._data.height
  }

  /**
   * Returns the calculated left coordinate, as absolute number of columns declared in this props.. It always perform the calculation if the value was given as ratio.
   * Use [[getLeft]] to get the original value given by the user. 
   */
  get left(): number {
    if (!this._data.left) {
      return 0
    }
    if (this._data.left > -1 && this._data.left < 1) {
      return isElement(this.owner.parentNode) && Math.round(this.owner.parentNode.contentWidth * this._data.left) || this._data.left
    }
    return this._data.left || 0
  }
  set left(value: number) {
    if (this._data.left !== value) {
      this.owner._positionDirty = true
      this._data.left = value
    }
  }  
  /**
  * Gets the original left value as given by the user. 
  */
  getLeft(){
    return this._data.left
  }

  /**
   * Returns the calculated top coordinate, as absolute number of rows declared in this props.. It always perform the calculation if the value was given as ratio.
   * Use [[getTop]] to get the original value given by the user. 
   */
  get top(): number {
    if (!this._data.top) {
      return 0
    }
    if (this._data.top > -1 && this._data.top < 1) {
      return isElement(this.owner.parentNode) && Math.round(this.owner.parentNode.contentHeight * this._data.top) || this._data.top
    }
    return this._data.top || 0
  }
  set top(value: number) {
    if (this._data.top !== value) {
      this.owner._positionDirty = true
      this._data.top = value
    }
  }  
  /**
  * Gets the original top value as given by the user. 
  */
  getTop(){
    return this._data.top
  }

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
