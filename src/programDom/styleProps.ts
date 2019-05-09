import { nonEnumerableMember, enumerableMember } from '../util/misc'
import { Attrs, StyleProps } from './types'

export class AttrsImpl< T extends PAttrs = PAttrs> implements PAttrs {
  constructor(p: PAttrs) {
    // if (p) {
      this._data = p as any || {}
    //   for (let k of AttrsImpl.attr_props) {
    //     // @ts-ignore
    //     this['_' + k] = p[k]
    //   }
    // }
    // else {
    //   this._data = {} as any
    // }
    // for (let p of AttrsImpl.attr_props) {
    //   nonEnumerableMember(this, '_' + p)
    //    enumerableMember(this, p)
    // }
    // this._data.non_iterable()
  }
  assign(o: any) {
    Object.assign(this._data, o||{})
  }

  protected _data:T
  get data() {
    return this._data
 }
  // private static attr_props = ['bg', 'fg', 'bold', 'underline', 'standout', 'ch', 'blink', 'invisible']

  // private _non_iterable() {
  //   for (let p of AttrsImpl.attr_props) {
  //     nonEnumerableMember(this, '_' + p)
  //   }
  // }

  // private _bold: boolean | undefined
  public get bold(): boolean  | undefined {
    return this._data.bold
  }
  public set bold(value: boolean | undefined) {
    this._data.bold = !!value
  }
  // private _bg: Color | undefined
  public get bg(): Color | undefined {
    return this._data.bg
  }
  public set bg(value: Color | undefined) {
    this._data.bg = value
  }
  // private _fg: Color | undefined
  public get fg(): Color | undefined {
    return this._data.fg
  }
  public set fg(value: Color | undefined) {
    this._data.fg = value
  }
  // private _ch: string | undefined
  public get ch(): string | undefined {
    return this._data.ch
  }
  public set ch(value: string | undefined) {
    this._data.ch = value
  }
  // private _underline: boolean | undefined
  public get underline(): boolean | undefined {
    return this._data.underline
  }
  public set underline(value: boolean | undefined) {
    this._data.underline = value
  }
  // private _blink: boolean | undefined
  public get blink(): boolean | undefined {
    return this._data.blink
  }
  public set blink(value: boolean | undefined) {
    this._data.blink = value
  }
  // private _standout: boolean | undefined
  public get standout(): boolean | undefined {
    return this._data.standout
  }
  public set standout(value: boolean | undefined) {
    this._data.standout = value
  }
  // private _invisible: boolean | undefined
  public get invisible(): boolean | undefined {
    return this._data.invisible
  }
  public set invisible(value: boolean | undefined) {
    this._data.invisible = value
  }
}
export class StylePropsImpl< T extends PAttrs = PAttrs> extends AttrsImpl<T> implements Partial<StyleProps> {
}
export type Color = string

export type PAttrs = Partial<Attrs>

