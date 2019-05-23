import { KeyEvent, MouseEvent, ProgramDocumentRenderer, TextNode } from '..'
import { BlurEvent, FocusEvent } from '../'
import { Node } from '../dom'
import { ProgramElement } from '../programDom'
import { StylePropsImpl } from './styleProps'
import { ElementProps, KeyPredicate, StyleProps } from './types'
import { objectKeys } from 'misc-utils-of-mine-generic';
import { CommonElementProps } from '../yogaDom/yogaTypes';

export class ElementPropsImpl<T extends ElementProps = ElementProps> extends StylePropsImpl<T> implements Partial<CommonElementProps> {

  get data() {
    return { ...super.data, ...this._dataFocus ? { focus: this._dataFocus.data } : {} }
  }

 

  public get input(): string | undefined {
    return this._data.input
  }
  public set input(value: string | undefined) {
    this._data.input = value
  }

  public get value(): string | undefined {
    return this._data.value
  }
  public set value(value: string | undefined) {
    this._data.value = value
  }

  onInput?(e: { currentTarget: ProgramElement, input: string }): void

  onChange?(e: { currentTarget: ProgramElement, value: string }): void

  public get changeKeys(): KeyPredicate| undefined {
    return this._data.changeKeys
  }
  public set changeKeys(value: KeyPredicate| undefined) {
    this._data.changeKeys = value
  }

  public get changeOnBlur(): boolean {
    return !!this._data.changeOnBlur
  }
  public set changeOnBlur(value: boolean) {
    this._data.changeOnBlur = value
  }

  public get focusOnClick(): boolean {
    return typeof this._data.focusOnClick === 'undefined' ? true : this._data.focusOnClick
  }
  public set focusOnClick(value: boolean) {
    this._data.focusOnClick = value
  }

  public get focused(): boolean | undefined {
    return this._data.focused
  }
  public set focused(value: boolean | undefined) {
    this._data.focused = value
    // TODO: here we could notify focusManager
  }

  public get focus(): Partial<StyleProps> & { readonly data: any } | undefined {
    return this._dataFocus
  }
  private _dataFocus: StylePropsImpl | undefined
  public set focus(value: Partial<StyleProps> & { readonly data: any } | undefined) {
    if (!this._dataFocus) {
      this._dataFocus = new StylePropsImpl(undefined, this.owner)
    }
    this._dataFocus.assign({ ...value || {} })
  }

  public get focusable(): boolean | undefined {
    return this._data.focusable
  }
  public set focusable(value: boolean | undefined) {
    this._data.focusable = value
  }

  onBlur?(e: BlurEvent): void

  onFocus?(e: FocusEvent): void

  public get id(): undefined | string {
    return this._data.id
  }
  public set id(value: undefined | string) {
    this._data.id = value
  }

  public get name(): undefined | string {
    return this._data.name
  }
  public set name(value: undefined | string) {
    this._data.name = value
  }

  public get classes(): undefined | string[] {
    return this._data.classes
  }
  public set classes(value: undefined | string[]) {
    this._data.classes = value
  }

  public get number(): undefined | number {
    return this._data.number
  }
  public set number(value: undefined | number) {
    this._data.number = value
  }

  public get elementType(): undefined | string {
    return this._data.elementType
  }
  public set elementType(value: undefined | string) {
    this._data.elementType = value
  }

  childrenReady?(): boolean

  afterRenderWithoutChildren?(): boolean

  afterRender?(el: ProgramElement): boolean

  onceRendered?(el: ProgramElement): boolean

  beforeRender?(): boolean

  onClick?(r: MouseEvent): void

  onKeyPressed?<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): void

  onMouse?(r: MouseEvent): void

  onMouseOut?(r: MouseEvent): void

  onMouseOver?(r: MouseEvent): void

  onMouseDown?(r: MouseEvent): void

  onWheelDown?(r: MouseEvent): void

  onWheelUp?(r: MouseEvent): void

  onMouseMove?(r: MouseEvent): void

  public get preventSiblingCascade(): boolean | undefined {
    return this._data.preventSiblingCascade
  }
  public set preventSiblingCascade(value: boolean | undefined) {
    this._data.preventSiblingCascade = value
  }

  public get preventChildrenCascade(): boolean | undefined {
    return this._data.preventChildrenCascade
  }
  public set preventChildrenCascade(value: boolean | undefined) {
    this._data.preventChildrenCascade = value
  }

  render?(renderer: ProgramDocumentRenderer): void

  renderContent?(renderer: ProgramDocumentRenderer): void

  renderBorder?(renderer: ProgramDocumentRenderer): void

  renderChildren?(renderer: ProgramDocumentRenderer): void

  renderChildElement?(renderer: ProgramDocumentRenderer, child: ProgramElement, index: number, children: Node[]): void

  renderChildText?(renderer: ProgramDocumentRenderer, text: TextNode, index: number): void

}
