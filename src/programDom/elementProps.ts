import { MouseEvent } from '../render'
import { LayoutOptions, debug } from '../util'
import { BorderStyle } from '../util/border'
import { StylePropsImpl } from './styleProps'
import { BorderProps, ElementProps, Padding } from './types'
import { isElement } from './elementUtil';

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
    if(!this._data.width){
      return 0
    }
    if(this._data.width>0&&this._data.width<1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentWidth*this._data.width) ||this._data.width
    }
    return this._data.width || 0
  }
  public set width(value: number) {
    // if(value>0&&value<1) {
    //   value = isElement(this.owner.parentNode) ?  Math.round(this.owner.parentNode.props.width*value) : 0 
    //   debug(value,isElement(this.owner.parentNode), (this.owner.parentNode as any).props.width)
    // }
    if(this._data.width !==value) {
      // this.owner.positionDirty = true
      this._data.width = value
    }
  }

  public get height(): number {
    if(!this._data.height){
      return 0
    }
    if(this._data.height>0&&this._data.height<1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentHeight*this._data.height) ||this._data.height
    }
    return this._data.height || 0
  }
  public set height(value: number) {
    // if(value>0&&value<1) {
    //   value = isElement(this.owner.parentNode) ?  Math.round(this.owner.parentNode.props.height*value) : 0 
    // }
    if(this._data.height !==value) {
      // this.owner.positionDirty = true
      this._data.height = value
    }
  }

  get left(): number {
    if(!this._data.left){
      return 0
    }
    if(this._data.left>0&&this._data.left<1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentWidth*this._data.left) ||this._data.left
    }
    return this._data.left || 0
  }
  set left(value: number) {    
    // if(value>0&&value<1) {
    //   value = isElement(this.owner.parentNode) ?  Math.round(this.owner.parentNode.props.width*value) : 0 
    // }
    if(this._data.left !==value) {
      this.owner.positionDirty = true
      this._data.left = value
    }
  }

  get top(): number {
    if(!this._data.top){
      return 0
    }
    if(this._data.top>0&&this._data.top<1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentHeight*this._data.top) ||this._data.top
    }
    return this._data.top || 0
  }
  set top(value: number) { 
    // if(value>0&&value<1) {
    //   value = isElement(this.owner.parentNode) ?  Math.round(this.owner.parentNode.props.height*value) : 0 
    // }
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