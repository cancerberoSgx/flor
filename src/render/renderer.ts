import { array } from 'misc-utils-of-mine-generic'
import { inspect } from 'util'
import * as wrap from 'word-wrap'
import { Program, ProgramOptions } from '../declarations/program'
import { Node } from '../dom'
import { isText } from '../dom/nodeUtil'
import { TextNode } from '../dom/text'
import { isElement } from '../programDom'
import { ProgramElement } from '../programDom/programElement'
import { PAttrs } from '../programDom/styleProps'
import { Attrs, ElementProps } from '../programDom/types'
import { debug } from '../util'
import { BorderSide, BorderStyle, getBoxStyleChar } from '../util/border'
import { trimRightLines } from '../util/misc'
import { createProgram, destroyProgram } from '../util/util'

export interface RendererOptions {
  program?: Program
  /**
   * Program options for if I have to create it
   */
  programOptions?: ProgramOptions
  noBuffer?: boolean
}

/**

# Property Propagation

See spec/rendererCascadeSpec.ts

There are two modes in which properties can be propagated across the element's document: 

 * from parent to children, or 
 * from sibling to next sibling. 

This behavior can be customized using [[renderElement]] options parameter or using Element's [[preventChildrenCascade]] and [[preventSiblingCascade]] properties in element definitions. This means that you can have different policies declared for different fragments of the document is needed. 

Below are the different behaviors supported currently: 

## `{  preventChildrenCascade: false,  preventSiblingCascade: true  } `

This is the default behavior. Properties are propagated like in HTML/CSS, only from parent to children, never from sibling to next sibling. This configuration is declared:

## `{ preventChildrenCascade: false,  preventSiblingCascade: false }`

If both are false properties will be propagated both from parent to children and from sibling to next sibling. The base props for an element will be the mix between its parent's and its previous sibling's. The parent's has priority and of course element's own property declarations will override any of these. 

## `{ preventChildrenCascade: true,  preventSiblingCascade: false }`

Then base props for an element will be [[currentAttrs]], this is, the state of the attrs that previous siblings (and descendants) leave in the renderer instance. If the previous sibling declared a border or background, then the next sibling will have that border or background by default. 

## `{ preventChildrenCascade: true,  preventSiblingCascade: true }`
   * if both If [[preventChildrenCascade]] and [[[preventSiblingCascade]] are true, then there will be no property propagation at all. The base props for an element will always be [[defaultAttrs]] and this means elements will always need to declare **all** its properties explicitly.

 */
interface RenderElementOptions {
  /**
   * Default value is `false`. in which case, children inherits its parent properties, declared or not declared. If `true`, children won't inherits parent's properties. See [[RenderElementOptions]] description for details..
   */
  preventChildrenCascade?: boolean
  /**
   * Default value: `true` in which an element's properties are totally independent on the properties of its siblings. If `false`, properties defined by previous siblings or their descendants will be propagated to the element. See [[RenderElementOptions]] description for details.
   * 
   */
  preventSiblingCascade?: boolean
}


/**
 * Responsibilities:
 *
 *  * implements property propagation through elements in the document. See [[RenderElementOptions]].
 *  * Knows how to render an element's content to the screen using a [[Program]] instance.
 *   * fill the element with appropriate attrs
 *   * draw element's borders,
 *   * draw element's children (text nodes and Elements),
 *   * in the proper order.
 *   * erase the element
 *  * Apply and keep track of elements character attributes
 *  *  implements the attrs cascading policy
 *  * maintains an internal buffer with each screen pixel character attribute so it's capable of reconstitute
 *    the screen at any moment ([[printElement]])
 */
export class ProgramDocumentRenderer {
  private useBuffer: boolean
  private _program: Program
  private buffer: PAttrs[][] = []
  private _defaultAttrs: Attrs
  private _currentAttrs: Attrs
  private _defaultRenderOptions: RenderElementOptions = {
    preventSiblingCascade: true,
    preventChildrenCascade: false
  }

  constructor(options: RendererOptions) {
    this._program = options.program || createProgram(options.programOptions)
    this.useBuffer = !options.noBuffer || true
    this._defaultAttrs = {
      bg: '#1e1e1e',
      fg: 'white',
      bold: false,
      invisible: false,
      underline: false,
      standout: false,
      ch: ' ',
      blink: false
    }
    this._currentAttrs = { ...this._defaultAttrs }
    this.resetAttrs()
    this.resetBuffer()
  }

  /**
   * Gets the program instance associated with this renderer.
   */
  public get program(): Program {
    return this._program
  }

  /**
   * Destroys this renderer instance, the program associated with it and, reset's the internal buffer and
   * styles.
   */
  destroy() {
    this.resetAttrs()
    this.resetBuffer()
    destroyProgram(this.program)
  }

  /**
   * Fill the entire screen with given character and current attrs.
   */
  fillAll(ch = ' ') {
    this.fillRectangle(0, 0, this.program.rows, this.program.cols, ch)
  }

  /**
   * Clean up the internal [[buffer]].
   */
  resetBuffer() {
    if (this.useBuffer) {
      this.buffer = array(this._program.rows).map(c => array(this._program.cols).map(c => ({ ...this._currentAttrs })))
    }
  }

  /**
   * The [[buffer]] should contain the same content as what's displayed currently in the screen. Useful for
   * tests.
   */
  printBuffer(linesTrimRight?: boolean) {
    const s = this.buffer.map(l => l.map(l => l.ch).join('')).join('\n')
    return linesTrimRight ? trimRightLines(s) : s
  }

  /**
   * Perform an action without modifying the buffer.
   */
  bypassingBuffer(f: () => void) {
    const current = this.useBuffer
    this.useBuffer = false
    f()
    this.useBuffer = current
  }

  /**
   * Writes given string at given coordinates.
   *
   * IMPORTANT: all writings to program.output must be performed using this method, otherwise some features or
   * tests could fail.
   */
  write(y: number, x: number, s: string) {
    this._program.cursorPos(y, x)
    this._program._write(s)
    if (this.useBuffer) {
      for (let i = 0; i < s.length; i++) {
        if (this.buffer[y]) {
          this.buffer[y][x + i] = { ch: s[i], bg: this._currentAttrs.bg || '', fg: this._currentAttrs.fg || '' }
        }
      }
    }
  }

  private lastAbsLeft: number = 0
  private lastAbsTop: number = 0
  private renderCounter = 0



  /**
   * Writes the escape characters so given attributes are applied (enabled or disabled). String properties are
   * only applied if not falsy. Boolean properties are applied only if not undefined.
   */
  setAttrs(props: PAttrs) {
    if (props.bg && props.bg !== this._currentAttrs.bg) {
      this._program.bg(props.bg)
      this._currentAttrs.bg = props.bg
    }
    if (props.fg && props.fg !== this._currentAttrs.fg) {
      this._program.fg(props.fg)
      this._currentAttrs.fg = props.fg
    }
    if (typeof props.invisible !== 'undefined' && props.invisible !== this._currentAttrs.invisible) {
      this._program.charAttributes('invisible', props.invisible)
      this._currentAttrs.invisible = props.invisible
    }
    if (typeof props.bold !== 'undefined' && props.bold !== this._currentAttrs.bold) {
      this._program.charAttributes('bold', props.bold)
      this._currentAttrs.bold = props.bold
    }
    if (typeof props.blink !== 'undefined' && props.blink !== this._currentAttrs.blink) {
      this._program.charAttributes('blink', props.blink)
      this._currentAttrs.blink = props.blink
    }
    if (typeof props.underline !== 'undefined' && props.underline !== this._currentAttrs.underline) {
      this._program.charAttributes('underline', props.underline)
      this._currentAttrs.underline = props.underline
    }
    if (typeof props.standout !== 'undefined' && props.standout !== this._currentAttrs.standout) {
      this._program.charAttributes('standout', props.standout)
      this._currentAttrs.standout = props.standout
    }
    if (typeof props.ch !== 'undefined' && props.ch.length && props.ch !== this._currentAttrs.ch) {
      this._currentAttrs.ch = props.ch[0]
    }
  }

  /**
   * Reset [[currentAttrs]] to [[defaultAttrs]] and apply it to the program.
   */
  resetAttrs() {
    this._currentAttrs = { ...this._defaultAttrs }
    this.setAttrs(this._defaultAttrs)
  }

  /**
   * Default character attributes and 'ch' string to fill.
   */
  public get defaultAttrs(): Attrs {
    return this._defaultAttrs
  }
  public set defaultAttrs(value: Attrs) {
    this._defaultAttrs = value
  }

  /**
   * Current character attributes. As elements are rendered,[[currentAttrs]] are modified according to the
   * element's attrs, so modifying this object the current character attribute status can be manipulated
   * programmatically, for example, before rendering children or siblings, etc.
   */
  public get currentAttrs(): Attrs {
    return this._currentAttrs
  }
  public set currentAttrs(value: Attrs) {
    this._currentAttrs = value
  }




  /**
   * Main public function to render given element in the screen. Element's props character attributes will me
   * merged with [[currentAttrs]] and that will be used to render the element's pixels.
   */
  renderElement(el: ProgramElement
    , options: RenderElementOptions & {__onRecursion?: boolean} = this._defaultRenderOptions
    ) {
    el._beforeRender()
    const preventChildrenCascadeOriginal = options.preventChildrenCascade
    Object.assign(options, {
      preventChildrenCascade: typeof el.props.preventChildrenCascade === 'undefined' ? options.preventChildrenCascade : el.props.preventChildrenCascade,
      preventSiblingCascade: typeof el.props.preventSiblingCascade === 'undefined' ? options.preventSiblingCascade : el.props.preventSiblingCascade })
    // if (typeof preventChildrenCascadeOriginal !== 'undefined') {
    //     options.preventChildrenCascade = preventChildrenCascadeOriginal
    //   }
    this.renderElementWithoutChildren(el, options)
    el._afterRenderWithoutChildren()
    if (el.props.renderChildren) {
      el.props.renderChildren(this)
    } else {
      this.lastAbsLeft = el.absoluteContentLeft
      this.lastAbsTop = el.absoluteContentTop
      Array.from(el.childNodes).forEach((c, i, a) => {
        if (c instanceof TextNode) {
          if (el.props.renderChildText) {
            el.props.renderChildText(this, c, i)
          } else {
            this.renderText(c, a[i + 1])
          }
        } else if (c instanceof ProgramElement) {
          if (el.props.renderChildElement) {
            el.props.renderChildElement(this, c, i)
          } else {
            this.renderElement(c, { ...options, __onRecursion: true })
          }
        } else {
          debug('Element type invalid: ' + inspect(c))
        }
      })
    }
    el._afterRender()
    el._renderCounter = this.renderCounter++
    return el
  }

  protected renderText(c: TextNode, nextNode: Node) {
    // TODO: correct char width for unicode.
    let s = (c.textContent || '')
    const parent = c.parentNode as ProgramElement
    if (parent.props.textWrap) {
      const cutIndex = Math.min(s.length, this.lastAbsLeft - parent.absoluteContentLeft)
      const s1 = s.substring(0, cutIndex)
      const s2 = s.substring(cutIndex, s.length)
      if (s1) {
        this.write(this.lastAbsTop, this.lastAbsLeft, s1)
        this.lastAbsTop = this.lastAbsTop + 1
        this.lastAbsLeft = parent.absoluteContentLeft
      }
      wrap(s2.replace(/\n/g, ' '), { width: parent.contentWidth - 1 }).split('\n').map(l => l.trim()).forEach(l => {
        if (s1) {
        }
        this.write(this.lastAbsTop, this.lastAbsLeft, l)
        this.lastAbsTop = this.lastAbsTop + 1
        this.lastAbsLeft = parent.absoluteContentLeft
      })
    } else {
      const nextChildIsText = isText(nextNode)
      // Heads up : if next child is also text, we keep writing on the same line, if not, on a new  line.
      this.write(this.lastAbsTop, this.lastAbsLeft, s)
      this.lastAbsLeft = this.lastAbsLeft + (nextChildIsText ? s.length : 0)
      this.lastAbsTop = this.lastAbsTop + (nextChildIsText ? 0 : 1)
    }
  }

  /**
   * Renders just the content area of this element and its borders, without children elements or text.
   */
  renderElementWithoutChildren(el: ProgramElement  , options: RenderElementOptions & {__onRecursion?: boolean} = this._defaultRenderOptions) {

    const attrs: Partial<ElementProps> =  {
      ...(options.preventChildrenCascade || options.preventSiblingCascade) ? this._defaultAttrs : {},
      ...!options.preventSiblingCascade ? this._currentAttrs : {},
      ...!options.preventChildrenCascade ? (isElement(el.parentNode) ? el.parentNode.props.data : {}) : {},
      ...el.props.data
    }

    if (el.props.render) {
      el.props.render(this)
      return
    }
    if (el.props.renderContent) {
      el.props.renderContent(this)
    } else {
      if (!attrs.noFill) {
        this.setAttrs(attrs) // TODO: merge with all ancestors ? or there should bealready merged ? 
        let yi = el.absoluteContentTop - (el.props.padding ? el.props.padding.top : 0)
        let xi = el.absoluteContentLeft - (el.props.padding ? el.props.padding.left : 0)
        let width = el.contentWidth + (el.props.padding ? el.props.padding.left + el.props.padding.right : 0)
        let height = el.contentHeight + (el.props.padding ? el.props.padding.top + el.props.padding.bottom : 0)
        // let y0 = yi
        if(isElement(el.parentNode) && el.parentNode.props.overflow && el.parentNode.props.overflow!=='visible') {
          
          height = el.absoluteTop + height > el.parentNode.absoluteContentTop + el.parentNode.contentHeight ? el.parentNode.absoluteContentTop + el.parentNode.contentHeight - el.absoluteTop : height
          

          width = el.absoluteLeft + width > el.parentNode.absoluteContentLeft + el.parentNode.contentWidth ? el.parentNode.absoluteContentLeft + el.parentNode.contentWidth - el.absoluteLeft : width
          
          // y0 = el.parentNode.absoluteContentTop>


          // xi = el.parentNode.absoluteContentLeft
          if(xi < el.parentNode.absoluteContentLeft){
            width = width - (el.parentNode.absoluteContentLeft - xi)
            xi = el.parentNode.absoluteContentLeft;
            (attrs as any).xi = xi
          }
          if(yi < el.parentNode.absoluteContentTop){
            height = height - (el.parentNode.absoluteContentTop - yi)
            yi = el.parentNode.absoluteContentTop;
            (attrs as any).yi = yi
          }
          attrs.height=height
          attrs.width=width;
      // xi =  ?  xi + el.parentNode.absoluteContentLeft - xi : xi
        }
        for (let i = 0; i < height; i++) {
          // if(yi+i>=y0  ){
            this.write(yi + i, xi, this._program.repeat(el.props.ch || this._currentAttrs.ch, width))
          // }
        }
      }
    }
    if (el.props.renderBorder) {
      el.props.renderBorder(this)
    } else {
      this.drawElementBorder(el, attrs)
    }
  }

  /**
   * Writes [[currentAttrs]] in all pixels of the area of given el.
   */
  eraseElement(el: ProgramElement): any {
    this.setAttrs(this._defaultAttrs)
    this.fillRectangle(el.absoluteTop, el.absoluteLeft, el.props.height, el.props.width)
  }

  /**
   * Writes given [[ch]] with [[currentAttrs]] in all pixels of given rectangle.
   */
  fillRectangle(top: number, left: number, height: number, width: number, ch = this._currentAttrs.ch) {
    for (let i = 0; i < height; i++) {
      this.write(top + i, left, this._program.repeat(ch, width))
    }
  }

  /**
   * Draw given element's border.
   */
  protected drawElementBorder(el: ProgramElement, elProps: Partial<ElementProps> = el.props.data) {
    const border = elProps.border
    if (!border) {
      return
    }
    const type = border.type || BorderStyle.light
    this.setAttrs({ ...elProps, ...border })
    const { xi, xl, yi, yl } = {
      xi: (elProps as any).xi ||el.absoluteLeft,
      xl: ((elProps as any).xi||el.absoluteLeft) + (elProps.width || el.props.width),
      yi: (elProps as any).yi || el.absoluteTop,
      yl: ((elProps as any).yi||el.absoluteTop) + (elProps.height || el.props.height)
    }
    this.write(yi, xi, getBoxStyleChar(type, BorderSide.topLeft))
    this.write(yi, xl - 1, getBoxStyleChar(type, BorderSide.topRight))
    this.write(yl - 1, xi, getBoxStyleChar(type, BorderSide.bottomLeft))
    this.write(yl - 1, xl - 1, getBoxStyleChar(type, BorderSide.bottomRight))
    for (let j = yi + 1; j < yl - 1; j++) {
      this.write(j, xi, getBoxStyleChar(type, BorderSide.left))
      this.write(j, xl - 1, getBoxStyleChar(type, BorderSide.right))
    }
    for (let i = xi + 1; i < xl - 1; i++) {
      this.write(yi, i, getBoxStyleChar(type, BorderSide.top))
      this.write(yl - 1, i, getBoxStyleChar(type, BorderSide.bottom))
    }
  }

}
