import { ElementPropsImpl } from '../programDom/elementProps'
import { Align, Direction, Display, Edge, FlexDirection, FlexWrap, JustifyContent, Value, ValuedEdges, YogaElementProps } from './types'

export class YogaElementPropsImpl extends ElementPropsImpl<YogaElementProps> implements Partial<YogaElementProps> {
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
  public get heightPercent(): number | undefined {
    return this._data.heightPercent
  }
  public set heightPercent(value: number | undefined) {
    if (value !== this._data.heightPercent) {
      this._data.heightPercent = value
      this.owner._boundsDirty = true
    }
  }
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
  public get marginPercent(): Partial<ValuedEdges<number>> | undefined {
    return this._data.marginPercent
  }
  public set marginPercent(value: Partial<ValuedEdges<number>> | undefined) {
    if (value !== this._data.marginPercent) {
      this._data.marginPercent = value
      this.owner._boundsDirty = true
    }
  }
  public get maxHeightPercent(): number | undefined {
    return this._data.maxHeightPercent
  }
  public set maxHeightPercent(value: number | undefined) {
    if (value !== this._data.maxHeightPercent) {
      this._data.maxHeightPercent = value
      this.owner._boundsDirty = true
    }
  }
  public get maxWidthPercent(): number | undefined {
    return this._data.maxWidthPercent
  }
  public set maxWidthPercent(value: number | undefined) {
    if (value !== this._data.maxWidthPercent) {
      this._data.maxWidthPercent = value
      this.owner._boundsDirty = true
    }
  }
  public get minHeightPercent(): number | undefined {
    return this._data.minHeightPercent
  }
  public set minHeightPercent(value: number | undefined) {
    if (value !== this._data.minHeightPercent) {
      this._data.minHeightPercent = value
      this.owner._boundsDirty = true
    }
  }
  public get minWidthPercent(): number | undefined {
    return this._data.minWidthPercent
  }
  public set minWidthPercent(value: number | undefined) {
    if (value !== this._data.minWidthPercent) {
      this._data.minWidthPercent = value
      this.owner._boundsDirty = true
    }
  }
  // public get position(): Partial<ValuedEdges<Value | number>> | undefined {
  //   return this._data.position
  // }
  // public set position(value: Partial<ValuedEdges<Value | number>> | undefined) {
  //   if (value !== this._data.position) {
  //     this._data.position = value
  //     this.owner._boundsDirty = true
  //   }
  // }
  // public get positionPercent(): Partial<ValuedEdges<number>> | undefined {
  //   return this._data.positionPercent
  // }
  // public set positionPercent(value: Partial<ValuedEdges<number>> | undefined) {
  //   if (value !== this._data.positionPercent) {
  //     this._data.positionPercent = value
  //     this.owner._boundsDirty = true
  //   }
  // }
  public get paddingPercent(): Partial<ValuedEdges<number>> | undefined {
    return this._data.paddingPercent
  }
  public set paddingPercent(value: Partial<ValuedEdges<number>> | undefined) {
    if (value !== this._data.paddingPercent) {
      this._data.paddingPercent = value
      this.owner._boundsDirty = true
    }
  }
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
  public get direction(): Direction | undefined {
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
  public get flexBasis(): number | undefined {
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
  public get alignContent(): Align | undefined {
    return this._data.alignContent
  }
  public set alignContent(value: Align | undefined) {
    if (value !== this._data.alignContent) {
      this._data.alignContent = value
      this.owner._boundsDirty = true
    }
  }
  public get alignItems(): Align | undefined {
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
  public get aspectRatio(): number | undefined {
    return this._data.aspectRatio
  }
  public set aspectRatio(value: number | undefined) {
    if (value !== this._data.aspectRatio) {
      this._data.aspectRatio = value
      this.owner._boundsDirty = true
    }
  }
  public get display(): Display | undefined {
    return this._data.display
  }
  public set display(value: Display | undefined) {
    if (value !== this._data.display) {
      this._data.display = value
      this.owner._boundsDirty = true
    }
  }
  public get flexGrow(): number | undefined {
    return this._data.flexGrow
  }
  public set flexGrow(value: number | undefined) {
    if (value !== this._data.flexGrow) {
      this._data.flexGrow = value
      this.owner._boundsDirty = true
    }
  }
  public get flexShrink(): number | undefined {
    return this._data.flexShrink
  }
  public set flexShrink(value: number | undefined) {
    if (value !== this._data.flexShrink) {
      this._data.flexShrink = value
      this.owner._boundsDirty = true
    }
  }
  public get justifyContent(): JustifyContent | undefined {
    return this._data.justifyContent
  }
  public set justifyContent(value: JustifyContent | undefined) {
    if (value !== this._data.justifyContent) {
      this._data.justifyContent = value
      this.owner._boundsDirty = true
    }
  }
  public get maxHeight(): number | string | undefined {
    return this._data.maxHeight
  }
  public set maxHeight(value: number | string | undefined) {
    if (value !== this._data.maxHeight) {
      this._data.maxHeight = value
      this.owner._boundsDirty = true
    }
  }
  public get maxWidth(): number | string | undefined {
    return this._data.maxWidth
  }
  public set maxWidth(value: number | string | undefined) {
    if (value !== this._data.maxWidth) {
      this._data.maxWidth = value
      this.owner._boundsDirty = true
    }
  }
  public get minHeight(): number | string | undefined {
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
  // public get positionType(): PositionType | undefined {
  //   return this._data.positionType
  // }
  // public set positionType(value: PositionType | undefined) {
  //   if (value !== this._data.positionType) {
  //     this._data.positionType = value
  //     this.owner._boundsDirty = true
  //   }
  // }
}
