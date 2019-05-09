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
  defaultChar?: string
}

export class ProgramDocumentRenderer {

  private useBuffer: boolean
  private _program: Program
  private buffer: PAttrs[][] = []
  private defaultStyle: Attrs
  private currentAttrs: Attrs

  constructor(options: RendererOptions) {
    // this.write = this.write.bind(this)
    // this.setStyle = this.setStyle.bind(this)
    this._program = options.program || createProgram(options.programOptions)
    this.useBuffer = !options.noBuffer || true
    this.defaultStyle = {
      bg: '#1e1e1e',
      // bg: 'black',
      fg: 'white',
      bold: false,
      invisible: false,
      underline: false,
      standout: false,
      ch: ' ',
      blink: false
    }
    this.currentAttrs = {      ...this.defaultStyle    }
    this.resetStyle()
    this.resetBuffer()
  }

  public get program(): Program {
    return this._program
  }

  destroy() {
    this.resetStyle()
    this.resetBuffer()
    destroyProgram(this.program)
  }

  fillAll(ch= ' ') {
    this.fillRectangle(0, 0, this.program.rows, this.program.cols, ch)
  }

  resetBuffer() {
    if (this.useBuffer) {
      this.buffer = array(this._program.rows).map(c => array(this._program.cols).map(c => ({ ...this.currentAttrs })))
    }
  }

  /**
   * The [[buffer]] should contain the same content as what's displayed currently in the screen. Useful for tests.
   */
  printBuffer(linesTrimRight?: boolean) {
    const s =  this.buffer.map(l => l.map(l => l.ch).join('')).join('\n')
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
   * All writes to program must be from here
   */
  write(y: number, x: number, s: string) {
    this._program.cursorPos(y, x)
    this._program._write(s)
    if (this.useBuffer) {
      for (let i = 0; i < s.length; i++) {
        if (this.buffer[y]) {
          this.buffer[y][x + i] = { ch: s[i], bg: this.currentAttrs.bg || '', fg: this.currentAttrs.fg || '' }
        }
      }
    }
  }

  private lastAbsLeft: number = 0
  private lastAbsTop: number = 0
  private renderCounter = 0

  renderElement(el: ProgramElement) {
    el._beforeRender()
    this.renderElementWithoutChildren(el)
    el._afterRenderWithoutChildren()
    if (el.props.renderChildren) {
      el.props.renderChildren(this)
    } else {
      this.lastAbsLeft = el.absoluteContentLeft,
      this.lastAbsTop = el.absoluteContentTop
      Array.from(el.childNodes).forEach((c, i, a) => {
        if (c instanceof  TextNode) {
          if (el.props.renderChildText) {
            el.props.renderChildText(this, c, i)
          } else {
            this.renderText(c, a[i + 1])
          }
        } else if (c instanceof ProgramElement) {
          if (el.props.renderChildElement) {
            el.props.renderChildElement(this, c, i)
          } else {
            this.renderElement(c)
          }
        } else {
          debug('Element type invalid: ' + inspect(c))
        }
      })
    }
    el._afterRender()
    el._renderCounter = this.renderCounter ++
    return el
  }

  protected renderText(c: TextNode, nextNode: Node) {
    // TODO: correct char width for unicode.
    let s = (c.textContent || '')
    const parent  = c.parentNode as ProgramElement
    if (parent.props.textWrap) {
      const cutIndex = Math.min(s.length,  this.lastAbsLeft - parent.absoluteContentLeft)
      const s1 = s.substring(0,cutIndex)
      const s2 = s.substring(cutIndex, s.length)
      if (s1) {
        this.write(this.lastAbsTop,this.lastAbsLeft, s1)
        this.lastAbsTop = this.lastAbsTop + 1
        this.lastAbsLeft = parent.absoluteContentLeft
      }
      wrap(s2.replace(/\n/g, ' '), { width: parent.contentWidth - 1 }).split('\n').map(l => l.trim()).forEach(l => {
        if (s1) {
        }
        this.write(this.lastAbsTop,this.lastAbsLeft, l)
        this.lastAbsTop = this.lastAbsTop + 1
        this.lastAbsLeft = parent.absoluteContentLeft
      })
    } else {
      const nextChildIsText = isText(nextNode)
      this.write(this.lastAbsTop,this.lastAbsLeft, s)
      this.lastAbsLeft = this.lastAbsLeft + (nextChildIsText ? s.length : 0)
      this.lastAbsTop = this.lastAbsTop + (nextChildIsText ? 0 : 1)
    }
    // Heads up : if next child is also text, we keep writing on the same line, if not, on a new  line.
  }

  renderElementWithoutChildren(el: ProgramElement) {
    const attrs: Partial<ElementProps> = { ...isElement(el.parentNode) ? el.parentNode.props.data : {}, ...el.props.data }
    if (el.props.render) {
      el.props.render(this)
      return
    }
    if (el.props.renderContent) {
      el.props.renderContent(this)
    } else {
      if (!attrs.noFill) {
        this.setStyle(attrs) // TODO: merge with all ancestors
        const yi = el.absoluteContentTop - (el.props.padding ? el.props.padding.top : 0)
        const xi = el.absoluteContentLeft - (el.props.padding ? el.props.padding.left : 0)
        const width = el.contentWidth + (el.props.padding ? el.props.padding.left + el.props.padding.right : 0)
        const height = el.contentHeight + (el.props.padding ? el.props.padding.top + el.props.padding.bottom : 0)
        for (let i = 0; i < height; i++) {
            this.write(yi + i, xi, this._program.repeat(el.props.ch || this.currentAttrs.ch, width))
          }
      }
    }
    if (el.props.renderBorder) {
      el.props.renderBorder(this)
    } else {
      this.drawElementBorder(el, attrs)
    }
  }

  eraseElement(el: ProgramElement): any {
    this.setStyle(this.defaultStyle)
    this.fillRectangle(el.absoluteTop, el.absoluteLeft, el.props.height, el.props.width)
  }

  fillRectangle(top: number, left: number, height: number, width: number, ch= this.currentAttrs.ch) {
    for (let i = 0; i < height; i++) {
      this.write(top + i, left, this._program.repeat(ch, width))
    }
  }

  setStyle(props: PAttrs) {
    if (props.bg && props.bg !== this.currentAttrs.bg) {
      this._program.bg(props.bg)
      // if (this.useBuffer) {
      this.currentAttrs.bg = props.bg
      // }
    }
    if (props.fg && props.fg !== this.currentAttrs.fg) {
      this._program.fg(props.fg)
      // if (this.useBuffer) {
      this.currentAttrs.fg = props.fg
      // }
    }
    if (typeof props.invisible !== 'undefined' && props.invisible !== this.currentAttrs.invisible) {
      this._program.charAttributes('invisible', props.invisible)
      // if (this.useBuffer) {
      this.currentAttrs.invisible = props.invisible
      // }
    }
    if (typeof props.bold !== 'undefined' && props.bold !== this.currentAttrs.bold) {
      this._program.charAttributes('bold', props.bold)
      // if (this.useBuffer) {
      this.currentAttrs.bold = props.bold
      // }
    }

  }

  resetStyle() {
    this.currentAttrs = { ...this.defaultStyle }
    this.setStyle(this.defaultStyle)
  }

  private drawElementBorder(el: ProgramElement, elProps: Partial<ElementProps> = el.props.data) {
    const border = elProps.border
    if (!border) {
      return
    }
    const type = border.type || BorderStyle.light
    this.setStyle({ ...elProps , ...border })
    const { xi, xl, yi, yl } = {
      xi: el.absoluteLeft,
      xl: el.absoluteLeft + (elProps.width || el.props.width) ,
      yi: el.absoluteTop,
      yl: el.absoluteTop + (elProps.height || el.props.height)
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
