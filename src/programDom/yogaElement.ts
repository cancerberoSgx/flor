import * as yoga from 'yoga-layout'
import { ElementPropsImpl, ProgramElement } from '.'
import { debug } from '../util'
import { ProgramDocument } from './programDocument'
import { ElementProps } from './types'

export interface YogaElementProps extends ConcreteYogaElementProps, ElementProps {

}
export interface ConcreteYogaElementProps {

/** it can only be setted, to disable set height */
  heightAuto: boolean
  heightPercent: number
  marginAuto: Edge
  marginPercent: Partial<ValuedEdges<number>>

  flexWrap: FlexWrap
  flexDirection: FlexDirection
  /**
 * Defines the direction of which text and items are laid out
 */
  direction: Direction
  flexBasis: number
  flexBasisPercent: number
  alignContent: Align
  alignItems: Align
  alignSelf: Align
  aspectRatio: number
  // border: {} number                <-------set with current
  display: Display
  flex: number
  flexGrow: number
  flexShrink: number
  // height: number                       <-------set with current currently yoga percentage width is a string 30% instead of .3 like
  justifyContent: JustifyContent
  margin: Partial<ValuedEdges<Value | number>>// {top?: number|Value, left?: number|Value, right?: number|Value, bottom?: number|Value}  // TODO
  maxHeight: number | string
  maxHeightPercent: number
  maxWidth: number | string
  maxWidthPercent: number
  minHeight: number | string
  minHeightPercent: number
  minWidth: number | string
  minWidthPercent: number
  // overflow: Overflow                <------ set with current prop
  flexPadding: Partial<ValuedEdges<number>>//        <------ set with current prop  currently yoga percentage width is a string 30% instead of .3 like

  paddingPercent: Partial<ValuedEdges<number>>

  position: Partial<ValuedEdges<Value | number>> //        <------ set with current prop   currently yoga percentage width is a string 30% instead of .3 like
  positionPercent: Partial<ValuedEdges<number>>
  positionType: PositionType
  // width: number                     <------ set with current prop - currently yoga percentage width is a string 30% instead of .3 like current one
  widthAuto: boolean
  widthPercent: number
  bottom?: number | string                  // <---- use position to support it.
  right?: number | string              // <---- use position to support it.
}

export type FlexWrap = yoga.YogaFlexWrap
export type FlexDirection = yoga.YogaFlexDirection
export type Direction = yoga.YogaDirection
export type PositionType = yoga.YogaPositionType
export type JustifyContent = yoga.YogaJustifyContent
export type Display = yoga.YogaDisplay
export type Align = yoga.YogaAlign
export type Value = ReturnType<yoga.YogaNode['getMargin']>
export type Edge = yoga.YogaEdge
export type ValuedEdges<V> = {[edge in Edge]: V}

export { ALIGN_AUTO, ALIGN_BASELINE, ALIGN_CENTER, ALIGN_COUNT, ALIGN_FLEX_END, ALIGN_FLEX_START, ALIGN_SPACE_AROUND, ALIGN_SPACE_BETWEEN, ALIGN_STRETCH, DIMENSION_COUNT, DIMENSION_HEIGHT, DIMENSION_WIDTH, DIRECTION_COUNT, DIRECTION_INHERIT, DIRECTION_LTR, DIRECTION_RTL, DISPLAY_COUNT, DISPLAY_FLEX, DISPLAY_NONE, EDGE_ALL, EDGE_BOTTOM, EDGE_COUNT, EDGE_END, EDGE_HORIZONTAL, EDGE_LEFT, EDGE_RIGHT, EDGE_START, EDGE_TOP, EDGE_VERTICAL, EXPERIMENTAL_FEATURE_COUNT, EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS, FLEX_DIRECTION_COLUMN, FLEX_DIRECTION_COLUMN_REVERSE, FLEX_DIRECTION_COUNT, FLEX_DIRECTION_ROW, FLEX_DIRECTION_ROW_REVERSE, JUSTIFY_CENTER, JUSTIFY_COUNT, JUSTIFY_FLEX_END, JUSTIFY_FLEX_START, JUSTIFY_SPACE_AROUND, JUSTIFY_SPACE_BETWEEN, JUSTIFY_SPACE_EVENLY, LOG_LEVEL_COUNT, LOG_LEVEL_DEBUG, LOG_LEVEL_ERROR, LOG_LEVEL_FATAL, LOG_LEVEL_INFO, LOG_LEVEL_VERBOSE, LOG_LEVEL_WARN, MEASURE_MODE_AT_MOST, MEASURE_MODE_COUNT, MEASURE_MODE_EXACTLY, MEASURE_MODE_UNDEFINED, NODE_TYPE_COUNT, NODE_TYPE_DEFAULT, NODE_TYPE_TEXT, OVERFLOW_COUNT, OVERFLOW_HIDDEN, OVERFLOW_SCROLL, OVERFLOW_VISIBLE, POSITION_TYPE_ABSOLUTE, POSITION_TYPE_COUNT, POSITION_TYPE_RELATIVE, PRINT_OPTIONS_CHILDREN, PRINT_OPTIONS_COUNT, PRINT_OPTIONS_LAYOUT, PRINT_OPTIONS_STYLE, UNIT_AUTO, UNIT_COUNT, UNIT_PERCENT, UNIT_POINT, UNIT_UNDEFINED, WRAP_COUNT, WRAP_NO_WRAP, WRAP_WRAP, WRAP_WRAP_REVERSE } from 'yoga-layout'

// const EDGE_COUNT: 9;
// const EDGE_LEFT: 0;
// const EDGE_TOP: 1;
// const EDGE_RIGHT: 2;
// const EDGE_BOTTOM: 3;
// const EDGE_START: 4;
// const EDGE_END: 5;
// const EDGE_HORIZONTAL: 6;
// const EDGE_VERTICAL: 7;
// const EDGE_ALL: 8;
// import {EDGE_COUNT} from 'yoga-layout'

// export interface EdgeNameMapping {COUNT: yoga.YogaEdge.COUNT, ,LEFT: EDGE_LEFT,TOP: EDGE_TOP,RIGHT: EDGE_RIGHT,BOTTOM: EDGE_BOTTOM,START: EDGE_START,END: EDGE_END,HORIZONTAL: EDGE_HORIZONTAL,VERTICAL: EDGE_VERTICAL,ALL: EDGE_ALL
// }
class YogaElementPropsImpl extends ElementPropsImpl<YogaElementProps>  implements Partial<YogaElementProps> {

  private _heightAuto: boolean | undefined
  public get heightAuto(): boolean | undefined {
    return this._data.heightAuto
  }
  public set heightAuto(value: boolean | undefined) {
    if (value !== this._data.heightAuto) {
      this._data.heightAuto = value
      this.owner._boundsDirty = true
    }
  }
  public get flexPadding(): Partial<ValuedEdges<number>> | undefined {
    return this._data.flexPadding
  }
  public set flexPadding(value: Partial<ValuedEdges<number>> | undefined) {
    if (value !== this._data.flexPadding) {
      this._data.flexPadding = value
      this.owner._boundsDirty = true
    }
  }

  public get widthAuto(): boolean | undefined {
    return this._data.widthAuto
  }
  public set widthAuto(value: boolean | undefined) {
    if (value !== this._data.widthAuto) {
      this._data.widthAuto = value
      this.owner._boundsDirty = true
    }
  }
  private _heightPercent: number | undefined
  public get heightPercent(): number | undefined {
    return this._data.heightPercent
  }
  public set heightPercent(value: number | undefined) {
    if (value !== this._data.heightPercent) {
      this._data.heightPercent = value
      this.owner._boundsDirty = true
    }
  }
  private _marginAuto: Edge | undefined
  public get marginAuto(): Edge | undefined {
    return this._data.marginAuto
  }
  public set marginAuto(value: Edge | undefined) {
    if (value !== this._data.marginAuto) {
      this._data.marginAuto = value
      this.owner._boundsDirty = true
    }
  }
  public get widthPercent(): number | undefined {
    return this._data.widthPercent
  }
  public set widthPercent(value: number | undefined) {
    if (value !== this._data.widthPercent) {
      this._data.widthPercent = value
      this.owner._boundsDirty = true
    }
  }

  private _marginPercent: Partial<ValuedEdges<number>> | undefined
  public get marginPercent(): Partial<ValuedEdges<number>> | undefined {
    return this._data.marginPercent
  }
  public set marginPercent(value: Partial<ValuedEdges<number>> | undefined) {
    if (value !== this._data.marginPercent) {
      this._data.marginPercent = value
      this.owner._boundsDirty = true
    }
  }
  private _maxHeightPercent: number | undefined
  public get maxHeightPercent(): number | undefined {
    return this._data.maxHeightPercent
  }
  public set maxHeightPercent(value: number | undefined) {
    if (value !== this._data.maxHeightPercent) {
      this._data.maxHeightPercent = value
      this.owner._boundsDirty = true
    }
  }
  private _maxWidthPercent: number | undefined
  public get maxWidthPercent(): number | undefined {
    return this._data.maxWidthPercent
  }
  public set maxWidthPercent(value: number | undefined) {
    if (value !== this._data.maxWidthPercent) {
      this._data.maxWidthPercent = value
      this.owner._boundsDirty = true
    }
  }
  private _minHeightPercent: number | undefined
  public get minHeightPercent(): number | undefined {
    return this._data.minHeightPercent
  }
  public set minHeightPercent(value: number | undefined) {
    if (value !== this._data.minHeightPercent) {
      this._data.minHeightPercent = value
      this.owner._boundsDirty = true
    }
  }
  private _minWidthPercent: number | undefined
  public get minWidthPercent(): number | undefined {
    return this._data.minWidthPercent
  }
  public set minWidthPercent(value: number | undefined) {
    if (value !== this._data.minWidthPercent) {
      this._data.minWidthPercent = value
      this.owner._boundsDirty = true
    }
  }

  private _position: Partial<ValuedEdges<Value | number>> | undefined
  public get position(): Partial<ValuedEdges<Value | number>> | undefined {
    return this._data.position
  }
  public set position(value: Partial<ValuedEdges<Value | number>> | undefined) {
    if (value !== this._data.position) {
      this._data.position = value
      this.owner._boundsDirty = true
    }
  }
  private _positionPercent: Partial<ValuedEdges<number>> | undefined
  public get positionPercent(): Partial<ValuedEdges<number>> | undefined {
    return this._data.positionPercent
  }
  public set positionPercent(value: Partial<ValuedEdges<number>> | undefined) {
    if (value !== this._data.positionPercent) {
      this._data.positionPercent = value
      this.owner._boundsDirty = true
    }
  }
  private _paddingPercent: Partial<ValuedEdges<number>> | undefined
  public get paddingPercent(): Partial<ValuedEdges<number>> | undefined {
    return this._data.paddingPercent
  }
  public set paddingPercent(value: Partial<ValuedEdges<number>> | undefined) {
    if (value !== this._data.paddingPercent) {
      this._data.paddingPercent = value
      this.owner._boundsDirty = true
    }
  }
  private _margin: Partial<ValuedEdges<Value | number>> | undefined
  public get margin(): Partial<ValuedEdges<Value | number>> | undefined {
    return this._data.margin
  }
  public set margin(value: Partial<ValuedEdges<Value | number>> | undefined) {
    if (value !== this._data.margin) {
      this._data.margin = value
      this.owner._boundsDirty = true
    }
  }

  public get flexWrap(): FlexWrap | undefined {
    return this._data.flexWrap
  }
  public set flexWrap(value: FlexWrap | undefined) {
    if (value !== this._data.flexWrap) {
      this._data.flexWrap = value
      this.owner._boundsDirty = true
    }
    // setYogaProps(this.owner.node.setFlexWrap())
  }
  public get flexDirection(): FlexDirection | undefined {
    return this._data.flexDirection
  }
  public set flexDirection(value: FlexDirection | undefined) {
    if (value !== this.data.flexDirection) {
      this._data.flexDirection = value
      this.owner._boundsDirty = true
    }
  }
  /**
 * Defines the direction of which text and items are laid out
 */
  public get direction(): Direction | undefined  {
    return this._data.direction
  }
  public set direction(value: Direction | undefined) {
    if (value !== this.data.direction) {
      this._data.direction = value
      this.owner._boundsDirty = true
    }
  }
  public get flex(): number | undefined {
    return this._data.flex
  }
  public set flex(value: number | undefined) {
    if (value !== this.data.flex) {
      this._data.flex = value
      this.owner._boundsDirty = true
    }
  }
  public get flexBasis(): number | undefined  {
    return this._data.flexBasis
  }
  public set flexBasis(value: number | undefined) {
    if (value !== this.data.flexBasis) {
      this._data.flexBasis = value
      this.owner._boundsDirty = true
    }
  }
  public get flexBasisPercent(): number | undefined {
    return this._data.flexBasisPercent
  }
  public set flexBasisPercent(value: number | undefined) {
    if (value !== this.data.flexBasisPercent) {
      this._data.flexBasisPercent = value
      this.owner._boundsDirty = true
    }
  }
  public get alignContent(): Align | undefined  {
    return this._data.alignContent
  }
  public set alignContent(value: Align | undefined) {
    if (value !== this._data.alignContent) {
      this._data.alignContent = value
      this.owner._boundsDirty = true
    }
  }
  public get alignItems(): Align | undefined  {
    return this._data.alignItems
  }
  public set alignItems(value: Align | undefined) {
    if (value !== this._data.alignItems) {
      this._data.alignItems = value
      this.owner._boundsDirty = true
    }
  }
  public get alignSelf(): Align | undefined {
    return this._data.alignSelf
  }
  public set alignSelf(value: Align | undefined) {
    if (value !== this._data.alignSelf) {
      this._data.alignSelf = value
      this.owner._boundsDirty = true
    }
  }
  public get aspectRatio(): number | undefined  {
    return this._data.aspectRatio
  }
  public set aspectRatio(value: number | undefined) {
    if (value !== this._data.aspectRatio) {
      this._data.aspectRatio = value
      this.owner._boundsDirty = true
    }
  }
  public get display(): Display | undefined  {
    return this._data.display
  }
  public set display(value: Display | undefined) {
    if (value !== this._data.display) {
      this._data.display = value
      this.owner._boundsDirty = true
    }
  }
  public get flexGrow(): number | undefined  {
    return this._data.flexGrow
  }
  public set flexGrow(value: number | undefined) {
    if (value !== this._data.flexGrow) {
      this._data.flexGrow = value
      this.owner._boundsDirty = true
    }
  }
  public get flexShrink(): number | undefined  {
    return this._data.flexShrink
  }
  public set flexShrink(value: number | undefined) {
    if (value !== this._data.flexShrink) {
      this._data.flexShrink = value
      this.owner._boundsDirty = true
    }
  }
  public get justifyContent(): JustifyContent | undefined  {
    return this._data.justifyContent
  }
  public set justifyContent(value: JustifyContent | undefined) {
    if (value !== this._data.justifyContent) {
      this._data.justifyContent = value
      this.owner._boundsDirty = true
    }
  }
  public get maxHeight(): number | string | undefined  {
    return this._data.maxHeight
  }
  public set maxHeight(value: number | string | undefined) {
    if (value !== this._data.maxHeight) {
      this._data.maxHeight = value
      this.owner._boundsDirty = true
    }
  }
  public get maxWidth(): number | string | undefined    {
    return this._data.maxWidth
  }
  public set maxWidth(value: number | string | undefined) {
    if (value !== this._data.maxWidth) {
      this._data.maxWidth = value
      this.owner._boundsDirty = true
    }
  }
  public get minHeight(): number | string | undefined    {
    return this._data.minHeight
  }
  public set minHeight(value: number | string | undefined) {
    if (value !== this._data.minHeight) {
      this._data.minHeight = value
      this.owner._boundsDirty = true
    }
  }
  public get minWidth(): number | string | undefined {
    return this._data.minWidth
  }
  public set minWidth(value: number | string | undefined) {
    if (value !== this._data.minWidth) {
      this._data.minWidth = value
      this.owner._boundsDirty = true
    }
  }
  public get positionType(): PositionType | undefined {
    return this._data.positionType
  }
  public set positionType(value: PositionType | undefined) {
    if (value !== this._data.positionType) {
      this._data.positionType = value
      this.owner._boundsDirty = true
    }
  }
    // _margin: {} (_ed: _Edg: Value         // TODO
  // _border: {} number                <-------set with current
  // _overflow: Overflow                <------ set with current prop
  // _height: number                       <-------set with current currently yoga percentage width is a string 30% instead of .3 like
  // padding(_ed: _YogaEdg: Value         <------ set with current prop  currently yoga percentage width is a string 30% instead of .3 like
  // _width: number                     <------ set with current prop - currently yoga percentage width is a string 30% instead of .3 like current one
  // position(_ed: _YogaEdg: Value          <------ set with current prop   currently yoga percentage width is a string 30% instead of .3 like

  // private _bottom: number | string|undefined   ;                  // <---- use position to support it.
  // public get bottom(): number | string|undefined    {
  //   return this._data.bottom;
  // }
  // public set bottom(value: number | string|undefined   ) {
  //   this._data.bottom = value;
  // }
  // private _right: number | string|undefined             // <---- use position to support it.
  // public get right(): number | string|undefined    {
  //   return this._data.right;
  // }
  // public set right(value: number | string|undefined   ) {
  //   this._data.right = value;
  // }
}

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
      Array.from(this.childNodes).filter(YogaElement.is).forEach((c, i) => {
        this.node.insertChild(c.node, i)
      })
    }
    return this._node

    // TODO : yoga node interface
      //  insertChild(child: Yoga$Node, index: number): void,
  //  isDirty(): boolean,
  //  markDirty(): void,
  //  removeChild(child: Yoga$Node): void,
  //  reset(): void,
  //  getParent(): ?Yoga$Node,
  //  getChild(index: number): Yoga$Node,
  //  getChildCount(): number,
  //  getComputedBorder(edge: Yoga$Edge): number,
  //  getComputedBottom(): number,
  //  getComputedHeight(): number,
  //  getComputedLayout(): Layout,
  //  getComputedLeft(): number,
  //  getComputedMargin(edge: Yoga$Edge): number,
  //  getComputedPadding(edge: Yoga$Edge): number,
  //  getComputedRight(): number,
  //  getComputedTop(): number,
  //  getComputedWidth(): number,
  //  calculateLayout(
  //   width?: number,
  //   height?: number,
  //   direction?: Yoga$Direction,
  // ): void,
  // copyStyle(node: Yoga$Node): void,
  // free(): void,
  // freeRecursive(): void,
  }

  protected setPropsToNode() {
    typeof this.getFlexWidth() !== 'undefined' && this.node.setWidth(this.getFlexWidth()!)
    typeof this.getFlexHeight() !== 'undefined' && this.node.setHeight(this.getFlexHeight()!)
    typeof this.getFlexLeft() !== 'undefined' && this.node.setPosition(yoga.EDGE_LEFT, this.getFlexLeft()!)
    typeof this.getFlexTop() !== 'undefined' && this.node.setPosition(yoga.EDGE_TOP, this.getFlexTop()!)
  }

  protected setYogaProps() {
    setYogaProps(this.node, this.props)
    // this.setPropsToNode()
    Array.from(this.childNodes).filter(YogaElement.is).forEach((c, i) => {
      c.setYogaProps()
    })
  }

  protected calculateLayout() {
    if (YogaElement.is(this.parentElement)) {
      this.left = this.node.getComputedLeft()
      this. top = this.node.getComputedTop()
      this. height = this.node.getComputedHeight()
      this.width = this.node.getComputedWidth()
      this.node.calculateLayout(isFinite(this.width) ? this.width : undefined,  isFinite(this.height) ? this.height : undefined, this.props.direction)
    }
    Array.from(this.childNodes).filter(YogaElement.is).forEach((c, i) =>
        c.calculateLayout()
    )
  }

  doLayout(forceUpdate= false) {
    // this.setYogaProps()
// this.node.calculateLayout(this.props.width, this.props.height, this.props.direction)
// // this.calcBounds()
// this.setYogaProps()
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
    return (this.left !== 0 && this.left > -1 && this.left < 1) ? Math.trunc(this.left * 100) + '%' :  isFinite(this.left) ? this.left : undefined
  }

  protected getFlexTop(): string | number | undefined {
    return (this.top !== 0 && this.top > -1 && this.top < 1) ? Math.trunc(this.top * 100) + '%' : isFinite(this.top) ? this.top : undefined
  }

  static is(a: any): a is YogaElement {
    return a && a instanceof YogaElement && !!(a).yogaDebug
  }

  yogaDebug(): YogaLayoutInfo {
    return { ...this.node.getComputedLayout(), children: Array.from(this.childNodes).filter(YogaElement.is).map(e => e.yogaDebug()) }
  }

  get ownerDocument(): YogaDocument {
    return this._ownerDocument as YogaDocument
  }

  destroy() {
    // first free the children if not throws memory exception
    Array.from(this.childNodes).filter(YogaElement.is).forEach(c => c.destroy())
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

export class YogaDocument extends ProgramDocument<YogaElement> {
  body: YogaElement

  constructor() {
    super()
    this.empty()
    this._allNodes = []
    this.body =  this.createElement('body')
    this.appendChild(this.body)
    this._allNodes.push(this.body)
  }
  private _allNodes: YogaElement[]

  // constructor() {
  //   super()
  //   // if(this.body){
  //     this.empty()
  //   // }
  //   this.body = new YogaElement('body', this)
  //   this.appendChild(this.body)
  //   this._allNodes = this._allNodes ||[]
  //     this._allNodes.push(this.body)
  // }
  // // protected _body: YogaElement= null as any
  // // get body() {
  // //   if (!this._body) {
  // //     this._body = this.createElement('body')
  // //     this.appendChild(this._body)
  // //   }
  // //   return this._body
  // // }
  createElement(tagName: string): YogaElement {
    const el = new YogaElement(tagName, this)

    // const el= new YogaElement(tagName, this)
    // // this._allNodes = this._allNodes|| [] // I need to do this - seems to be a bug in typescrpt or js classes - says this._allNodes.push is undefined no matter if i initialize it everywhere... is called from subclass constructor this.ndy = this.createElement...
    // // if(this._allNodes.find(n=>n!==el){
    this._allNodes = this._allNodes || []
    this._allNodes.push(el)
    // // })
    return el
  }

  destroy() {
    // super.destroy()
    // debug('before', this._allNodes.length, yoga.getInstanceCount())

    this.body.destroy()

    // this.body.__getYogaNode()!&&this.body.__getYogaNode()!.freeRecursive()

    // if(yoga.getInstanceCount()!==0){
      // this._allNodes
      // .filter(n=>!findAncestor(n, a=>a===this.body))
      // .forEach(e=>{
      //   // e.destroy()
      //   e.__getYogaNode()&&e.__getYogaNode()!.free()
      // })
    debug('after', this._allNodes.length, yoga.getInstanceCount())

    // }
    // this._allNodes=[]
// nextTick(()=>    debug('after', this._allNodes.length, yoga.getInstanceCount()))
// setTimeout(() => {
  // debug('super after', this._allNodes.length, yoga.getInstanceCount())
// }, 600);
    // equal(yoga.getInstanceCount(), 0)
  }

  _unregister(e: YogaElement) {
    this._allNodes = this._allNodes.filter(n => n !== e)
    // const i = this._allNodes.findIndex(n=>n===e)
    // notEqual(i, -1)
  //  this._allNodes.splice(i,1)
    debug('_unregister' ,this._allNodes.length, yoga.getInstanceCount())
  }
}
