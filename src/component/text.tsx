import { array } from 'misc-utils-of-mine-generic'
import * as yoga from 'yoga-layout'
import { ElementProps } from '..'
import { isDomText } from '../dom/nodeUtil'
import { Component, Flor } from '../jsx'
import { ProgramDocumentRenderer } from '../manager'

interface TextProps extends Partial<ElementProps> {
  children?: string[]
  /**
   * Word direction. If 'column' words will be printed as columns instead of rows from top to bottom. In other words lines are represented with columns. Default value is 'row'
   */
  direction?: 'row' | 'column'
  /**
   * Adds extra width to words. For example, in 'row' direction, extraWidth===1 will separate words with 1 space. Default value 1
   */
  extraWidth?: number
  /**
   * Adds extra height for words, which by default is 1. For example, in 'row' direction, extraWidth===1 will make lines be separated by 1 row.
   */
  extraHeight?: number
  /**
   * How should words be aligned/justified. Default: top.
   */
  wordsAlign?: 'left' | 'right' | 'center' | 'justify'

  /**
   * How should lines be aligned/justified. Default: top.
   */
  linesAlign?: 'top' | 'bottom' | 'center'
}

/**
 * Component specialized on rendering text.
 *
 * TODO:
 *  * update when textContent changes
 *  * update when bounds change
 *  * getters and setters for wordsAlign, linesAlign,
 */
export class Text extends Component<TextProps, {}> {

  protected yNode: yoga.YogaNode | undefined
  protected words: string[] | undefined
  protected calculateLayout: boolean

  constructor(p: TextProps, s: {}) {
    super(p, s)
    this.renderChildren = this.renderChildren.bind(this)
    this.beforeRender = this.beforeRender.bind(this)
    this.calculateLayout = true
  }

  protected beforeRender() {
    this.calculateLayout = !this.yNode || !this.words || this.element!._boundsDirty
    return false
  }

  protected renderChildren(r: ProgramDocumentRenderer) {
    if (!this.yNode) {
      this.yNode = yoga.Node.create()
      this.yNode.setFlexWrap(yoga.WRAP_WRAP)
      this.yNode.setFlexDirection(this.props.direction === 'column' ? yoga.FLEX_DIRECTION_COLUMN : yoga.FLEX_DIRECTION_ROW)
      const justifyContent = this.props.wordsAlign === 'right' ? yoga.JUSTIFY_FLEX_END : this.props.wordsAlign === 'center' ? yoga.JUSTIFY_CENTER : this.props.wordsAlign === 'justify' ? yoga.JUSTIFY_SPACE_BETWEEN : yoga.JUSTIFY_FLEX_START
      this.yNode.setJustifyContent(justifyContent)
      const alignItems = this.props.linesAlign === 'center' ? yoga.ALIGN_CENTER : this.props.linesAlign === 'bottom' ? yoga.ALIGN_FLEX_END : yoga.ALIGN_FLEX_START
      this.yNode.setAlignContent(alignItems)
    }
    if (!this.words) {
      this.words = Array.from(this.element!.childNodes).filter(isDomText).map(t => t.textContent).join(' ').split(' ')
      this.words.forEach((l, i) => {
        const node = yoga.Node.create()
        node.setWidth(l.length + (this.props.extraWidth || 1))
        node.setHeight(1 + ((this.props.extraHeight || 0)))
        this.yNode!.insertChild(node, i)
      })
    }
    if (this.calculateLayout) {
      this.yNode.setWidth(this.element!.contentWidth)
      this.yNode.setHeight(this.element!.contentHeight)
      this.yNode.calculateLayout(this.element!.contentWidth, this.element!.contentHeight, yoga.DIRECTION_LTR)
    }
    // TODO: if text changed we should extract words again and recalculate
    array(this.yNode.getChildCount()).forEach(i => {
      const c = this.yNode!.getChild(i)
      const l = { top: c.getComputedTop(), left: c.getComputedLeft() }
      this.renderer!.write(this.element!.absoluteContentTop + l.top, this.element!.absoluteContentLeft + l.left, this.words![i])
    })
  }

  render() {
    return <el {...this.props} renderChildren={this.renderChildren} beforeRender={this.beforeRender}>{this.props.children}</el>
  }

}

export function text(props: TextProps) {
  return Flor.render(<Text {...{ ...props, children: undefined }}>{props.children}</Text>)
}
