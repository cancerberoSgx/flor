import { PropertyOptional } from 'misc-utils-of-mine-generic'
import { MouseAction, ProgramKeyEvent, ProgramMouseEvent } from '../declarations'
import { ComponentProps } from '../jsx'
import { ProgramDocumentRenderer } from '../manager'
import { ClicksEvent } from '../manager/clicks'
import { LayoutOptions } from '../util'
import { BorderStyle } from '../util/border'
import { ProgramElement } from './programElement'
import { ColorString } from './styleProps'

export interface Edges {
  top: number
  left: number
  right: number
  bottom: number
}
export interface Padding extends Edges {
}
/**
 * This represents the native styles attrs that are set directly using tput (the axioms)
 */
export interface Attrs {
  bg: ColorString
  fg: ColorString
  ch: string
  bold: boolean
  underline: boolean
  standout: boolean
  blink: boolean
  invisible: boolean
}

export interface StyleProps extends Attrs {
    /**
   * Width of the element (number of columns or fraction).
   *
   * If the value is a number between 0 and 1 (non inclusive) then it will be the parent's [[contentHeight]]
   * multiplied for that number. For example, width==0.5 will be half the parent's [[contentHeight]].
   * Otherwise is columns.
   */
  width: number
  /**
   * Height of the element (number of rows or fraction).
   *
   * If the value is a number between 0 and 1 (non inclusive) then it will be the parent's [[contentHeight]]
   * multiplied for that number. For example, height==0.5 will be half the parent's [[contentHeight]].
   * Otherwise is rows.
   */
  height: number
  /**
   * Top coordinate (row number), relative to the parent.
   *
   * Can be negative number in which case the element will be outside parent's viewport.
   *
   * If the value is a number between 0 and 1 (non inclusive) then it will be the parent's absolute top
   * position multiplied for that number. For example, top==0.5 will be position the element at the middle of
   * the parent. Otherwise is rows.
   */
  top: number
  /**
   * Left coordinate (column number, negative column number or fraction), relative to the parent's
   * [[absoluteLeft]] coordinate.
   *
   * Can be negative number in which case the element will be outside parent's viewport.
   *
   * If the value is a number between 0 and 1 (non inclusive) then it will be the parent's absolute left
   * position multiplied for that number. For example, left==0.5 will be position the element at the middle of
   * the parent. Otherwise is columns.
   */
  left: number

  /**
   * If true child text nodes will be wrapped into element's [[contentWidth]]. Default value: false
   */
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
   * It will prevent painting the background so back elements will be visible. IMPORTANT: if true then `bg`
   * property must be undefined. NOTE: to preserve parent's background color, just don't `bg` instead using
   * this. This whould rarely used, probably useful fo rcustom elements that need to manage the rendering 100%
   * their self.
   */
  noFill: boolean
}

export interface BorderProps extends StyleProps {
  type?: BorderStyle
}

export interface EventTarget {

}

export type EventListener<T extends EventTarget = EventTarget> = (evt: Event<T>) => void | boolean

export interface Event<T extends EventTarget = EventTarget> extends StopPropagation {
  readonly currentTarget: T | undefined
  readonly type: string
}

export interface StopPropagation {
  stopPropagation(): void
}

export interface RegisteredEventListener<T extends ProgramElement = ProgramElement> {
  el: T
  name: string
  listener: MouseListener | KeyListener
}

export type RegisteredGlobalEventListener<T extends ProgramElement = ProgramElement> = PropertyOptional<RegisteredEventListener<T>, 'el'>

export type MouseListener<T extends ProgramElement = ProgramElement> = (ev: MouseEvent<T>) => void | boolean

export type KeyListener<T extends ProgramElement = ProgramElement> = (ev: KeyEvent<T>) => void | boolean

interface AbstractEvent<T extends ProgramElement = ProgramElement, Action = string> extends Event<T> {
  name: string
  shift: boolean
  ctrl: boolean
  meta: boolean
  action: Action
  type: string
  raw: [number, number, number, string]
}

export interface KeyEvent<T extends ProgramElement = ProgramElement> extends AbstractEvent<T, string>, ProgramKeyEvent {
  full: string
  sequence: string
  bug: Buffer
  ch: string
}

export type KeyPredicate = (e: KeyEvent) => boolean

export interface MouseEvent<T extends ProgramElement = ProgramElement> extends AbstractEvent<T, MouseAction>, ProgramMouseEvent {
  x: number
  y: number
  button: 'left' | 'right' | 'middle' | 'unknown'
  bug: Buffer
}

export interface FocusEvent<T extends ProgramElement = ProgramElement>  extends Event<T> {
  previous?: T
}

export interface BlurEvent<T extends ProgramElement = ProgramElement>  extends Event<T> {
  focused?: T
}

export interface ElementProps extends StyleProps, ComponentProps {

  focusable: boolean
  focused: boolean
  overflow: 'visible' | 'hidden'
  preventChildrenCascade: boolean
  preventSiblingCascade: boolean

  /**
   * Custom Styles for when the element is focused. Note: in order for the element to restore the normal
   * property value, it must also be declared as a normal property. Example: `<box focus={{bg: 'blue'}}/>`,
   * because `bg` is only declared as a focus property when the element looses focus the 'blue' background
   * will remain applied. This can ba avoided declaring also a normal state background color: `<box bg="black"
   * focus={{bg: 'blue'}}/>`.
   */
  focus: Partial<StyleProps>

  /**
   * Like Dom element's ids to uniquely identify them. Not used internally, meant for the user.
   */
  id: string
  /**
   * Similar to [[id]] but doesn't have to be unique. Not used internally, meant for the user.
   */
  name: string
  /**
   * Similar to Dom Element class names. Not used internally, meant for the user.
   */
  classes: string[]
  /**
   * Similar to [[name]] but numeric type. Not used internally, meant for the user.
   */
  number: number
  /**
   * Custom elements or components can use this property to identify the their type with a name.
   */
  elementType: string

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
   * Returning true will prevent the default implementation to execute. Currently the layout calculation for
   * children is done here so it can be prevented by returning true.
   */
  beforeRender?(): boolean
  /**
   * Called by  `Flor.render()` after all children ProgramElement instances are created and appended to this
   * node.
   *
   * Returning true will prevent the default implementation to execute. Currently the layout calculation for
   * children is done here so it can be prevented by returning true.
   */
  childrenReady?(): boolean

  /**
   * Listener for when the element is clicked. The element must have the mouse enabled
   * (`Program.enableMouse()`).
   */
  onClick?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean

  /**
   * Listener for when the element is clicked several times in a short amount of time, like double click. The
   * element must have the mouse enabled (`Program.enableMouse()`).
   */
  onClicks?<T extends ProgramElement= ProgramElement>(r: ClicksEvent<T>): void | boolean

  /**
   * Listener for when the element is clicked. The element must have the mouse enabled
   * (`Program.enableMouse()`).
   */
  onKeyPressed?<T extends ProgramElement= ProgramElement>(e: KeyEvent<T>): void | boolean

  onMouse?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseOut?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseOver?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseDown?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean
  onWheelDown?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean
  onWheelUp?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseMove?<T extends ProgramElement= ProgramElement>(r: MouseEvent<T>): void | boolean

  /**
   * Current input for input elements like input, textarea, etc.
   */
  input: string
  /**
   * Current value for input elements like input, textarea, etc.
   */
  value: string

  onBlur?(e: BlurEvent): void | boolean
  onFocus?(e: FocusEvent): void | boolean

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

}

export interface FullProps extends ElementProps {
  tagName: string
  parent: ProgramElement
  children: (Partial<FullProps> | ProgramElement | string)[]
}
