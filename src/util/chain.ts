// import { KeyEvent, MouseEvent, ProgramDocumentRenderer } from '../manager'
// import { BlurEvent, FocusEvent } from '../manager/focusManager'
// import { BorderProps, ColorString, Padding, ProgramDocument, ProgramElement } from '..'
// import { YogaElement } from '../yogaDom/yogaElement'
// import { LayoutOptions } from './layout'

// class ChainBase<E extends ProgramElement = ProgramElement> {
//   protected el: E
//   constructor(protected doc: ProgramDocument<E>) {
//     this.el = doc.createElement('box')
//   }
// }

// class AttrsChain<E extends ProgramElement = ProgramElement> extends ChainBase<E> {
//   bg(value: ColorString) {
//     this.el.props.bg = value
//     return this
//   }
//   fg(value: ColorString) {
//     this.el.props.fg = value
//     return this
//   }
//   ch(value: string) {
//     this.el.props.ch = value
//     return this
//   }
//   bold(value: boolean) {
//     this.el.props.bold = value
//     return this
//   }
//   underline(value: boolean) {
//     this.el.props.underline = value
//     return this
//   }
//   standout(value: boolean) {
//     this.el.props.standout = value
//     return this
//   }
//   blink(value: boolean) {
//     this.el.props.blink = value
//     return this
//   }
//   invisible(value: boolean) {
//     this.el.props.invisible = value
//     return this
//   }
// }

// class StyleChain <E extends ProgramElement = ProgramElement> extends AttrsChain<E> {

//   width(value: number): this {
//     this.el.props.width = value
//     return this
//   }

//   height(value: number): this {
//     this.el.props.height = value
//     return this
//   }

//   top(value: number): this {
//     this.el.props.top = value
//     return this
//   }

//   left(value: number): this {
//     this.el.props.left = value
//     return this
//   }

//   textWrap(value: boolean): this {
//     this.el.props.textWrap = value
//     return this
//   }

//   padding(value: Padding): this {
//     this.el.props.padding = value
//     return this
//   }
//   layout(value: LayoutOptions): this {
//     this.el.props.layout = value
//     return this
//   }

//   border(value: Partial<BorderProps>): this {
//     this.el.props.border = value
//     return this
//   }

//   noFill(value: boolean): this {
//     this.el.props.noFill = value
//     return this
//   }
// }

// class ElementChain  <E extends ProgramElement = ProgramElement>  extends StyleChain<E> {

//   focusable(value: boolean): this {
//     this.el.props.focusable = value
//     return this
//   }
//   focused(value: boolean): this {
//     this.el.props.focused = value
//     return this
//   }
//   overflow(value: 'visible' | 'hidden'): this {
//     this.el.props.overflow = value
//     return this
//   }
//   preventChildrenCascade(value: boolean): this {
//     this.el.props.preventChildrenCascade = value
//     return this
//   }
//   preventSiblingCascade(value: boolean): this {
//     this.el.props.preventSiblingCascade = value
//     return this
//   }

//   input(value: string): this {
//     this.el.props.input = value
//     return this
//   }

//   value(value: string): this {
//     this.el.props.value = value
//     return this
//   }

//   afterRenderWithoutChildren(value: () => (boolean)): this {
//     this.el.props.afterRenderWithoutChildren = value
//     return this
//   }

//   afterRender(value: () => (boolean)): this {
//     this.el.props.afterRender = value
//     return this
//   }

//   beforeRender(value: () => (boolean)): this {
//     this.el.props.beforeRender  = value
//     return this
//   }

//   childrenReady(value: () => (boolean)): this {
//     this.el.props.childrenReady  = value
//     return this
//   }

//   onClick<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onClick  = value
//     return this
//   }

//   onKeyPressed<T extends ProgramElement= ProgramElement>(value: (e: KeyEvent<T>) => (void | boolean)): this {
//     this.el.props.onKeyPressed  = value as any
//     return this
//   }

//   onMouse<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onMouse  = value
//     return this
//   }
//   onMouseOut<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onMouseOut  = value
//     return this
//   }
//   onMouseOver<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onMouseOver  = value
//     return this
//   }
//   onMouseDown<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onMouseDown  = value
//     return this
//   }
//   onWheelDown<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onWheelDown  = value
//     return this
//   }
//   onWheelUp<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onWheelUp  = value
//     return this
//   }
//   onMouseMove<T extends ProgramElement= ProgramElement>(value: (r: MouseEvent<T>) => (void | boolean)): this {
//     this.el.props.onMouseMove  = value
//     return this
//   }

//   onBlur(value: (e: BlurEvent) => (void | boolean)): this {
//     this.el.props.onBlur  = value
//     return this
//   }
//   onFocus(value: (e: FocusEvent) => (void | boolean)): this {
//     this.el.props.onFocus  = value
//     return this
//   }

//   /**
//    * Custom element draw function. Can be declared by subclasses that need custom drawing method. If declared,
//    * the content and border won't be rendered, and implementation is responsible of them.
//    */
//   render(value: (renderer: ProgramDocumentRenderer) => void): this {
//     this.el.props.render  = value
//     return this
//   }

//   /**
//    * Custom element content draw function. Can be declared by subclasses that need custom content drawing
//    * method. If declared, the content   won't be rendered but the border will. The implementation is
//    * responsible of drawing the content.
//    */
//   renderContent(value: (renderer: ProgramDocumentRenderer) => void): this {
//     this.el.props.renderContent  = value
//     return this
//   }

//   /**
//    * Custom element content draw function. Can be declared by subclasses that need custom content drawing
//    * method. If declared, the content   won't be rendered but the border will. The implementation is
//    * responsible of drawing the content.
//    */
//   renderBorder(value: (renderer: ProgramDocumentRenderer) => void): this {
//     this.el.props.renderBorder  = value
//     return this
//   }

//   /**
//    * Custom element children draw function. Children are both elements and text. Can be declared by subclasses
//    * that need custom children drawing method. If declared, children   won't be rendered but the content and
//    * border will. The implementation is responsible of drawing the children.
//    */
//   renderChildren(value: (renderer: ProgramDocumentRenderer) => void): this {
//     this.el.props.renderChildren  = value
//     return this
//   }
// }

// class YogaChain extends ElementChain<YogaElement> {

// }
