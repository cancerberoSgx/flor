import * as yoga from 'yoga-layout'
import { ElementProps } from '../programDom/types'

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
  margin: Partial<ValuedEdges<Value | number>> // {top?: number|Value, left?: number|Value, right?: number|Value, bottom?: number|Value}  // TODO
  maxHeight: number | string
  maxHeightPercent: number
  maxWidth: number | string
  maxWidthPercent: number
  minHeight: number | string
  minHeightPercent: number
  minWidth: number | string
  minWidthPercent: number
  // overflow: Overflow                <------ set with current prop
  flexPadding: Partial<ValuedEdges<number>> //        <------ set with current prop  currently yoga percentage width is a string 30% instead of .3 like
  paddingPercent: Partial<ValuedEdges<number>>
  position: Partial<ValuedEdges<Value | number>> //        <------ set with current prop   currently yoga percentage width is a string 30% instead of .3 like
  positionPercent: Partial<ValuedEdges<number>>
  positionType: PositionType
  // width: number                     <------ set with current prop - currently yoga percentage width is a string 30% instead of .3 like current one
  widthAuto: boolean
  widthPercent: number
  bottom?: number | string // <---- use position to support it.
  right?: number | string // <---- use position to support it.
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
export type ValuedEdges<V> = {
  [edge in Edge]: V;
}
export { ALIGN_AUTO, ALIGN_BASELINE, ALIGN_CENTER, ALIGN_COUNT, ALIGN_FLEX_END, ALIGN_FLEX_START, ALIGN_SPACE_AROUND, ALIGN_SPACE_BETWEEN, ALIGN_STRETCH, DIMENSION_COUNT, DIMENSION_HEIGHT, DIMENSION_WIDTH, DIRECTION_COUNT, DIRECTION_INHERIT, DIRECTION_LTR, DIRECTION_RTL, DISPLAY_COUNT, DISPLAY_FLEX, DISPLAY_NONE, EDGE_ALL, EDGE_BOTTOM, EDGE_COUNT, EDGE_END, EDGE_HORIZONTAL, EDGE_LEFT, EDGE_RIGHT, EDGE_START, EDGE_TOP, EDGE_VERTICAL, EXPERIMENTAL_FEATURE_COUNT, EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS, FLEX_DIRECTION_COLUMN, FLEX_DIRECTION_COLUMN_REVERSE, FLEX_DIRECTION_COUNT, FLEX_DIRECTION_ROW, FLEX_DIRECTION_ROW_REVERSE, JUSTIFY_CENTER, JUSTIFY_COUNT, JUSTIFY_FLEX_END, JUSTIFY_FLEX_START, JUSTIFY_SPACE_AROUND, JUSTIFY_SPACE_BETWEEN, JUSTIFY_SPACE_EVENLY, LOG_LEVEL_COUNT, LOG_LEVEL_DEBUG, LOG_LEVEL_ERROR, LOG_LEVEL_FATAL, LOG_LEVEL_INFO, LOG_LEVEL_VERBOSE, LOG_LEVEL_WARN, MEASURE_MODE_AT_MOST, MEASURE_MODE_COUNT, MEASURE_MODE_EXACTLY, MEASURE_MODE_UNDEFINED, NODE_TYPE_COUNT, NODE_TYPE_DEFAULT, NODE_TYPE_TEXT, OVERFLOW_COUNT, OVERFLOW_HIDDEN, OVERFLOW_SCROLL, OVERFLOW_VISIBLE, POSITION_TYPE_ABSOLUTE, POSITION_TYPE_COUNT, POSITION_TYPE_RELATIVE, PRINT_OPTIONS_CHILDREN, PRINT_OPTIONS_COUNT, PRINT_OPTIONS_LAYOUT, PRINT_OPTIONS_STYLE, UNIT_AUTO, UNIT_COUNT, UNIT_PERCENT, UNIT_POINT, UNIT_UNDEFINED, WRAP_COUNT, WRAP_NO_WRAP, WRAP_WRAP, WRAP_WRAP_REVERSE } from 'yoga-layout'
