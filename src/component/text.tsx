import * as yoga from 'yoga-layout';
import { isText } from '../dom/nodeUtil';
import { Component, Flor } from '../jsx';
import { ProgramDocumentRenderer } from '../manager';
import { ElementProps, ProgramDocument } from '../programDom';
import { array } from 'misc-utils-of-mine-generic';

interface TextProps extends Partial<ElementProps> {
  children?: string[]
}

/**
 * Component specialized on rendering text.
 */
export class Text extends Component<TextProps, {}> {

  protected yNode: yoga.YogaNode | undefined
  protected words: string[]|undefined

  constructor(p: TextProps, s: {}) {
    super(p, s)
    this.renderChildren = this.renderChildren.bind(this)
  }

  protected renderChildren(r: ProgramDocumentRenderer) {
    if (!this.yNode) {
      this.yNode = yoga.Node.create();
      this.yNode.setWidth(this.element!.contentWidth);
      this.yNode.setHeight(this.element!.contentHeight);
      this.yNode.setFlexWrap(yoga.WRAP_WRAP)
      this.yNode.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
    }
    if(!this.words){
      this.words = Array.from(this.element!.childNodes).filter(isText).map(t => t.textContent).join(' ').split(' ')
      this.words.forEach((l, i) => {
        const node = yoga.Node.create();
        node.setWidth(l.length + 1);
        node.setHeight(1);
        this.yNode!.insertChild(node, i)
      })
    }
    this.yNode.calculateLayout(this.element!.contentWidth, this.element!.contentHeight, yoga.DIRECTION_LTR)
    array(this.yNode.getChildCount()).forEach(i => {
      const c = this.yNode!.getChild(i)
      const l  =c.getComputedLayout()
      this.renderer!.write(this.element!.absoluteContentTop+l.top, this.element!.absoluteContentLeft+l.left, this.words![i])
    })
  }

  render() {
    return <box {...this.props} renderChildren={this.renderChildren}>{this.props.children}</box>
  }

}

export function text(props: TextProps & { document: ProgramDocument }) {
  return Flor.render(<Text {...props} />, { document: props.document })
}
