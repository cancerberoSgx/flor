import { MouseEvent } from '../render'
import { LayoutOptions } from '../util'
import { BorderStyle } from '../util/border'
import { StylePropsImpl } from './styleProps'
import { BorderProps, ElementProps, Padding } from './types'

export class ElementPropsImpl extends StylePropsImpl<Partial<ElementProps>> implements Partial<ElementProps> {

  public get border() {
    return this._data.border
  }
  public set border(value: Partial<BorderProps> | undefined) {
    // if(!!this._data.border!==!!value){
    //   this.owner.positionDirty=true
    // }
    this._data.border = value
  }

  public get padding(): Padding | undefined {
    return this._data.padding
  }
  public set padding(value: Padding | undefined) {
    this._data.padding = value
  }

  public get width(): number {
    return this._data.width || 0
  }
  public set width(value: number) {
    if(this._data.width !==value) {
      // this.owner.positionDirty = true
      this._data.width = value
    }
  }

  public get height(): number {
    return this._data.height || 0
  }
  public set height(value: number) {
    if(this._data.height !==value) {
      // this.owner.positionDirty = true
      this._data.height = value
    }
  }

  get left(): number {
    return this._data.left || 0
  }
  set left(value: number) {
    if(this._data.left !==value) {
      this.owner.positionDirty = true
      this._data.left = value
    }
  }

  get top(): number {
    return this._data.top || 0
  }
  set top(value: number) {
    if(this._data.top !==value) {
      this.owner.positionDirty = true
      this._data.top = value
    }
  }

  public get layout(): LayoutOptions | undefined {
    return this._data.layout
  }
  public set layout(value: LayoutOptions | undefined) {
    this._data.layout = value
    this.owner.positionDirty = true
  }

  childrenReady?: () => boolean
  afterRenderWithoutChildren?: () => boolean
  afterRender?: () => boolean
  beforeRender?: () => boolean
  onClick?(r: MouseEvent): void
}

// class BorderPropsImpl extends Sts