// import { keys } from '../declarations/keys'
// import { Component, Flor } from '../jsx'
// import { KeyEvent, KeyPredicate, ProgramDocumentRenderer } from '../manager'
// import { ElementProps, ProgramDocument, ProgramElement, Rectangle } from '../programDom'
// import { RemoveProperties, trimRightLines } from 'misc-utils-of-mine-generic';
// import { isString } from 'util';
// import { ScrollHandlerProps, defaultScrollHandleProps } from './scrollable';
// import { debug } from '../util';

// interface TextProps extends Partial<ElementProps>, ConcreteTextProps {

//   children?: string[]
// }
// interface ConcreteTextProps extends ScrollHandlerProps {
//   /**
//    * defaults 'none
//    */
//   align?: Align
//   xOffset?: number
//   yOffset?: number
//   text?: string
//   childrenTextSeparator?: string
//   trimChildrenText?: boolean

//   /**
//    * The string used to to split original text in lines. default: '\n
//    */
//   newLineString?: string
//   /**
//    * if true lines words will wrapped to fit parent's content width (inside the parent's padding area.)
//    */
//   wordWrapToParentContentWidth?: boolean,
//   /**
//  * Wil wrapp lines words but to a custom width that could be greater than the parent's Width.
//  */
//   wordWrapToWidth?: number,
//   /**
//    * If word-wrap is true, a fixed text at the beginning of each line:
//    */
//   textPaddingLeft?: number
//   /**
//   * If word-wrap is true, a fixed text at the end of each line:
//   */
//   textPaddingRight?: number
//   /**
//    * a function to map each line before rendered
//    */
//   mapLine?: (l: string) => string
// }

// enum Align {
//   'left' = 'left', 'right' = 'right', 'center' = 'center', 'none' = 'none'
// }

// /**
//  * component specialized on rendering text. Render text character by character in a controlled rectangular grid and apply any transformation like wrap, etc here and not in renderer.
//  *
//  * Uses https://github.com/jonschlinkert/word-wrap for word-wrap
//  * * Mix with Imput to have a text area or multi line editor.
//  *
//  * TODO: ChangingText extends Text using superstring or similarto support ranges, changes, diff and patches.
//  */
// export class Text extends Component<TextProps, {}> {
//   protected _textDirty = true
//   protected xOffset: number
//   protected yOffset: number
//   protected viewport: Rectangle
//   protected lines: string[] = []
//   _linesInitialized = false

//   protected defaultProps: Required<ConcreteTextProps> = {
//     ...defaultScrollHandleProps(),
//     align: Align.none,
//     wordWrapToWidth: 0,
//     mapLine: l => l,
//     xOffset: 0,
//     yOffset: 0,
//     textPaddingLeft: 0,
//     textPaddingRight: 0,
//     text: '',
//     childrenTextSeparator: ' ',
//     trimChildrenText: false,
//     wordWrapToParentContentWidth: false,
//     newLineString: '\n'
//   }
//   W: number = -Infinity
//   L: number = 0

//   constructor(p: TextProps, s: {}) {
//     super(p, s)
//     this.p = { ...this.defaultProps, ...this.props }
//     this.xOffset = 0
//     this.yOffset = 0
//     this.viewport = { xi: +Infinity, yi: +Infinity, xl: -Infinity, yl: -Infinity }
//     this.renderChildren = this.renderChildren.bind(this)
//   }

//   // if called the text layout will be updated from the text props or if none from children node text.
//   textChanged() {
//     throw 'not impl'
//   }

//   /**
//    * Called from rendered to render our children. Delegates to [[_renderChildren]].
//    */
//   protected renderChildren(r: ProgramDocumentRenderer) {
//     if (this._textDirty) {
//       this.processText()
//     }
//     const xi = this.element!.absoluteContentLeft+this.xOffset
//    const yi =  this.element!.absoluteContentTop+this.yOffset
//       for (let i = 0; i < this.L; i++) {
//         this.renderer!.write(yi+i, xi, this.lines[i])
//     }
//     this.renderer!.renderElementBorder(this.element!)
//   }
//   protected processText(): any {
//     // we need to calculate all the content in case align is not 'none' or 'left'.
//     // TODO: we recalculate everything - could be optimizae for 'none' or 'left'.

//     if (!this._linesInitialized) {
//       this.initLines()
//     }

//     //TODO. if this.props.noFill and this.props.align==='none we dont need to get longest line or fill anything

//     this.L = this.lines.length
//     if (this.L === 0) {
//       return
//     }
//     // get the longest line
//     this.W = -Infinity
//     let aux = 0
//     for (let i = 0; i < this.L; i++) {
//       if (this.W < (aux = this.lines[i].length)) {
//         this.W = aux
//       }
//     }

//     const ch = this.element!.props.ch || this.renderer!.defaultAttrs.ch
//     // const xi = this.element!.absoluteContentLeft+this.xOffset
//     // this.renderer!.write(i, xi, l)
//     // const H = this.element!.absoluteContentTop+this.element!.contentHeight
//     // const yi = this.element!.absoluteContentTop+this.yOffset

//     // HEADS UP : we force all lines to havce same width - performance ? but code is safer and easier.

//     for (let i = 0; i <this.L; i++) {
//       this.lines[i]= (this.lines[i] || '').padEnd(this.W, ch)
//       // TODO : to support aligns we fill padd or right or both depending on the align. TODO
//       //TODO performance, we could write() here the line and save one iteration but for the sake of simplicity are not:
//     }
//     // this.program!.lin

//     this._textDirty = false
//   }
//   /**
//    * will extract text from children and remove them so we handle only as a porperty
//    */
//   protected initLines() {
//     let childText = Array.from(this.element!.childNodes).map(c=>c.textContent+'')
//     // .map(c => this.p.trimChildrenText ? (c.textContent+'').trim() : c.textContent)//.filter(s=>s&& isString(s))
//     this.lines = childText.join(this.p.childrenTextSeparator).split(this.p.newLineString) // TDO: performance
//     this._linesInitialized = true
//   }

//   protected p: Required<ConcreteTextProps>

//   render() {
//     return <box  {...this.props} renderChildren={this.renderChildren}>{this.props.children}</box>
//   }

// }

// export function text(props: TextProps & { document: ProgramDocument }) {
//   return Flor.render(<Text {...props} />, { document: props.document })
// }
