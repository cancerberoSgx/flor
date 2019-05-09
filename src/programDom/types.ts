import { KeyEvent, MouseEvent, ProgramDocumentRenderer } from '../render'
import { LayoutOptions } from '../util'
import { BorderStyle } from '../util/border'
import { ProgramElement } from './programElement'
import { Color } from './styleProps'
import { BlurEvent, FocusEvent } from '../render/focusManager';

// export abstract class AbstractPropsImpl implements AbstractProps {

// }
export interface Padding {
  top: number
  left: number
  right: number
  bottom: number
}
export interface AbstractProps {
}
/**
 * This represents the native styles attrs that are set direcyly udinh tput (the axioms)
 */
export interface Attrs {
// extends AbstractProps {
  bg: Color
  fg: Color
  ch: string
  bold: boolean
  underline: boolean
  standout: boolean
  blink: boolean
  invisible: boolean
}

export interface StyleProps extends Attrs {
    /**
   * Width of the element. If the value is a number between 0 and 1 (non inclusive) then it will be the parent's contentHeight multiplied for that number. For example, width==0.5 will be half the parent's height. Otherwise is columns
   */
  width: number
  /**
   * Height of the element. If the value is a number between 0 and 1 (non inclusive) then it will be the parent's contentHeight multiplied for that number. For example, height==0.5 will be half the parent's height. Otherwise is rows.
   */
  height: number
  /**
   * top coordinate (row number), relative to the parent.  If the value is a number between 0 and 1 (non inclusive) then it will be the parent's absolute top position multiplied for that number. For example, top==0.5 will be position the element at the middle of the parent. Otherwise is rows.
   */
  top: number
  /**
   * left coordinate (column number), relative to the parent.  If the value is a number between 0 and 1 (non inclusive) then it will be the parent's absolute left position multiplied for that number. For example, left==0.5 will be position the element at the middle of the parent. Otherwise is columns.
   */
  left: number
  textWrap: boolean

  /**
   *
   */
  padding: Padding

  layout: LayoutOptions

  /**
   * if defined, a 1-sized outer wrapper will be added in all size calculations and a border will be drawn.
   * This means the inner (content) dimension is not affected.
   */
  border: Partial<BorderProps>

  /**
   * It will prevent painting the background so back elements will be visible. IMPORTANT: if true then `bg` property must be undefined. NOTE: to preserve parent's background color, just don't `bg` instead using this. This whould rarely used, probably useful fo rcustom elements that need to manage the rendering 100% their self. 
   */
  noFill: boolean
}

export interface BorderProps extends StyleProps {
  type?: BorderStyle
}

export interface ElementProps extends StyleProps {


  focusable: boolean
  focused: boolean

  /**
   * Called by the renderer just after rendering this element. It's children were not yet rendered and will be
   * next.
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   */
  afterRenderWithoutChildren?(): void
  /**
   * Called by the rendered just after the element all all its children were rendered.
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   */
  afterRender?(): void
  /**
   * Called by the renderer just before rendering this element. It's children will follow.
   *
   * This gives Element subclasses the chance to change some props, or it's children just before rendering.
   *
   * Returning true will prevent the default implementation to execute. Currently the layout
   * calculation for children is done here so it can be prevented by returning true.
   */
  beforeRender?(): boolean
  /**
   * Called by  `Flor.render()` after all children ProgramElement instances are created and appended to this
   * node.
   *
   * Returning true will prevent the default implementation to execute. Currently the layout
   * calculation for children is done here so it can be prevented by returning true.
   */
  childrenReady?(): boolean

  /**
   * Listener for when the element is clicked. The program must have the mouse enabled (`Program.enableMouse()`)
   */
  onClick?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean

  /**
   * Listener for when the element is clicked. The program must have the mouse enabled (`Program.enableMouse()`)
   */
  onKeyPressed?<T extends ProgramElement= ProgramElement>(e: KeyEvent<T>): void

  onMouse?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void
  onMouseOut?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void
  onMouseOver?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void
  onMouseDown?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void
  onWheelDown?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void
  onWheelUp?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void
  onMouseMove?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void

  /**
   * Current input for input elements like input, textarea, etc.
   */
  input: string
  /**
   * Current value for input elements like input, textarea, etc.
   */
  value: string

  onBlur?(e: BlurEvent): void
  onFocus?(e: FocusEvent): void


  /**
   * Custom element draw function. Can be declared by subclasses that need custom drawing method. If declared, the content and border won't be rendered, and implementation is responsible of them.
   */
  render?(renderer: ProgramDocumentRenderer): void

  /**
   * Custom element content draw function. Can be declared by subclasses that need custom content drawing method. If declared, the content   won't be rendered but the border will. The implementation is responsible of drawing the content. 
   */
  renderContent?(renderer: ProgramDocumentRenderer): void


  /**
   * Custom element content draw function. Can be declared by subclasses that need custom content drawing method. If declared, the content   won't be rendered but the border will. The implementation is responsible of drawing the content. 
   */
  renderBorder?(renderer: ProgramDocumentRenderer): void

  /**
   * Custom element children draw function. Children are both elements and text. Can be declared by subclasses that need custom children drawing method. If declared, children   won't be rendered but the content and border will. The implementation is responsible of drawing the children. 
   */
  renderChildren?(renderer: ProgramDocumentRenderer): void

}

export interface FullProps extends ElementProps {
  tagName: string
  parent: ProgramElement
  children: (Partial<FullProps> | ProgramElement | string)[]
}
