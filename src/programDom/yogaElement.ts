import { ProgramElement, ElementPropsImpl } from '.';
import { ProgramDocument } from './programDocument';
import * as yoga from 'yoga-layout';
import { ElementProps } from './types';
import { debug } from '../util';

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


export {ALIGN_AUTO, ALIGN_COUNT, ALIGN_FLEX_START, ALIGN_CENTER, ALIGN_FLEX_END, ALIGN_STRETCH, ALIGN_BASELINE, ALIGN_SPACE_BETWEEN, ALIGN_SPACE_AROUND, DIMENSION_COUNT, DIMENSION_WIDTH, DIMENSION_HEIGHT, DIRECTION_COUNT, DIRECTION_INHERIT, DIRECTION_LTR, DIRECTION_RTL, DISPLAY_COUNT, DISPLAY_FLEX, DISPLAY_NONE, EDGE_COUNT, EDGE_LEFT, EDGE_TOP, EDGE_RIGHT, EDGE_BOTTOM, EDGE_START, EDGE_END, EDGE_HORIZONTAL, EDGE_VERTICAL, EDGE_ALL, EXPERIMENTAL_FEATURE_COUNT, EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS, FLEX_DIRECTION_COUNT, FLEX_DIRECTION_COLUMN, FLEX_DIRECTION_COLUMN_REVERSE, FLEX_DIRECTION_ROW, FLEX_DIRECTION_ROW_REVERSE, JUSTIFY_COUNT, JUSTIFY_FLEX_START, JUSTIFY_CENTER, JUSTIFY_FLEX_END, JUSTIFY_SPACE_BETWEEN, JUSTIFY_SPACE_AROUND, JUSTIFY_SPACE_EVENLY, LOG_LEVEL_COUNT, LOG_LEVEL_ERROR, LOG_LEVEL_WARN, LOG_LEVEL_INFO, LOG_LEVEL_DEBUG, LOG_LEVEL_VERBOSE, LOG_LEVEL_FATAL, MEASURE_MODE_COUNT, MEASURE_MODE_UNDEFINED, MEASURE_MODE_EXACTLY, MEASURE_MODE_AT_MOST, NODE_TYPE_COUNT, NODE_TYPE_DEFAULT, NODE_TYPE_TEXT, OVERFLOW_COUNT, OVERFLOW_VISIBLE, OVERFLOW_HIDDEN, OVERFLOW_SCROLL, POSITION_TYPE_COUNT, POSITION_TYPE_RELATIVE, POSITION_TYPE_ABSOLUTE, PRINT_OPTIONS_COUNT, PRINT_OPTIONS_LAYOUT, PRINT_OPTIONS_STYLE, PRINT_OPTIONS_CHILDREN, UNIT_COUNT, UNIT_UNDEFINED, UNIT_POINT, UNIT_PERCENT, UNIT_AUTO, WRAP_COUNT, WRAP_NO_WRAP, WRAP_WRAP, WRAP_WRAP_REVERSE} from 'yoga-layout'


class YogaElementPropsImpl extends ElementPropsImpl<YogaElementProps> implements Partial<YogaElementProps> {
  // get top(){
    // calcul
  // }
  public get flexWrap(): FlexWrap | undefined {
    return this._data.flexWrap;
  }
  public set flexWrap(value: FlexWrap | undefined) {
    this._data.flexWrap = value;
    // setYogaProps(this.owner.node.setFlexWrap())
  }
  public get flexDirection(): FlexDirection | undefined {
    return this._data.flexDirection;
  }
  public set flexDirection(value: FlexDirection | undefined) {
    this._data.flexDirection = value;
  }
  /**
 * Defines the direction of which text and items are laid out
 */
  public get direction(): Direction|undefined  {
    return this._data.direction;
  }
  public set direction(value: Direction|undefined ) {
    this._data.direction = value;
  }
  public get flexBasis(): number|undefined  {
    return this._data.flexBasis;
  }
  public set flexBasis(value: number|undefined ) {
    this._data.flexBasis = value;
  }
  public get flexBasisPercent(): number|undefined {
    return this._data.flexBasisPercent;
  }
  public set flexBasisPercent(value: number|undefined ) {
    this._data.flexBasisPercent = value;
  }
  public get alignContent(): Align|undefined  {
    return this._data.alignContent;
  }
  public set alignContent(value: Align|undefined ) {
    this._data.alignContent = value;
  }
  public get alignItems(): Align|undefined  {
    return this._data.alignItems;
  }
  public set alignItems(value: Align|undefined ) {
    this._data.alignItems = value;
  }
  public get alignSelf(): Align |undefined {
    return this._data.alignSelf;
  }
  public set alignSelf(value: Align|undefined ) {
    this._data.alignSelf = value;
  }
  public get aspectRatio(): number|undefined  {
    return this._data.aspectRatio;
  }
  public set aspectRatio(value: number|undefined ) {
    this._data.aspectRatio = value;
  }
  public get display(): Display|undefined  {
    return this._data.display;
  }
  public set display(value: Display|undefined ) {
    this._data.display = value;
  }
  public get flexGrow(): number|undefined  {
    return this._data.flexGrow;
  }
  public set flexGrow(value: number|undefined ) {
    this._data.flexGrow = value;
  }
  public get flexShrink(): number|undefined  {
    return this._data.flexShrink;
  }
  public set flexShrink(value: number|undefined ) {
    this._data.flexShrink = value;
  }
  public get justifyContent(): JustifyContent|undefined  {
    return this._data.justifyContent;
  }
  public set justifyContent(value: JustifyContent|undefined ) {
    this._data.justifyContent = value;
  }
  public get maxHeight(): number | string|undefined  {
    return this._data.maxHeight;
  }
  public set maxHeight(value: number | string|undefined ) {
    this._data.maxHeight = value;
  }
  public get maxWidth(): number | string|undefined    {
    return this._data.maxWidth;
  }
  public set maxWidth(value: number | string|undefined   ) {
    this._data.maxWidth = value;
  }
  public get minHeight(): number | string|undefined    {
    return this._data.minHeight;
  }
  public set minHeight(value: number | string|undefined   ) {
    this._data.minHeight = value;
  }
  public get minWidth(): number | string | undefined {
    return this._data.minWidth;
  }
  public set minWidth(value: number | string | undefined) {
    this._data.minWidth = value;
  }  
  public get positionType(): PositionType | undefined {
    return this._data.positionType;
  }
  public set positionType(value: PositionType | undefined) {
    this._data.positionType = value;
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
  defaultHeight = ()=> 8
  defaultWidth = ()=>7

  constructor(public readonly tagName: string, ownerDocument: ProgramDocument) {
    super(tagName, ownerDocument)
    this.props = new YogaElementPropsImpl(undefined, this)
  }

  protected get node(): yoga.YogaNode {
    if (!this._node) {
      this._node = yoga.Node.create()
      this.node.setWidth(this.width||this.defaultWidth())
      this.node.setHeight(this.height||this.defaultHeight())
      setYogaProps(this.node, this.props)
      Array.from(this.childNodes).forEach((c, i)=>{
        if(c instanceof YogaElement) {
          this.node.insertChild(c.node, i)
        }
      })
    }
    return this._node
  }

  setYogaProps(){
    setYogaProps(this.node, this.props)      
    Array.from(this.childNodes).forEach((c, i)=>{
      if(c instanceof YogaElement) {
        setYogaProps(this.node, this.props)   
      }
    })
  }
  calculateLayout(){
    if(this.parentElement instanceof YogaElement) {
      this.props.assign(this.node.getComputedLayout())
    }
    Array.from(this.childNodes).forEach((c, i)=>{
      if(c instanceof YogaElement) {
        const l = c.node.getComputedLayout()
        c.props.assign(l)         
        this.node.calculateLayout(l.width, l.height) 
        c.calculateLayout()
      }
    })
  }
  layout(forceUpdate=false) {
    this.setYogaProps()
    this.calculateLayout()
    // if(forceUpdate ){
    //   this._boundsDirty=true
    // }
    // if(this._boundsDirty) {
      // Array.from(this.childNodes).forEach((c, i)=>{
      //   if(c instanceof YogaElement) {
      //     setYogaProps(this.node, this.props)   
      //     // c.props.assign(c.node.getComputedLayout())
      //     // c.layout()
      //   }
      // })
// if(this.parentElement instanceof YogaElement) {
      //   this.props.assign(this.node.getComputedLayout())
      //   debug(this.node.getComputedLayout())
      // }
    // }
  }
}


function setYogaProps(node: yoga.YogaNode, props: Partial<YogaElementProps>) {
  if (typeof props.flexWrap !== 'undefined') {
    node.setFlexWrap(props.flexWrap);
  }
  if (typeof props.flexDirection !== 'undefined') {
    node.setFlexDirection(props.flexDirection);
  }  
  if (typeof props.direction !== 'undefined') {
    node.setFlexDirection(props.direction);
  }
  if (typeof props.flexBasis !== 'undefined') {
    node.setFlexBasis(props.flexBasis);
  }
  if (typeof props.flexBasisPercent !== 'undefined') {
    node.setFlexBasisPercent(props.flexBasisPercent);
  }
  if (typeof props.alignContent !== 'undefined') {
    node.setAlignContent(props.alignContent);
  }
  if (typeof props.alignItems !== 'undefined') {
    node.setAlignItems(props.alignItems);
  }
  if (typeof props.alignSelf !== 'undefined') {
    node.setAlignSelf(props.alignSelf);
  }
  if (typeof props.aspectRatio !== 'undefined') {
    node.setAspectRatio(props.aspectRatio);
  }
  if(props.border){
    // node.setBorder(yoga.EDGE_ALL, 1)
    node.setBorder(yoga.EDGE_TOP, 0)// TODO: ?? 
    node.setBorder(yoga.EDGE_LEFT, 0)  // TODO: ?? 
    node.setBorder(yoga.EDGE_RIGHT, 2) // TODO: this is because of border+1 in contentWidth (ProgramEElement)
    node.setBorder(yoga.EDGE_BOTTOM, 2) // TODO: this is because of border+1 in contentWidth (ProgramEElement)
  }
  if(props.padding){
    node.setPadding(yoga.EDGE_TOP, props.padding!.top)
    node.setPadding(yoga.EDGE_LEFT, props.padding!.left)
    node.setPadding(yoga.EDGE_RIGHT, props.padding!.right)
    node.setPadding(yoga.EDGE_BOTTOM, props.padding!.bottom)
  }
  if (typeof props.display !== 'undefined') {
    node.setDisplay(props.display);
  }  
  if (typeof props.flexGrow !== 'undefined') {
    node.setFlexGrow(props.flexGrow);
  }  
  if (typeof props.flexShrink !== 'undefined') {
    node.setFlexShrink(props.flexShrink);
  } 
   if (typeof props.justifyContent !== 'undefined') {
    node.setJustifyContent(props.justifyContent);
  }  
  if (typeof props.maxHeight !== 'undefined') {
    node.setMaxHeight(props.maxHeight);
  }  
  if (typeof props.maxWidth !== 'undefined') {
    node.setMaxWidth(props.maxWidth);
  }  
  if (typeof props.minHeight !== 'undefined') {
    node.setMinHeight(props.minHeight);
  }  
  if (typeof props.minWidth !== 'undefined') {
    node.setMinWidth(props.minWidth);
  }  
  if (typeof props.positionType !== 'undefined') {
    node.setPositionType(props.positionType);
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
  
  createElement(tagName: string) : YogaElement{
    return new YogaElement(tagName, this)
  }
}