import { array } from 'misc-utils-of-mine-generic'
import { inspect } from 'util'
import { Program, ProgramOptions } from '../declarations/program'
import { Node } from '../dom'
import { isText } from '../dom/nodeUtil'
import { TextNode } from '../dom/text'
import { ProgramElement } from '../programDom/programElement'
import { PAttrs } from '../programDom/styleProps'
import { Attrs } from '../programDom/types'
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
  protected write(y: number, x: number, s: string) {
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
    this.lastAbsLeft = el.absoluteContentLeft,
    this.lastAbsTop = el.absoluteContentTop
    Array.from(el.childNodes).forEach((c, i, a) => {
      if (c instanceof  TextNode) {
        // TODO: word wrap, correct char width for unicode.
        this.renderText(c, a[i + 1])
      } else if (c instanceof ProgramElement) {
        this.renderElement(c)
      } else {
        debug('Element type invalid: ' + inspect(c))
      }
    })
    el._afterRender()
    el._renderCounter = this.renderCounter ++
    return el
  }

  protected renderText(c: TextNode, nextNode: Node) {
    const s = c.textContent || ''
    this.write(this.lastAbsTop,this.lastAbsLeft, s)
    // Heads up : if next child is also text, we keep writing on the same line, if not, on a new  line.
    const nextChildIsText = isText(nextNode)
    this.lastAbsLeft = this.lastAbsLeft + (nextChildIsText ? s.length : 0)
    this.lastAbsTop = this.lastAbsTop + (nextChildIsText ? 0 : 1)
  }

  renderElementWithoutChildren(el: ProgramElement) {
    this.setStyle(el.props)
    const yi = el.absoluteContentTop - (el.props.padding ? el.props.padding.top : 0)
    const xi = el.absoluteContentLeft - (el.props.padding ? el.props.padding.left : 0)
    const width = el.contentWidth + (el.props.padding ? el.props.padding.left + el.props.padding.right : 0)
    const height = el.contentHeight + (el.props.padding ? el.props.padding.top + el.props.padding.bottom : 0)
    for (let i = 0; i < height; i++) {
      this.write(yi + i, xi, this._program.repeat(el.props.ch || this.currentAttrs.ch, width))
    }
    this.drawElementBorder(el)
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
    if (props.bg) {
      this._program.bg(props.bg)
      if (this.useBuffer) {
        this.currentAttrs.bg = props.bg
      }
    }
    if (props.fg) {
      this._program.fg(props.fg)
      if (this.useBuffer) {
        this.currentAttrs.fg = props.fg
      }
    }
  }

  resetStyle() {
    this.currentAttrs = { ...this.defaultStyle }
    this.setStyle(this.defaultStyle)
  }

  private drawElementBorder(el: ProgramElement) {
    const border = el.props.border
    if (!border) {
      return
    }
    const type = border.type || BorderStyle.light
    this.setStyle({ ...el.props , ...border })
    const { xi, xl, yi, yl } = { xi: el.absoluteLeft,
      xl: el.absoluteLeft + el.props.width ,
      yi: el.absoluteTop,
      yl: el.absoluteTop + el.props.height
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
