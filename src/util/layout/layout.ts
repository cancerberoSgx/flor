import { ProgramElement } from '../..'
import { handleJustifiedLayout, JustifiedLayoutOptions } from './justifiedLayout'
import { handleLayout, isLayoutAlgorithm } from './layoutAlgorithms'
import { Node } from '../../dom';
import { isElement } from '../../programDom';

export interface LayoutOptions {
  /**
   * If non is provided 'binary-tree' will be used.
   */
  layout?: Layout

  /**
   * lined-up layouts support sorting items from smaller to biggest one.
   */
  sort?: boolean

  /**
   * This applies to layouts that could resize the parent element (like [[topDown]] or [[leftRight]]).
   * If true, it will prevent so.  Default value is false.
   */
  neverResizeContainer?: boolean

  /**
   * Options for [[justifiedRows]]. See [[JustifiedLayoutOptions]].
   */
  justifiedLayout?: JustifiedLayoutOptions

  // size?: {
  //   width: number
  //   height: number
  // }

  // manualLayout?: boolean
}

export enum Layout {

  /**
   * The top-down algorithm places items vertically.
   *
   * By default, it sorts from smallest (top-right) to largest (bottom-left). However, this can be disabled
   * via sort: false.
   */
  topDown = 'top-down',

  /**
   * The left-right algorithm places items horizontally.
   *
   * By default, it sorts from smallest (left) to largest (right). However, this can be disabled via sort:
   * false.
   */
  leftRight = 'left-right',

  /**
   * The diagonal algorithm places items diagonally (top-left to bottom-right).
   *
   * By default, it sorts from smallest (top-left) to largest (bottom-right). However, this can be disabled
   * via sort: false.
   */
  diagonal = 'diagonal',

  /**
   * The alt-diagonal algorithm places items diagonally (top-right to bottom-left).
   */
  diagonalAlt = 'alt-diagonal',

  /**
   * The binary-tree algorithm packs items via the binary tree algorithm.
   *
   * This is an efficient way to pack items into the smallest container possible.
   */
  pack = 'binary-tree',

  /**
   * This is [Flickr justified-layout](http://flickr.github.io/justified-layout/) used to show images in
   * justified rows. Has many configurable options available in property [[JustifiedLayoutOptions]]. See
   */
  justifiedLayout = 'justified-layout'
}

/**
 * Will change top, left, width and height of element's children. Also it could change element's width and
 * height.
 */
export function layoutChildren(o: LayoutOptions & { el: ProgramElement }) {
  if (!o.layout || isLayoutAlgorithm(o.layout)) {
    handleLayout(o)
  } else if (o.layout === 'justified-layout') {
    handleJustifiedLayout(o)
  } else {
    // TODO: unknown layout log
  }
}

export function isLayoutedElement(c: Node): c is ProgramElement {
  return isElement(c) && c.props.position !== 'absolute';
}
