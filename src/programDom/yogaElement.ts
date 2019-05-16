import * as yoga from 'yoga-layout'
import { ElementPropsImpl, ProgramElement } from '.'
import { ProgramDocument } from './programDocument'
import { ElementProps } from './types'
import { array } from 'misc-utils-of-mine-generic';
import { isElement } from './elementUtil';

export interface YogaElementProps extends ConcreteYogaElementProps, ElementProps {

}
export interface ConcreteYogaElementProps {
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
  // margin: {} (ed: Edg: Value         // TODO
  maxHeight: number | string
  maxWidth: number | string
  minHeight: number | string
  minWidth: number | string
  // overflow: Overflow                <------ set with current prop
  // padding(ed: YogaEdg: Value         <------ set with current prop  currently yoga percentage width is a string 30% instead of .3 like
  // position(ed: YogaEdg: Value          <------ set with current prop   currently yoga percentage width is a string 30% instead of .3 like
  positionType: PositionType
  // width: number                     <------ set with current prop - currently yoga percentage width is a string 30% instead of .3 like current one
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

export { ALIGN_AUTO, ALIGN_BASELINE, ALIGN_CENTER, ALIGN_COUNT, ALIGN_FLEX_END, ALIGN_FLEX_START, ALIGN_SPACE_AROUND, ALIGN_SPACE_BETWEEN, ALIGN_STRETCH, DIMENSION_COUNT, DIMENSION_HEIGHT, DIMENSION_WIDTH, DIRECTION_COUNT, DIRECTION_INHERIT, DIRECTION_LTR, DIRECTION_RTL, DISPLAY_COUNT, DISPLAY_FLEX, DISPLAY_NONE, EDGE_ALL, EDGE_BOTTOM, EDGE_COUNT, EDGE_END, EDGE_HORIZONTAL, EDGE_LEFT, EDGE_RIGHT, EDGE_START, EDGE_TOP, EDGE_VERTICAL, EXPERIMENTAL_FEATURE_COUNT, EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS, FLEX_DIRECTION_COLUMN, FLEX_DIRECTION_COLUMN_REVERSE, FLEX_DIRECTION_COUNT, FLEX_DIRECTION_ROW, FLEX_DIRECTION_ROW_REVERSE, JUSTIFY_CENTER, JUSTIFY_COUNT, JUSTIFY_FLEX_END, JUSTIFY_FLEX_START, JUSTIFY_SPACE_AROUND, JUSTIFY_SPACE_BETWEEN, JUSTIFY_SPACE_EVENLY, LOG_LEVEL_COUNT, LOG_LEVEL_DEBUG, LOG_LEVEL_ERROR, LOG_LEVEL_FATAL, LOG_LEVEL_INFO, LOG_LEVEL_VERBOSE, LOG_LEVEL_WARN, MEASURE_MODE_AT_MOST, MEASURE_MODE_COUNT, MEASURE_MODE_EXACTLY, MEASURE_MODE_UNDEFINED, NODE_TYPE_COUNT, NODE_TYPE_DEFAULT, NODE_TYPE_TEXT, OVERFLOW_COUNT, OVERFLOW_HIDDEN, OVERFLOW_SCROLL, OVERFLOW_VISIBLE, POSITION_TYPE_ABSOLUTE, POSITION_TYPE_COUNT, POSITION_TYPE_RELATIVE, PRINT_OPTIONS_CHILDREN, PRINT_OPTIONS_COUNT, PRINT_OPTIONS_LAYOUT, PRINT_OPTIONS_STYLE, UNIT_AUTO, UNIT_COUNT, UNIT_PERCENT, UNIT_POINT, UNIT_UNDEFINED, WRAP_COUNT, WRAP_NO_WRAP, WRAP_WRAP, WRAP_WRAP_REVERSE } from 'yoga-layout'

class YogaElementPropsImpl extends ElementPropsImpl<YogaElementProps> implements Partial<YogaElementProps> {
  // get top(){
    // calcul
  // }
  public get flexWrap(): FlexWrap | undefined {
    return this._data.flexWrap
  }
  public set flexWrap(value: FlexWrap | undefined) {
    this._data.flexWrap = value
    // setYogaProps(this.owner.node.setFlexWrap())
  }
  public get flexDirection(): FlexDirection | undefined {
    return this._data.flexDirection
  }
  public set flexDirection(value: FlexDirection | undefined) {
    this._data.flexDirection = value
  }
  /**
 * Defines the direction of which text and items are laid out
 */
  public get direction(): Direction | undefined  {
    return this._data.direction
  }
  public set direction(value: Direction | undefined) {
    this._data.direction = value
  }
  public get flex(): number | undefined {
    return this._data.flex;
  }
  public set flex(value: number | undefined) {
    this._data.flex = value;
  }
  public get flexBasis(): number | undefined  {
    return this._data.flexBasis
  }
  public set flexBasis(value: number | undefined) {
    this._data.flexBasis = value
  }
  public get flexBasisPercent(): number | undefined {
    return this._data.flexBasisPercent
  }
  public set flexBasisPercent(value: number | undefined) {
    this._data.flexBasisPercent = value
  }
  public get alignContent(): Align | undefined  {
    return this._data.alignContent
  }
  public set alignContent(value: Align | undefined) {
    this._data.alignContent = value
  }
  public get alignItems(): Align | undefined  {
    return this._data.alignItems
  }
  public set alignItems(value: Align | undefined) {
    this._data.alignItems = value
  }
  public get alignSelf(): Align | undefined {
    return this._data.alignSelf
  }
  public set alignSelf(value: Align | undefined) {
    this._data.alignSelf = value
  }
  public get aspectRatio(): number | undefined  {
    return this._data.aspectRatio
  }
  public set aspectRatio(value: number | undefined) {
    this._data.aspectRatio = value
  }
  public get display(): Display | undefined  {
    return this._data.display
  }
  public set display(value: Display | undefined) {
    this._data.display = value
  }
  public get flexGrow(): number | undefined  {
    return this._data.flexGrow
  }
  public set flexGrow(value: number | undefined) {
    this._data.flexGrow = value
  }
  public get flexShrink(): number | undefined  {
    return this._data.flexShrink
  }
  public set flexShrink(value: number | undefined) {
    this._data.flexShrink = value
  }
  public get justifyContent(): JustifyContent | undefined  {
    return this._data.justifyContent
  }
  public set justifyContent(value: JustifyContent | undefined) {
    this._data.justifyContent = value
  }
  public get maxHeight(): number | string | undefined  {
    return this._data.maxHeight
  }
  public set maxHeight(value: number | string | undefined) {
    this._data.maxHeight = value
  }
  public get maxWidth(): number | string | undefined    {
    return this._data.maxWidth
  }
  public set maxWidth(value: number | string | undefined) {
    this._data.maxWidth = value
  }
  public get minHeight(): number | string | undefined    {
    return this._data.minHeight
  }
  public set minHeight(value: number | string | undefined) {
    this._data.minHeight = value
  }
  public get minWidth(): number | string | undefined {
    return this._data.minWidth
  }
  public set minWidth(value: number | string | undefined) {
    this._data.minWidth = value
  }
  public get positionType(): PositionType | undefined {
    return this._data.positionType
  }
  public set positionType(value: PositionType | undefined) {
    this._data.positionType = value
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
  // defaultHeight = () => 8
  // defaultWidth = () => 7

  constructor(public readonly tagName: string, ownerDocument: ProgramDocument) {
    super(tagName, ownerDocument)
    this.props = new YogaElementPropsImpl(undefined, this)
    // if(typeof this.props.width==='undefined'){
    //   this.props.width=this.defaultWidth()
    // }
    // if(typeof this.props.height==='undefined'){
    //   this.props.height=this.defaultHeight()
    // }
  }

  protected get node(): yoga.YogaNode {
    if (!this._node) {
      this._node = yoga.Node.create()
      this.setPropsToNode();
      setYogaProps(this.node, this.props)
      Array.from(this.childNodes).forEach((c, i) => {
        if (c instanceof YogaElement) {
          this.node.insertChild(c.node, i)
        }
      })
    }
    return this._node
  }

  private setPropsToNode() {
    typeof this.getFlexWidth() !== 'undefined' && this.node.setWidth(this.getFlexWidth()!)
    typeof this.getFlexHeight() !== 'undefined' && this.node.setHeight(this.getFlexHeight()!)
    typeof this.getFlexLeft() !== 'undefined' && this.node.setPosition(yoga.EDGE_LEFT, this.getFlexLeft()!);
    typeof this.getFlexTop() !== 'undefined' && this.node.setPosition(yoga.EDGE_TOP, this.getFlexTop()!);
  }
  setYogaProps() {
    setYogaProps(this.node, this.props)
    this.setPropsToNode();
    Array.from(this.childNodes).forEach((c, i) => {
      if (c instanceof YogaElement) {
        // setYogaProps(this.node, this.props)
        c.setYogaProps()
      }
    })
  }
  calculateLayout() {
    if (this.parentElement instanceof YogaElement) {
      // const l = this.node.getComputedLayout()
      this.left = this.node.getComputedLeft()
      this. top= this.node.getComputedTop()
     this. height=this.node.getComputedHeight()
      this.width= this.node.getComputedWidth() 
      // this.props.assign({left: this.node.getComputedLeft(), top: this.node.getComputedTop(), width: this.node.getComputedWidth(), height: this.node.getComputedHeight()})
      this.node.calculateLayout(isFinite(this.width) ? this.width : undefined,  isFinite(this.height) ? this.height : undefined, typeof this.props.direction!=='undefined'?this.props.direction : this.defaultDirection)
      // this.node.calculateLayout()
    }
    Array.from(this.childNodes).forEach((c, i) => { 
      if (c instanceof YogaElement) {
        // const l = c.node.getComputedLayout()
        // c.props.assign({left: l.left, top: l.top, width: l.width, height: l.height})
        // this.node.calculateLayout(this.props.width, this.props.height, yoga.DIRECTION_LTR)
        c.calculateLayout()
      }
    })
  }

  protected get defaultDirection(): 0 | 1 | 2 | undefined {
    return yoga.DIRECTION_INHERIT;
  }

  getFlexWidth(): number | undefined|string {
    return (this.width>0&&this.width<1)? Math.trunc(this.width*100)+'%': isFinite(this.width) ? this.width : undefined;
  }
  getFlexHeight(): number | undefined|string {
    return (this.height>0&&this.height<1)? Math.trunc(this.height*100)+'%': isFinite(this.height) ? this.height : undefined;
  }
  getFlexLeft(): string | number|undefined {
    return (this.left!==0 && this.left>-1 &&this.left<1) ? Math.trunc(this.left*100)+'%' :  isFinite(this.left) ? this.left : undefined;
   }
   getFlexTop(): string | number |undefined {
     return (this.top!==0 && this.top>-1 &&this.top<1 )? Math.trunc(this.top*100)+'%' : isFinite(this.top) ? this.top : undefined;
    }
    
  // calcBounds() {
  //   const l = this.node.getComputedLayout()
  //   this.props.assign({left: l.left, top: l.top, width: l.width, height: l.height})
  //   Array.from(this.childNodes).forEach((c, i) => {
  //     if (c instanceof YogaElement) {
  //       c.calcBounds()
  //     }
  //   })
  // }

  static is(a: any): a is YogaElement {
    return a && a instanceof YogaElement
  }

  yogaDebug(): YogaLayoutInfo {
    // return {...this.node.getComputedLayout(), children: array(this.node.getChildCount()).map(i=>this.node.getChild(i))}
    return {...this.node.getComputedLayout(), children: Array.from(this.childNodes).filter(YogaElement.is).map(e=>e.yogaDebug())} 
  }


  doLayout(forceUpdate= false) {
    // this.setYogaProps()
    // this.node.calculateLayout(this.props.width, this.props.height, yoga.DIRECTION_LTR)
    // // this.calcBounds()
    // this.setYogaProps()

    this.setYogaProps()
    this.calculateLayout()

    // if(forceUpdate ){
    //   this._boundsDirty=true
    // }
    // if(this._boundsDirty) {
//       Array.from(this.childNodes).forEach((c, i)=>{
//         if(c instanceof YogaElement) {
//           setYogaProps(this.node, this.props)
//           // c.props.assign(c.node.getComputedLayout())
//           // c.layout()
//         }
//       })
// if(this.parentElement instanceof YogaElement) {
//         this.props.assign(this.node.getComputedLayout())
//         // debug(this.node.getComputedLayout())
//       }
    // }
  }
}
interface YogaLayoutInfo {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
  children: YogaLayoutInfo[]
}
function setYogaProps(node: yoga.YogaNode, props: Partial<YogaElementProps>) {
  if (typeof props.flexWrap !== 'undefined') {
    node.setFlexWrap(props.flexWrap)
  }
  if (typeof props.flexDirection !== 'undefined') {
    node.setFlexDirection(props.flexDirection)
  }
  // if (typeof props.direction !== 'undefined') {
  //   node.setFlexDirection(props.direction)
  // }
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
    // node.setBorder(yoga.EDGE_ALL, 1)
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

export class YogaDocument extends ProgramDocument {

  // constructor() {
  //   super()
  //   this.body =  this.createElement('body')
  //   this.appendChild(this.body)
  // }

  createElement(tagName: string): YogaElement {
    return new YogaElement(tagName, this)
  }
}
