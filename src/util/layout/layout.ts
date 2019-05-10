import { ProgramElement } from '../..'
import { handleJustifiedLayout, JustifiedLayoutOptions } from './justifiedLayout'
import { handleLayout, isLayoutAlgorithm } from './layoutAlgorithms'

export interface LayoutOptions {
  /**
   * If non is provided 'binary-tree' will be used
   */
  layout?: Layout
  /**
   * lined-up layouts support sorting items from smaller to biggest one.
   */
  sort?: boolean
  neverResizeContainer?: boolean

  /**
   * Options for layout == 'justified-layout
   */
  justifiedLayout?: JustifiedLayoutOptions

size?: {
  width: number
  height: number
}

manualLayout?: boolean
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
   * justified rows. Has many configurable options available in property [[justifiedLayoutOptions]]. See
   */
  justifiedRows = 'justified-layout'
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
// justified layout impl

// const justifiedLayout = require('justified-layout')
// function handleJustifiedLayout(o: LayoutOptions & { el: ProgramElement }) {
//   const children = Array.from(o.el.childNodes).filter(isElement)
//   const data = children.map(c => ({
//     top: c.props.top,
//     left: c.props.left,
//     width: c.props.width || 1,
//     height: c.props.height || 1
//   }))
//   const def = {
//     containerWidth: o.el.contentWidth,
//     containerHeight: o.el.contentHeight,
//     targetRowHeight: Math.trunc(o.el.contentHeight / 5),
//     boxSpacing: 0,
//     maxNumRows: 5,
//     containerPadding: {
//       top: 0,
//       right: 0,
//       bottom: 0,
//       left: 0
//     }
//   }
//   const mandatory = {
//     containerWidth: o.el.props.width,
//     containerHeight: o.el.props.height
//   }
//   const options = merge(true, true, {}, def, o.justifiedLayout || {}, mandatory)
//   const result = justifiedLayout(data, options) as JustifiedLayoutResult
//   if (result && result.boxes) {
//     if (result.boxes.length !== children.length) {
//     }
//     children.forEach((c, i) => {
//       const r = result.boxes[i]
//       if (r) {
//         c.props.assign({ top: Math.trunc(r.top), left: Math.trunc(r.left), width: Math.trunc(r.width), height: Math.trunc(r.height) })
//       }
//     })
//   }
// }

// interface JustifiedLayoutResult {
//   boxes: {
//     aspectRatio: number
//     top: number
//     width: number
//     height: number
//     left: number
//   }[]
//   containerHeight: number
//   widowCount: number
// }
