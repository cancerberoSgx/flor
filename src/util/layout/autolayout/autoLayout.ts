import { ProgramElement, isElement, Rectangle } from '../../../programDom';
import { Constraint, AutoLayout as AutoLayoutType, ParseOptions, View, SubView } from './autoLayoutTypes';
import { debug } from '../../logger';
import { notFalsy } from 'misc-utils-of-mine-typescript';
import { Rect } from '../../geometry';
const AL = require('autolayout') as AutoLayoutType

interface Options<E extends ProgramElement = ProgramElement> {
  parent: E,
  constraints: string[] | Constraint[],
  options?: ParseOptions,
  children?: { [name: string]: E }
}

export class AutoLayout<E extends ProgramElement = ProgramElement> {
  protected constraints: Constraint[];
  protected view: View
  // parentConstraints: Constraint[];
  parent: E;

  constructor(options: Options<E>) {
    this.parent = options.parent
    this.constraints = typeof options.constraints[0] === 'string' ? AL.VisualFormat.parse(options.constraints as string[], options.options) : options.constraints as Constraint[]
    this.view = new AL.View({ constraints: this.constraints });
    // this.parentConstraints = [
    //   {
    //     view1: "parent",
    //     attr1: "width",
    //     relation: "equ",
    //     attr2: "width",
    //     constant: this.parent.contentWidth,
    //     priority: 999
    //   },
    //   {
    //     view1: "parent",
    //     attr1: "height",
    //     relation: "equ",
    //     attr2: "height",
    //     constant: this.parent.contentHeight,
    //     priority: 999
    //   }
    // ]
    // this.view.addConstraints(this.parentConstraints)
    // this.prepareChildren();
    // this.view.setSize(this.parent.contentWidth, this.parent.contentHeight);
  }

  apply(options: { fitContainerBounds?: boolean } = {}) {
    // this.parentConstraints[0].constant = this.parent.contentWidth
    // this.parentConstraints[1].constant = this.parent.contentHeight
    this.prepareChildren();
    // debug(this.parent.contentWidth, this.parent.contentHeight)
    this.view.setSize(this.parent.contentWidth, this.parent.contentHeight);
    this.prepareChildren(true);
      if (options.fitContainerBounds) {
        this.parent.contentWidth = Math.round(this.view.fittingWidth)
        this.parent.contentHeight = Math.round(this.view.fittingHeight)
      }
  }



  private prepareChildren(modify=false) {
    this.parent.childNodes.filter(isElement).forEach((c, i) => {
      if (c.props.name) {
        const v = this.view.subViews[c.props.name];
        if (!v) {
          console.log('Warning, no constraint found for child named ' + c.props.name);
          return;
        }
        // debug(this.view.subViews.child1)
        if(modify){
          c.width = Math.round(v.width);
        c.height = Math.round(v.height);
        c.top = Math.round(v.top);
        c.left = Math.round(v.left);
        // debug(v.left, v.top, v.width, v.height)
        }
        // else {
        //   if (c.width) {
        //     v.intrinsicWidth = c.width;
        //   }
        //   if (c.height) {
        //     v.intrinsicHeight = c.height;
        //   }
        // }
      }
      else {
        debug('Warning, child without name will be ignored in the layout.');
      }
    });
  }
  getBounds( ): {left: number, top: number, width: number, height: number, el: E}[] {
    this.prepareChildren();
    // debug(this.parent.contentWidth, this.parent.contentHeight)
    this.view.setSize(this.parent.contentWidth, this.parent.contentHeight);
    return this.parent.childNodes.filter(isElement).map((c, i) => {
      if (c.props.name) {
        const v = this.view.subViews[c.props.name];
        if (!v) {
          console.log('Warning, no constraint found for child named ' + c.props.name);
          return;
        }
        // debug(this.view.subViews.child1)
        // if(modify){
          return {
            el: c as E, 
            width: Math.round(v.width), 
            height: Math.round(v.height),
            top: Math.round(v.top),
            left: Math.round(v.left)
          }
        //   c.width = Math.round(v.width);
        // c.height = Math.round(v.height);
        // c.top = Math.round(v.top);
        // c.left = Math.round(v.left);
        // debug(v.left, v.top, v.width, v.height)
        // }
        // else {
        //   if (c.width) {
        //     v.intrinsicWidth = c.width;
        //   }
        //   if (c.height) {
        //     v.intrinsicHeight = c.height;
        //   }
        // }
      }
      else {
        debug('Warning, child without name will be ignored in the layout.');
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


/*

function createAutoLayout(el: ProgramElement, visualConstraints: string[], options?: ParseOptions) {
  var constraints = AutoLayout.VisualFormat.parse(visualConstraints, options);
  var view = new AutoLayout.View({ constraints: constraints });
  // view.setSize(el.contentWidth, el.contentHeight);
  el.childNodes.filter(isElement).forEach((c, i) => {
    if (c.props.name) {
      const v = view.subViews[c.props.name]
      if (!v) {
        debug('Warning, no constraint found for child named ' + c.props.name);
        return
      }
      if (c.width) {
        v.intrinsicWidth = c.width
      }
      if (c.height) {
        v.intrinsicHeight = c.height
      }
      // v.left = c.left v.top = c.top
    } else {
      debug('Warning, child without name will be ignored in the layout.');
    }
  })
  view.setSize(el.contentWidth, el.contentHeight);
  return {
    getBounds( ) {
      view.setSize(el.contentWidth, el.contentHeight);
      return el.childNodes.filter(isElement).map((c, i) => {
        if (c.props.name) {
          const v = view.subViews[c.props.name]
          if (!v) {
            console.log('Warning, no constraint found for child named ' + c.props.name);
            return
          }
          return extractBounds(v)
        }else {
          debug('Warning, child without name will be ignored in the layout.');
        }
      })
    },
    apply(options: {fitContainerBounds?: boolean} = {}) {
      view.setSize(el.contentWidth, el.contentHeight);
      if(options.fitContainerBounds){
        el.contentWidth = Math.round(view.fittingWidth)
        el.contentHeight = Math.round(view.fittingHeight)
      }
      el.childNodes.filter(isElement).forEach((c, i) => {
        if (c.props.name) {
          const v = view.subViews[c.props.name]
          if (!v) {
            console.log('Warning, no constraint found for child named ' + c.props.name);
            return
          }
          c.width = Math.round(v.width)
          c.height = Math.round(v.height)
          c.top = Math.round(v.top)
          c.left = Math.round(v.left)
        }
      })
    }
  }
}
*/