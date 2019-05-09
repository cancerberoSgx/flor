import { ProgramElement } from './programElement';
import { PAttrs, Color } from './styleProps';
let attrProps;
export class AttrsImpl<T extends PAttrs = PAttrs> implements PAttrs {
  constructor(p: PAttrs, owner: ProgramElement) {
    this._data = p as any || {};
    this.owner = owner;
  }
  assign(o: T) {
    Object.assign(this._data, o || {});
  }
  protected _data: T;
  protected owner: ProgramElement;
  /**
   * The props as plain object
   */
  get data() {
    return this._data;
  }
  public get bold(): boolean | undefined {
    return this._data.bold;
  }
  public set bold(value: boolean | undefined) {
    this._data.bold = !!value;
  }
  public get bg(): Color | undefined {
    return this._data.bg;
  }
  public set bg(value: Color | undefined) {
    this._data.bg = value;
  }
  public get fg(): Color | undefined {
    return this._data.fg;
  }
  public set fg(value: Color | undefined) {
    this._data.fg = value;
  }
  public get ch(): string | undefined {
    return this._data.ch;
  }
  public set ch(value: string | undefined) {
    this._data.ch = value;
  }
  public get underline(): boolean | undefined {
    return this._data.underline;
  }
  public set underline(value: boolean | undefined) {
    this._data.underline = value;
  }
  public get blink(): boolean | undefined {
    return this._data.blink;
  }
  public set blink(value: boolean | undefined) {
    this._data.blink = value;
  }
  public get standout(): boolean | undefined {
    return this._data.standout;
  }
  public set standout(value: boolean | undefined) {
    this._data.standout = value;
  }
  public get invisible(): boolean | undefined {
    return this._data.invisible;
  }
  public set invisible(value: boolean | undefined) {
    this._data.invisible = value;
  }
}
