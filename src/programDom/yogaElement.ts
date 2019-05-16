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
maxHeight: number|string 
maxWidth: number|string 
minHeight: number|string 
minWidth: number|string 
// overflow: Overflow                <------ set with current prop
// padding(ed: YogaEdg: Value         <------ set with current prop  currently yoga percentage width is a string 30% instead of .3 like 
// position(ed: YogaEdg: Value          <------ set with current prop   currently yoga percentage width is a string 30% instead of .3 like 
positionType: PositionType               
// width: number                     <------ set with current prop - currently yoga percentage width is a string 30% instead of .3 like current one      
bottom?: number|string                  // <---- use position to support it.
right?: number|string              // <---- use position to support it.
}

export type FlexWrap = yoga.YogaFlexWrap
export type FlexDirection = yoga.YogaFlexDirection
export type Direction = yoga.YogaDirection
export type PositionType = yoga.YogaPositionType
export type JustifyContent = yoga.YogaJustifyContent
export type Display = yoga.YogaDisplay
export type Align = yoga.YogaAlign


class YogaElementPropsImpl extends ElementPropsImpl<YogaElementProps> implements Partial<YogaElementProps> {
  public get flexWrap(): FlexWrap|undefined {
    return this._data.flexWrap;
  }
  public set flexWrap(value: FlexWrap|undefined) {
    this._data.flexWrap = value;
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
    if(!this._node) {
      this._node=yoga.Node.create()
      setYogaProps(this.node, this.props);
    }
    return this._node
  }

  calculateLayout() {
    this.node.calculateLayout(this.width)
  }
}


function setYogaProps(node: yoga.YogaNode, props: Partial<ConcreteYogaElementProps>) {
  if (typeof props.flexWrap !== 'undefined') {
    node.setFlexWrap(props.flexWrap);
  }
  if (typeof props.flexDirection !== 'undefined') {
    node.setFlexDirection(props.flexDirection);
  }
}
