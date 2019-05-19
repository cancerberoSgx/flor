import * as yoga from 'yoga-layout'
import { ProgramElement } from '..'
import { YogaElementProps } from './types'
import { YogaDocument } from './yogaDocument'
import { YogaElementPropsImpl } from './yogaProps'
import { debug } from '../util';
import { isElement } from '../programDom';

export class YogaElement extends ProgramElement {

  private _node: yoga.YogaNode = null as any

  props: YogaElementPropsImpl

  constructor(public readonly tagName: string, ownerDocument: YogaDocument) {
    super(tagName, ownerDocument)
    this.props = new YogaElementPropsImpl(undefined, this)
  }

  protected get node(): yoga.YogaNode {
    if (!this._node) {
      this._node = yoga.Node.create()
      this.setPropsToNode()
      setYogaProps(this.node, this.props)
      this.childNodes.filter(YogaElement.is).forEach((c, i) => {
        this.node.insertChild(c.node, i)
      })
    }
    return this._node
  }

  protected setPropsToNode(descendants?: boolean) {
    typeof this.getFlexWidth() !== 'undefined' && this.node.setWidth(this.getFlexWidth()!)
    typeof this.getFlexHeight() !== 'undefined' && this.node.setHeight(this.getFlexHeight()!)
    typeof this.getFlexLeft() !== 'undefined' && this.node.setPosition(yoga.EDGE_LEFT, this.getFlexLeft()!)
    typeof this.getFlexTop() !== 'undefined' && this.node.setPosition(yoga.EDGE_TOP, this.getFlexTop()!)
    // if(descendants){
    //   this.getChildrenElements().forEach(c=>c.setPropsToNode(descendants))
    // }
  }
  getChildrenElements() {
    return this.childNodes.filter(YogaElement.is)  
  }

  protected setYogaProps() {
    setYogaProps(this.node, this.props)
    this.childNodes.filter(YogaElement.is).forEach((c, i) => {
      c.setYogaProps()
    })
  }

  protected calculateLayout() {
    if (YogaElement.is(this.parentNode)) {
      this.left = this.node.getComputedLeft()
      this.top = this.node.getComputedTop()
      this.height = this.node.getComputedHeight()
      this.width = this.node.getComputedWidth()
      this.node.calculateLayout(isFinite(this.width) ? this.width : undefined, isFinite(this.height) ? this.height : undefined, this.props.direction)
    }
    else {
      // debugger
      debug('calculateLayout node ignored parent:',this.parentNode && this.parentNode.nodeTypeName, 'self: ', this.innerHTML)
    }
    this.childNodes.filter(YogaElement.is).forEach((c, i) =>
      c.calculateLayout()
    )
  }

  doLayout() {
    // if(this.__boundsDirty){
    //   this.setPropsToNode()
    // }
    this.setYogaProps()
    this.calculateLayout()
  }

  protected getFlexWidth(): number | undefined | string {
    if (this.props.widthPercent || this.props.widthAuto) {
      return undefined
    }
    return (this.width > 0 && this.width < 1) ? Math.trunc(this.width * 100) + '%' : isFinite(this.width) ? this.width : undefined
  }

  protected getFlexHeight(): number | undefined | string {
    if (this.props.heightPercent || this.props.heightAuto) {
      return undefined
    }
    return (this.height > 0 && this.height < 1) ? Math.trunc(this.height * 100) + '%' : isFinite(this.height) ? this.height : undefined
  }

  protected getFlexLeft(): string | number | undefined {
    return (this.left !== 0 && this.left > -1 && this.left < 1) ? Math.trunc(this.left * 100) + '%' : isFinite(this.left) ? this.left : undefined
  }

  protected getFlexTop(): string | number | undefined {
    return (this.top !== 0 && this.top > -1 && this.top < 1) ? Math.trunc(this.top * 100) + '%' : isFinite(this.top) ? this.top : undefined
  }

  static is(a: any): a is YogaElement {
    return a && a instanceof YogaElement && !!(a).yogaDebug
  }

  yogaDebug(): YogaLayoutInfo {
    return { ...this.node.getComputedLayout(), children: (this.childNodes).filter(YogaElement.is).map(e => e.yogaDebug()) }
  }

  get ownerDocument(): YogaDocument {
    return this._ownerDocument as YogaDocument
  }

  destroy() {
    // first free the children if not throws memory exception
    (this.childNodes).filter(YogaElement.is).forEach(c => c.destroy())
    this._node && this._node.free()
    this.ownerDocument._unregister(this)
  }

  /**
   * @internal
   */
  __getYogaNode(): yoga.YogaNode | undefined {
    return this._node
  }
}

interface YogaLayoutInfo {
  readonly left: number
  readonly right: number
  readonly top: number
  readonly bottom: number
  readonly width: number
  readonly height: number
  children: YogaLayoutInfo[]
}

function setYogaProps(node: yoga.YogaNode, props: Partial<YogaElementProps>) {
  if (typeof props.flexWrap !== 'undefined') {
    node.setFlexWrap(props.flexWrap)
  }
  if (typeof props.flexDirection !== 'undefined') {
    node.setFlexDirection(props.flexDirection)
  }
  if (typeof props.flex !== 'undefined') {
    node.setFlex(props.flex)
  }
  if (typeof props.flexBasis !== 'undefined') {
    node.setFlexBasis(props.flexBasis)
  }
  if (typeof props.flexBasisPercent !== 'undefined') {
    node.setFlexBasisPercent(props.flexBasisPercent)
  }
  if (typeof props.alignContent !== 'undefined') {
    node.setAlignContent(props.alignContent)
  }
  if (typeof props.alignItems !== 'undefined') {
    node.setAlignItems(props.alignItems)
  }
  if (typeof props.alignSelf !== 'undefined') {
    node.setAlignSelf(props.alignSelf)
  }
  if (typeof props.aspectRatio !== 'undefined') {
    node.setAspectRatio(props.aspectRatio)
  }
  if (props.border) {
    node.setBorder(yoga.EDGE_TOP, 0)// TODO: ??
    node.setBorder(yoga.EDGE_LEFT, 0)  // TODO: ??
    node.setBorder(yoga.EDGE_RIGHT, 2) // TODO: this is because of border+1 in contentWidth (ProgramEElement)
    node.setBorder(yoga.EDGE_BOTTOM, 2) // TODO: this is because of border+1 in contentWidth (ProgramEElement)
  }
  if (props.padding) {
    node.setPadding(yoga.EDGE_TOP, props.padding.top)
    node.setPadding(yoga.EDGE_LEFT, props.padding.left)
    node.setPadding(yoga.EDGE_RIGHT, props.padding.right)
    node.setPadding(yoga.EDGE_BOTTOM, props.padding.bottom)
  }
  if (typeof props.display !== 'undefined') {
    node.setDisplay(props.display)
  }
  if (typeof props.flexGrow !== 'undefined') {
    node.setFlexGrow(props.flexGrow)
  }
  if (typeof props.flexShrink !== 'undefined') {
    node.setFlexShrink(props.flexShrink)
  }
  if (typeof props.justifyContent !== 'undefined') {
    node.setJustifyContent(props.justifyContent)
  }
  if (typeof props.maxHeight !== 'undefined') {
    node.setMaxHeight(props.maxHeight)
  }
  if (typeof props.maxWidth !== 'undefined') {
    node.setMaxWidth(props.maxWidth)
  }
  if (typeof props.minHeight !== 'undefined') {
    node.setMinHeight(props.minHeight)
  }
  if (typeof props.minWidth !== 'undefined') {
    node.setMinWidth(props.minWidth)
  }
  if (typeof props.positionType !== 'undefined') {
    node.setPositionType(props.positionType)
  }
  if (typeof props.heightAuto !== 'undefined') {
    node.setHeightAuto()
  }
  if (typeof props.heightPercent !== 'undefined') {
    node.setHeightPercent(props.heightPercent)
  }
  if (typeof props.widthPercent !== 'undefined') {
    node.setWidthPercent(props.widthPercent)
  }
  if (typeof props.widthAuto !== 'undefined') {
    node.setWidthAuto()
  }
  // if(typeof props.flexPadding!=='undefined'){
  //   Object.keys(props.flexPadding).forEach(p=>{
  //     node.setPadding(p, props.flexPadding[p])
  //   })
  // }

  // if (typeof props.top !== 'undefined') {
  //   node.setPosition(yoga.EDGE_TOP, props.top)
  // }
  // if (typeof props.left !== 'undefined') {
  //   node.setPosition(yoga.EDGE_LEFT, props.left)
  // }

  // TODO:

  // border: {} number                <-------set with current
  // height: number                       <-------set with current currently yoga percentage width is a string 30% instead of .3 like
  // margin: {} (ed: Edg: Value         // TODO
  // overflow: Overflow                <------ set with current prop
  // padding(ed: YogaEdg: Value         <------ set with current prop  currently yoga percentage width is a string 30% instead of .3 like
  // position(ed: YogaEdg: Value          <------ set with current prop   currently yoga percentage width is a string 30% instead of .3 like
  // width: number                     <------ set with current prop - currently yoga percentage width is a string 30% instead of .3 like current one
  // bottom?: number | string                  // <---- use position to support it.
  // right?: number | string
}
