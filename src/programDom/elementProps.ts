import { MouseEvent } from '../render'
import { LayoutOptions } from '../util'
import { BorderStyle } from '../util/border'
import { isElementProps } from './elementUtil'
import { StylePropsImpl } from './styleProps'
import { BorderProps, ElementProps, Padding } from './types'

export class ElementPropsImpl extends StylePropsImpl<Partial<ElementProps>> implements Partial<ElementProps> {
  constructor(p: Partial<ElementProps>) {
    super(p)
    // super(p)
    // if (p) {
    //   for (let k of ElementPropsImpl.el_props) {
    //     // @ts-ignore
    //     this['_' + k] = p[k]
    //   }
    // }
    // for (let p of ElementPropsImpl.el_props) {
    //   nonEnumerableMember(this, '_' + p)
    // }
  }

// private static el_props = ['width', 'height', 'border', 'padding', 'top', 'left', 'layout']

  // private _border: BorderProps | undefined
  // public get border(): BorderProps | boolean | BorderStyle | undefined {
  //   return this._data.border
  // }
  public get border() {
    return this._data.border
  }
  public set border(value: Partial<BorderProps> | undefined) {// } | boolean | BorderStyle | undefined) {
    // if(!value){
    this._data.border = value
    // }
    // else {
    //   if(!this._data.border){
    //     this._data.border = new BorderPropsImpl({
    //       type : BorderStyle.light
    //     })
    //   }
    //   if(value===true) {
    //     //@ts-ignore
    //     this._data.border.type = BorderStyle.light
    //   }
    //   else if(typeof value === 'string'){
    //     //@ts-ignore
    //     this._data.border.type = BorderStyle[value]||BorderStyle.light
    //   }
    //   else {
    //     // debug(this._data.border, value)
    //     // Object.assign(this._data.border, value)
    //     if(value && value.fg && this._data.border){
    //     //@ts-ignore
    //       this._data.border .fg = value.fg
    //       // debug(this._data.border.fg)
    //     }

    //   }
    // }
  }

  // private _padding: Padding | undefined
  public get padding(): Padding | undefined {
    return this._data.padding
  }
  public set padding(value: Padding | undefined) {
    this._data.padding = value
  }
  // private _width: number = 0
  public get width(): number {
    return this._data.width || 0
  }
  public set width(value: number) {
    this._data.width = value
  }
  // private _height: number = 0
  public get height(): number {
    return this._data.height || 0
  }
  public set height(value: number) {
    this._data.height = value
  }
  // private _left: number = 0
  get left(): number {
    return this._data.left || 0
  }
  set left(value: number) {
    this._data.left = value
  }
  // private _top: number = 0
  get top(): number {
    return this._data.top || 0
  }
  set top(value: number) {
    this._data.top = value
  }
  // private _layout: LayoutOptions | undefined
  public get layout(): LayoutOptions | undefined {
    return this._data.layout
  }
  public set layout(value: LayoutOptions | undefined) {
    this._data.layout = value
  }

  childrenReady?: () => boolean// = () => { return false }
  afterRenderWithoutChildren?: () => boolean
  // Dont remove this implementation - will break isEElementProps
  afterRender?: () => boolean
  beforeRender?: () => boolean// { return false }
  onClick?(r: MouseEvent): void
}

class BorderPropsImpl extends StylePropsImpl<Partial<BorderProps>> implements Partial<BorderProps> {
  // private _type: BorderStyle | undefined
  constructor(p: Partial<BorderProps> = {}) {
    super(p)
    this._data.type = typeof p === 'string'  ? p : typeof p === 'boolean' ? BorderStyle.light : typeof p === 'undefined' ? undefined : p.type
    if (isElementProps(p)) {
      if (p.fg) {
        this.fg = p.fg
      }
    }
  }
  public get type(): BorderStyle | undefined {
    return this._data.type
  }
  public set type(value: BorderStyle | undefined) {
    this._data.type = value
  }
}
