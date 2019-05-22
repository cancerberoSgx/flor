import { merge } from 'misc-utils-of-mine-generic'
import { ProgramElement } from '../..'
import { isElement } from '../../programDom/elementUtil'
import { LayoutOptions, isLayoutedElement } from './layout'

const justifiedLayout = require('justified-layout')

export function handleJustifiedLayout(o: LayoutOptions & {
  el: ProgramElement;
}) {
  const children = (o.el.childNodes).filter(isLayoutedElement)
  const data = children.map(c => ({
    top: c.props.top,
    left: c.props.left,
    width: c.props.width || 1,
    height: c.props.height || 1
  }))
  const def = {
    containerWidth: o.el.contentWidth,
    containerHeight: o.el.contentHeight,
    targetRowHeight: Math.trunc(o.el.contentHeight / 5),
    boxSpacing: 0,
    maxNumRows: 5,
    containerPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
  const mandatory = {
    containerWidth: o.el.props.width,
    containerHeight: o.el.props.height
  }
  const options = merge(true, true, {}, def, o.justifiedLayout || {}, mandatory)
  const result = justifiedLayout(data, options) as JustifiedLayoutResult
  if (result && result.boxes) {
    if (result.boxes.length !== children.length) {
    }
    children.forEach((c, i) => {
      const r = result.boxes[i]
      if (r) {
        c.props.top = Math.trunc(r.top)
        c.props.left = Math.trunc(r.left)
        c.props.width = Math.trunc(r.width)
        c.props.height = Math.trunc(r.height)
      }
    })
  }
}

/**
 * Accepts an array of boxes (with a lot of optional configuration options) and returns geometry for a nice
 * justified layout as seen all over [Flickr](https://www.flickr.com/explore)
 */
export interface JustifiedLayoutOptions {

  /**
   * Provide a single integer to apply padding to all sides or provide an object to apply individual values
   * to each side, like this:
   */
  containerPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }

  /**
   *  Provide a single integer to apply spacing both horizontally and vertically or provide an object to
   *  apply individual values to each axis, like this:
   */
  boxSpacing?: {
    horizontal?: number;
    vertical?: number;
  }

  /**
   * It's called a target because row height is the lever we use in order to fit everything in nicely. The
   * algorithm will get as close to the target row height as it can.
   *
   * **IMPORTANT** by default is setted to half element's height, but if many children should be adjust.
   */
  targetRowHeight?: number

  /**
   * Will stop adding rows at this number regardless of how many items still need to be laid out.
   */
  maxNumRows?: number

  /**
   * If you'd like to insert a full width box every n rows you can specify it with this parameter. The box
   * on that row will ignore the targetRowHeight, make itself as wide as containerWidth - containerPadding
   * and be as tall as its aspect ratio defines. It'll only happen if that item has an aspect ratio >= 1.
   * Best to have a look at the examples to see what this does. Default : false.
   */
  fullWidthBreakoutRowCadence?: boolean

  /**
   * How far row heights can stray from targetRowHeight. 0 would force rows to be the targetRowHeight
   * exactly and would likely make it impossible to justify. The value must be between 0 and 1. Default
   * value:   0.25.
   */
  targetRowHeightTolerance?: number

  /**
  Provide an aspect ratio here to return everything in that aspect ratio. Makes the values in your input array irrelevant. The length of the array remains relevant. default value: false.
   */
  forceAspectRatio?: boolean | number

}

interface JustifiedLayoutResult {
  boxes: {
    aspectRatio: number;
    top: number;
    width: number;
    height: number;
    left: number;
  }[]
  containerHeight: number
  widowCount: number
}
