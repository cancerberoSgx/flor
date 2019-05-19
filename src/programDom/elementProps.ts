import { KeyEvent, MouseEvent, ProgramDocumentRenderer, ProgramElement, TextNode } from '..'
import { Node } from '../dom'
import { BlurEvent, FocusEvent } from '../manager/focusManager'
import { StylePropsImpl } from './styleProps'
import { ElementProps, StyleProps } from './types'

export class ElementPropsImpl< T extends ElementProps = ElementProps> extends StylePropsImpl< T> implements Partial<ElementProps> {

  public get overflow(): 'visible' | 'hidden' | undefined {
    return this._data.overflow
  }
  public set overflow(value: 'visible' | 'hidden' | undefined) {
    this._data.overflow = value
  }

  public get focused(): boolean | undefined {
    return this._data.focused
  }
  public set focused(value: boolean | undefined) {
    this._data.focused = value
    // TODO: here we could notify focusManager
  }

  public get focus(): Partial<StyleProps> & {readonly data: any} | undefined {
    return this._dataFocus
  }
  private _dataFocus: StylePropsImpl | undefined
  public set focus(value: Partial<StyleProps> & {readonly data: any}  | undefined) {
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

  childrenReady?(): boolean
  afterRenderWithoutChildren?(): boolean
  afterRender?(): boolean
  beforeRender?(): boolean

  onClick?(r: MouseEvent): void
  onKeyPressed?<T extends ProgramElement= ProgramElement>(e: KeyEvent<T>): void
  onMouse?(r: MouseEvent): void
  onMouseOut?(r: MouseEvent): void
  onMouseOver?(r: MouseEvent): void
  onMouseDown?(r: MouseEvent): void
  onWheelDown?(r: MouseEvent): void
  onWheelUp?(r: MouseEvent): void
  onMouseMove?(r: MouseEvent): void
  onBlur?(e: BlurEvent): void
  onFocus?(e: FocusEvent): void

  /**
   * Custom element draw function. Can be declared by subclasses that need custom drawing method. If declared,
   * the content and border won't be rendered, and implementation is responsible of them.
   */
  render?(renderer: ProgramDocumentRenderer): void

  /**
   * Custom element content draw function. Can be declared by subclasses that need custom content drawing
   * method. If declared, the content   won't be rendered but the border will. The implementation is
   * responsible of drawing the content.
   */
  renderContent?(renderer: ProgramDocumentRenderer): void

  /**
   * Custom element content draw function. Can be declared by subclasses that need custom content drawing
   * method. If declared, the content   won't be rendered but the border will. The implementation is
   * responsible of drawing the content.
   */
  renderBorder?(renderer: ProgramDocumentRenderer): void

  /**
   * Custom element children draw function. Children are both elements and text. Can be declared by subclasses
   * that need custom children drawing method. If declared, children   won't be rendered but the content and
   * border will. The implementation is responsible of drawing the children.
   */
  renderChildren?(renderer: ProgramDocumentRenderer): void
  /**
   * Custom element child element draw function. Child elements are child elements but not text nodes. Can be
   * declared by subclasses that need custom children drawing method. If declared, child elements (not text)
   * won't be rendered but the child text nodes, content and border will. The implementation is responsible of
   * drawing the child elements and its children's children.
   */
  renderChildElement?(renderer: ProgramDocumentRenderer, child: ProgramElement, index: number, children: Node[]): void

  /**
   * Custom element child text node draw function. Child text nodes are child  text but not child elements.
   * Can be declared by subclasses that need custom child text nodes drawing method. If declared, child text
   * nodes (not child elements) won't be rendered but the child elements, content and border will. The
   * implementation is responsible of drawing the text and respecting props.wordWrap and styles.
   */
  renderChildText?(renderer: ProgramDocumentRenderer, text: TextNode, index: number): void

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
}
