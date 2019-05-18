import { LayoutOptions } from '.'
import { ProgramElement } from '../..'
import { isElement } from '../../programDom/elementUtil'

const layout = require('layout')

interface Info {
  height: number, width: number
  items: { height: number, width: number, x: number, y: number, meta: ProgramElement }[]
}
export function handleLayout(o: LayoutOptions & { el: ProgramElement }) {

  if (o.size) {
    o.neverResizeContainer = undefined
  }

  let layer: any = layout(o.layout, { sort: !!o.sort })
  o.el.children.forEach(c => {
    if (isElement(c)) {
    layer.addItem({ 'height': c.props.height, 'width': c.props.width, 'meta': c })
  }
  })

  let info: Info = layer['export']()
  info.items.forEach(i => {
    i.meta.props.left = i.x
    i.meta.props.top = i.y
    i.meta.props.width = i.width
    i.meta.props.height = i.height
  })
  if (!o.neverResizeContainer && !o.size) {
    o.el.props.width = info.width + (o.el.props.border ? 2 : 0) + (o.el.props.padding ? o.el.props.padding.left + o.el.props.padding.right : 0)
    o.el.props.height = info.height + + (o.el.props.border ? 2 : 0) + (o.el.props.padding ? o.el.props.padding.top + o.el.props.padding.bottom : 0)
  }
}

export function isLayoutAlgorithm(s: string) {
  return ['binary-tree', 'alt-diagonal', 'diagonal', 'left-right', 'top-down'].includes(s)
}
