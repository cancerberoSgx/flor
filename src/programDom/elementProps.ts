import { KeyEvent, MouseEvent } from '../render'
import { LayoutOptions } from '../util'
import { isElement } from './elementUtil'
import { ProgramElement } from './programElement'
import { StylePropsImpl } from './styleProps'
import { BorderProps, ElementProps, Padding } from './types'

export class ElementPropsImpl extends StylePropsImpl<Partial<ElementProps>> implements Partial<ElementProps> {

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

  public get width(): number {
    if (!this._data.width) {
      return 0
    }
    if (this._data.width > 0 && this._data.width < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentWidth * this._data.width) || this._data.width
    }
    return this._data.width || 0
  }
  public set width(value: number) {
    if (this._data.width !== value) {
      this._data.width = value && Math.round(value)
    }
  }

  public get height(): number {
    if (!this._data.height) {
      return 0
    }
    if (this._data.height > 0 && this._data.height < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentHeight * this._data.height) || this._data.height
    }
    return this._data.height || 0
  }
  public set height(value: number) {
    if (this._data.height !== value) {
      this._data.height = value && Math.round(value)
    }
  }

  get left(): number {
    if (!this._data.left) {
      return 0
    }
    if (this._data.left > 0 && this._data.left < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentWidth * this._data.left) || this._data.left
    }
    return this._data.left || 0
  }
  set left(value: number) {
    if (this._data.left !== value) {
      this.owner.positionDirty = true
      this._data.left = value && Math.round(value)
    }
  }

  get top(): number {
    if (!this._data.top) {
      return 0
    }
    if (this._data.top > 0 && this._data.top < 1) {
      return isElement(this.owner.parentNode) &&  Math.round(this.owner.parentNode.contentHeight * this._data.top) || this._data.top
    }
    return this._data.top || 0
  }
  set top(value: number) {
    if (this._data.top !== value) {
      this.owner.positionDirty = true
      this._data.top = value && Math.round(value)
    }
  }

  private _focused: boolean | undefined
  public get focused(): boolean | undefined {
    return this._focused
  }
  public set focused(value: boolean | undefined) {
    this._focused = value
  //  throw new Error('Not implemented')//TODO: use focusManager
  }
  

  public get layout(): LayoutOptions | undefined {
    return this._data.layout
  }
  public set layout(value: LayoutOptions | undefined) {
    this._data.layout = value
    this.owner.positionDirty = true
  }

  private _focusable: boolean | undefined
  public get focusable(): boolean | undefined {
    return this._focusable
  }
  public set focusable(value: boolean | undefined) {
    this._focusable = value
  }

  childrenReady?: () => boolean
  afterRenderWithoutChildren?: () => boolean
  afterRender?: () => boolean
  beforeRender?: () => boolean
  onClick?(r: MouseEvent): void
  onKeyPressed?<T extends ProgramElement= ProgramElement>(e: KeyEvent<T>): void
  onMouse?(r: MouseEvent): void
  onMouseOut?(r: MouseEvent): void
  onMouseOver?(r: MouseEvent): void
  onMouseDown?(r: MouseEvent): void
  onWheelDown?(r: MouseEvent): void
  onWheelUp?(r: MouseEvent): void
  onMouseMove?(r: MouseEvent): void

  private _input: string | undefined
  public get input(): string | undefined {
    return this._input
  }
  public set input(value: string | undefined) {
    this._input = value
  }

  private _value: string | undefined
  public get value(): string | undefined {
    return this._value
  }
  public set value(value: string | undefined) {
    this._value = value
  }
}
