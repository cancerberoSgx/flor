import { ProgramElement } from './programElement'
import { ColorString, PAttrs } from './styleProps'

export class AttrsImpl<T extends PAttrs = PAttrs> implements PAttrs {
  constructor(p: PAttrs, owner: ProgramElement) {
    this._data = p as any || {}
    this.owner = owner
  }
  assign(o: T) {
    Object.assign(this._data, o || {})
  }
  protected _data: T
  protected owner: ProgramElement
  /**
   * Gets all props as plain object.
   */
  get data() {
    return this._data
  }
  /**
   * Gets only the character attributes as plain object.
   */
  get attrs() {
    return {
      bold: this._data.bold,
      bg: this._data.bg,
      fg: this._data.fg,
      ch: this._data.ch,
      invisible: this._data.invisible,
      underline: this._data.underline,
      standout: this._data.standout,
      blink: this._data.blink
    } as PAttrs
  }
  public get bold(): boolean | undefined {
    return this._data.bold
  }
  public set bold(value: boolean | undefined) {
    this._data.bold = !!value
  }
  public get bg(): ColorString | undefined {
    return this._data.bg
  }
  public set bg(value: ColorString | undefined) {
    this._data.bg = value
  }
  public get fg(): ColorString | undefined {
    return this._data.fg
  }
  public set fg(value: ColorString | undefined) {
    this._data.fg = value
  }
  public get ch(): string | undefined {
    return this._data.ch
  }
  public set ch(value: string | undefined) {
    this._data.ch = value
  }
  public get underline(): boolean | undefined {
    return this._data.underline
  }
  public set underline(value: boolean | undefined) {
    this._data.underline = value
  }
  public get blink(): boolean | undefined {
    return this._data.blink
  }
  public set blink(value: boolean | undefined) {
    this._data.blink = value
  }
  public get standout(): boolean | undefined {
    return this._data.standout
  }
  public set standout(value: boolean | undefined) {
    this._data.standout = value
  }
  public get invisible(): boolean | undefined {
    return this._data.invisible
  }
  public set invisible(value: boolean | undefined) {
    this._data.invisible = value
  }
}
