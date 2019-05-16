import { ProgramElement, ElementPropsImpl } from '.';
import { ProgramDocument } from './programDocument';
import * as yoga from 'yoga-layout';
import { ElementProps } from './types';

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


class YogaElementPropsImpl extends ElementPropsImpl<YogaElementProps> implements Partial<YogaElementProps> {
  public get flexWrap(): FlexWrap | undefined {
    return this._data.flexWrap;
  }
  public set flexWrap(value: FlexWrap | undefined) {
    this._data.flexWrap = value;
  }

  private _flexDirection: FlexDirection | undefined; 
  public get flexDirection(): FlexDirection | undefined {
    return this._data.flexDirection;
  }
  public set flexDirection(value: FlexDirection | undefined) {
    this._data.flexDirection = value;
  }
  /**
 * Defines the direction of which text and items are laid out
 */
  // private _direction: Direction|undefined ;
  public get direction(): Direction|undefined  {
    return this._data.direction;
  }
  public set direction(value: Direction|undefined ) {
    this._data.direction = value;
  }
  private _flexBasis: number|undefined ;
  public get flexBasis(): number|undefined  {
    return this._data.flexBasis;
  }
  public set flexBasis(value: number|undefined ) {
    this._data.flexBasis = value;
  }
  private _flexBasisPercent: number|undefined ;
  public get flexBasisPercent(): number|undefined {
    return this._data.flexBasisPercent;
  }
  public set flexBasisPercent(value: number|undefined ) {
    this._data.flexBasisPercent = value;
  }
  private _alignContent: Align|undefined ;
  public get alignContent(): Align|undefined  {
    return this._data.alignContent;
  }
  public set alignContent(value: Align|undefined ) {
    this._data.alignContent = value;
  }
  private _alignItems: Align|undefined ;
  public get alignItems(): Align|undefined  {
    return this._data.alignItems;
  }
  public set alignItems(value: Align|undefined ) {
    this._data.alignItems = value;
  }
  private _alignSelf: Align|undefined ;
  public get alignSelf(): Align |undefined {
    return this._data.alignSelf;
  }
  public set alignSelf(value: Align|undefined ) {
    this._data.alignSelf = value;
  }
  private _aspectRatio: number|undefined ;
  public get aspectRatio(): number|undefined  {
    return this._data.aspectRatio;
  }
  public set aspectRatio(value: number|undefined ) {
    this._data.aspectRatio = value;
  }
  // _border: {} number                <-------set with current
  private _display: Display|undefined ;
  public get display(): Display|undefined  {
    return this._data.display;
  }
  public set display(value: Display|undefined ) {
    this._data.display = value;
  }
  private _flexGrow: number|undefined ;
  public get flexGrow(): number|undefined  {
    return this._data.flexGrow;
  }
  public set flexGrow(value: number|undefined ) {
    this._data.flexGrow = value;
  }
  private _flexShrink: number|undefined ;
  public get flexShrink(): number|undefined  {
    return this._data.flexShrink;
  }
  public set flexShrink(value: number|undefined ) {
    this._data.flexShrink = value;
  }
  // _height: number                       <-------set with current currently yoga percentage width is a string 30% instead of .3 like 
  private _justifyContent: JustifyContent|undefined ;
  public get justifyContent(): JustifyContent|undefined  {
    return this._data.justifyContent;
  }
  public set justifyContent(value: JustifyContent|undefined ) {
    this._data.justifyContent = value;
  }
  // _margin: {} (_ed: _Edg: Value         // TODO  
  private _maxHeight: number | string|undefined ;
  public get maxHeight(): number | string|undefined  {
    return this._data.maxHeight;
  }
  public set maxHeight(value: number | string|undefined ) {
    this._data.maxHeight = value;
  }
  private _maxWidth: number | string|undefined   ;
  public get maxWidth(): number | string|undefined    {
    return this._data.maxWidth;
  }
  public set maxWidth(value: number | string|undefined   ) {
    this._data.maxWidth = value;
  }
  private _minHeight: number | string|undefined   ;
  public get minHeight(): number | string|undefined    {
    return this._data.minHeight;
  }
  public set minHeight(value: number | string|undefined   ) {
    this._data.minHeight = value;
  }
  private _minWidth: number | string | undefined;
  public get minWidth(): number | string | undefined {
    return this._data.minWidth;
  }
  public set minWidth(value: number | string | undefined) {
    this._data.minWidth = value;
  }
  // _overflow: Overflow                <------ set with current prop
  // padding(_ed: _YogaEdg: Value         <------ set with current prop  currently yoga percentage width is a string 30% instead of .3 like 
  // position(_ed: _YogaEdg: Value          <------ set with current prop   currently yoga percentage width is a string 30% instead of .3 like 
  private _positionType: PositionType | undefined;
  public get positionType_1(): PositionType | undefined {
    return this._data.positionType;
  }
  public set positionType_1(value: PositionType | undefined) {
    this._data.positionType = value;
  }
  // _width: number                     <------ set with current prop - currently yoga percentage width is a string 30% instead of .3 like current one      
  private _bottom: number | string|undefined   ;                  // <---- use position to support it.
  public get bottom(): number | string|undefined    {
    return this._data.bottom;
  }
  public set bottom(value: number | string|undefined   ) {
    this._data.bottom = value;
  }
  private _right: number | string|undefined             // <---- use position to support it.
  public get right(): number | string|undefined    {
    return this._data.right;
  }
  public set right(value: number | string|undefined   ) {
    this._data.right = value;
  }
}

export class YogaElement extends ProgramElement {

  private _node: yoga.YogaNode = null as any

  props: YogaElementPropsImpl

  constructor(public readonly tagName: string, ownerDocument: ProgramDocument) {
    super(tagName, ownerDocument)
    this.props = new YogaElementPropsImpl(undefined, this)
  }

  protected get node(): yoga.YogaNode {
    if (!this._node) {
      this._node = yoga.Node.create()
      setYogaProps(this.node, this.props)
      Array.from(this.childNodes).forEach((c, i)=>{
        if(c instanceof YogaElement) {
          this.node.insertChild(c.node, i)
        }
      })
    }
    return this._node
  }

  layout(forceUpdate=false) {
    if(forceUpdate ){
      this._boundsDirty=true
    }
    if(this._boundsDirty) {
      setYogaProps(this.node, this.props)
      this.node.calculateLayout(this.width, this.height, this.props.direction)
    }
  }
}


function setYogaProps(node: yoga.YogaNode, props: Partial<ConcreteYogaElementProps>) {
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