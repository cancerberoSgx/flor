import { notFalsy } from 'misc-utils-of-mine-typescript'
import { isElement, ProgramElement } from '../../../programDom'
import { debug } from '../../logger'
import { AutoLayout as AutoLayoutType, Constraint, ParseOptions, SubView, View } from './autoLayoutTypes'
const AL = require('autolayout') as AutoLayoutType

interface Options<E extends ProgramElement = ProgramElement> {
  parent: E,
  constraints: string[] | Constraint[],
  options?: ParseOptions,
  children?: { [name: string]: E }
}

/**
 * Define and apply layout to element's children using Apple's [Auto
 * Layout](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/AutolayoutPG/index.html)
 * and [Visual Format
 * Language](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/AutolayoutPG/VisualFormatLanguage.html)
 * through the library [autolayout](https://github.com/IjzerenHein/autolayout.js)
 */
export class AutoLayout<E extends ProgramElement = ProgramElement> {
  protected constraints: Constraint[]
  protected view: View
  parent: E

  constructor(options: Options<E>) {
    this.parent = options.parent
    this.constraints = typeof options.constraints[0] === 'string' ? AL.VisualFormat.parse(options.constraints as string[], options.options) : options.constraints as Constraint[]
    this.view = new AL.View({ constraints: this.constraints })
  }

  /**
   * Calculates and set children bounds corresponding to current parent content bounds.
   */
  apply(options: { fitContainerBounds?: boolean } = {}) {
    this.view.setSize(this.parent.contentWidth, this.parent.contentHeight)
    this.getBounds().forEach(b => {
      b.el.width = b.bounds.width
      b.el.height = b.bounds.height
      b.el.top = b.bounds.top
      b.el.left = b.bounds.left
    })
    if (options.fitContainerBounds) {
      this.parent.contentWidth = Math.round(this.view.fittingWidth)
      this.parent.contentHeight = Math.round(this.view.fittingHeight)
    }
  }

  /**
   * Gets children new bounds corresponding to current parent content bounds. Don't modify children's just
   * returns the values.
   */
  getBounds(): { bounds: { left: number, top: number, width: number, height: number }, el: E }[] {
    this.view.setSize(this.parent.contentWidth, this.parent.contentHeight)
    return this.parent.childNodes.filter(isElement).map((c, i) => {
      if (c.props.name) {
        const v = this.view.subViews[c.props.name]
        if (!v) {
          console.log('Warning, no constraint found for child named ' + c.props.name)
          return
        }
        return {
          el: c as E,
          bounds: {
            width: Math.round(v.width),
            height: Math.round(v.height),
            top: Math.round(v.top),
            left: Math.round(v.left)
          }
        }
      } else {
        debug('Warning, child without name will be ignored in the layout.')
      }
    }).filter(notFalsy)
  }
}

export function extractSubViewBounds(view: SubView) {
  return {
    left: view.left, top: view.top,
    right: view.right, bottom: view.bottom,
    width: view.width, height: view.height
  }
}
