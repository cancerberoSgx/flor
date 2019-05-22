import { PropertyOptional } from 'misc-utils-of-mine-generic'
import { MouseAction, ProgramKeyEvent, ProgramMouseEvent } from '../declarations'
import { ComponentProps } from '../jsx'
import { ProgramDocumentRenderer } from '../manager'
import { ClicksEvent } from '../manager/clicks'
import { LayoutOptions } from '../util'
import { BorderStyle } from '../util/border'
import { ProgramElement } from './programElement'
import { ColorString } from './styleProps'
import { TextNode, Node } from '../dom';

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
   * If the value is a number between 0 and 1 (non inclusive) then it will be the parent's [[contentWidth]]
   * multiplied for that number. For example, width==0.5 will be half the parent's [[contentWidth]]. Otherwise
   * is columns.
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
   * If the value is a number between 0 and 1 (non inclusive) then it will be the parent's [[contentHeight]]
   * multiplied for that number. For example, top==0.5 will be position the element at the middle of the
   * parent. Otherwise is rows.
   */
  top: number

  /**
   * Left coordinate (column number, negative column number or fraction), relative to the parent's
   * [[absoluteLeft]] coordinate.
   *
   * Can be negative number in which case the element will be outside parent's viewport.
   *
   * If the value is a number between -1, 1 (non inclusive) then it will be the parent's [[contentWidth]]
   * multiplied for that number. For example, left==0.5 will will position the element at the middle of the
   * parent. Otherwise is a number in columns.
   */
  left: number

  /**
   * If true child text nodes will be wrapped into element's [[contentWidth]]. Default value: false.
   */
  textWrap: boolean

  /**
   * Like in HTML DOM box model, the padding is the area between the border and the content. Adding padding
   * won't change the element's bounds, but shrink the content bounds. Attributes like `bg` and `ch` applies
   * in this area.
   */
  padding: Padding

  /**
   * Layout element's children with a layout manager. `flor` supports several layout implementations, when one
   * is defined, element's children will be positioned and possible sized according to the layout rules. See
   * [[LayoutOptions]].
   */
  layout: LayoutOptions

  /**
   * Similar to CSS `position`. The position type of an element defines how it is positioned within its
   * parent.
   *
   * RELATIVE (DEFAULT) By default an element is positioned relatively. This means an element v If position is
   * `relative` then  is positioned according to the normal flow of the layout, and then offset relative to
   * that position based on the values of top, right, bottom, and left. The offset does not affect the
   * position of any sibling or parent elements. In other words, the parent layout, if any, will manage the
   * element's bounds.
   *
   * If `absolute`  parent layout won't have effect on this element. When positioned absolutely an element
   * doesn't take part in the normal layout flow. It is instead laid out independent of its siblings. The
   * position is determined based on the top, right, bottom, and left values.The position values top, right,
   * bottom, and left behave differently depending on the position type of the element. For a relative element
   * they offset the position of the element in the direction specified. For absolute element though these
   * properties specify the offset of the element's side from the same side on the parent.
   *
   * In both cases, `top`, `left`, `width`and `height`are relative to the parent's content bounds. 
   *
   * Default value is `relative`.
   * 
   * See [flex-box absolute-relative-layout](https://yogalayout.com/docs/absolute-relative-layout/).
   */
  position: 'relative' | 'absolute'

  /**
   * Similar to HTML DOM, when `visible` the area of elements that get outside this parent element will be
   * visible, no matter if they are rendered outside this element's content area. If `hidden` the area of
   * children outside this parent element won't be shown (the elements will be shown but truncated to the
   * parent's content area).
   */
  overflow: 'visible' | 'hidden'

  /**
   * if defined, a 1-sized outer wrapper will be added in all size calculations and a border will be drawn.
   * This means the inner (content) dimension is not affected.
   */
  border: Partial<BorderProps>

  /**
   * It will prevent painting the background so back elements will be visible. IMPORTANT: if true then `bg`
   * property must be undefined. NOTE: to preserve parent's background color, just don't `bg` instead using
   * this. This would rarely used, probably useful for custom elements that need to manage the rendering 100%
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

export interface FocusEvent<T extends ProgramElement = ProgramElement> extends Event<T> {
  previous?: T
}

export interface BlurEvent<T extends ProgramElement = ProgramElement> extends Event<T> {
  focused?: T
}

interface KeyEventTarget {
  /**
   * Listener for when the element is clicked. The element must have the mouse enabled
   * (`Program.enableMouse()`).
   */
  onKeyPressed?<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): void | boolean
  onKeyDown?<T extends ProgramElement = ProgramElement>(e: KeyEvent<T>): void | boolean
}
interface MouseEventTarget {
  /**
   * Listener for when the element is clicked. The element must have the mouse enabled
   * (`Program.enableMouse()`).
   */
  onClick?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean

  /**
   * Listener for when the element is clicked several times in a short amount of time, like double click. The
   * element must have the mouse enabled (`Program.enableMouse()`).
   */
  onClicks?<T extends ProgramElement = ProgramElement>(r: ClicksEvent<T>): void | boolean

  onMouse?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseOut?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseOver?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseDown?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean
  onWheelDown?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean
  onWheelUp?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean
  onMouseMove?<T extends ProgramElement = ProgramElement>(r: MouseEvent<T>): void | boolean
}

export interface InputEventTarget {
  /**
   * Current input for input elements like input, textarea, etc.
   */
  input: string

  /**
   * Current value for input elements like input, textarea, etc.
   */
  value: string

  /**
   * Emitted when the user writs or deletes text in the input. Notice that the user didn't explicitly gestured
   * a change in the value, he is just writing text. For subscribing for when the user explicitly changes the
   * value (like when pressing enter), use [[onChange]].
   */
  onInput(e: { currentTarget: ProgramElement, input: string }): void

  /**
   * Emitted when the user explicitly gestures a change in the value, like when pressing enter, or blur.
   */
  onChange(e: { currentTarget: ProgramElement, value: string }): void

  /**
   * Keys to change the value. By default is ENTER.
   */
  changeKeys: KeyPredicate

  /**
   * Change the value on blur? By default is true.
   */
  changeOnBlur: boolean

  focusOnClick: boolean
}

export interface Renderable {
  /**
   * Default value is `false`. in which case, children inherits its parent properties, declared or not
   * declared. If `true`, children won't inherits parent's properties. See [[RenderElementOptions]]
   * description for details..
   */
  preventChildrenCascade: boolean

  /**
   * Default value: `true` in which an element's properties are totally independent on the properties of its
   * siblings. If `false`, properties defined by previous siblings or their descendants will be propagated to
   * the element. See [[RenderElementOptions]] description for details.
   *
   */
  preventSiblingCascade: boolean


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
}

export interface Focusable {
  /**
 * If true, the element can gain focus, when FocusManager's [[focusNext]] or [[focusPrevious]] methods are
 * call to cycle the focus. 
 *
 * Note that key listeners subscribed to an element (ej using [[onKeyPressed]]), will be only notified when
 * the element has focus. See [[FocusManager]] for details.
 */
  focusable: boolean

  /**
   * Indicates if this element has focus. Setting this property will request the focus manager, if any, to
   * give focus to this element.
   */
  focused: boolean

  /**
   * Custom Styles to apply when the element is focused. 
   *
   * See [[StyleEffectsManager]] for details.
   *
   * Note: in order for the element to restore the normal property value, it must also be declared as a normal
   * property. Example: `<box focus={{bg: 'blue'}}/>`, because `bg` is only declared as a focus property when
   * the element looses focus the 'blue' background will remain applied. This can ba avoided declaring also a
   * normal state background color: `<box bg="black" focus={{bg: 'blue'}}/>`.
   */
  focus: Partial<StyleProps>

  /**
   * Called when the element looses its focus.
   */
  onBlur?(e: BlurEvent): void | boolean

  /**
   * Called when the element gains focus.
   */
  onFocus?(e: FocusEvent): void | boolean
}

export interface Classifiable {
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
}

export interface LifeCycleEventTarget {
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
  afterRender?(el: ProgramElement): void

  /**
   * Like [[afterRender]] but it will be called only once.
   */
  onceRendered?(el: ProgramElement): void

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
}


export interface ElementProps extends StyleProps, ComponentProps, MouseEventTarget, Renderable, Focusable, Classifiable, LifeCycleEventTarget, InputEventTarget, KeyEventTarget {

}

export interface FullProps extends ElementProps {
  tagName: string
  parent: ProgramElement
  children: (Partial<FullProps> | ProgramElement | string)[]
}
