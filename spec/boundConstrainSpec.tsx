import { sleep } from 'misc-utils-of-mine-generic';
import { BorderStyle, debug, Flor, isElement, ProgramElement } from '../src';
import { color } from './data';
import { FlorDocumentTesting } from './florTestHelper';
import { expectToContain, willContain } from './testUtil';
let AutoLayout = require('autolayout') as AutoLayout

interface AutoLayout {
  VisualFormat: VisualFormat
  View: ViewConstructor
}
interface ViewOptions {
  /**
   * One or more constraint definitions.
   */
  constraints: Constraint[]
  /**
   * Spacing for the view
   */
  spacing?: number | number[]
  /**
   * Initial height of the view.
   */
  height?: number
  /**
   * Initial width of the view.
   */
  width?: number
}

interface ViewConstructor {
  new <Names extends string = string>(options: ViewOptions): View<Names>
}
interface View<Names extends string = string> {
  /**
   * Width that was set using setSize.
   */
  readonly width: number
  /**
   * Height that was set using setSize.
   */
  readonly height: number
  /**
   * Width that is calculated from the constraints and the .intrinsicWidth of the sub-views.
   * When the width has been explicitly set using setSize, the fittingWidth will always be the same as the
   * explicitly set width. To calculate the size based on the content, use:
   *
  ```
   * var view = new AutoLayout.View({constraints: VisualFormat.parse('|-[view1]-[view2]-'), spacing: 20
  });
   * view.subViews.view1.intrinsicWidth = 100; view.subViews.view2.intrinsicWidth = 100;
   * console.log('fittingWidth: ' + view.fittingWidth); // 260
  ```
*/
  fittingWidth: number
  /**
   * Height that is calculated from the constraints and the .intrinsicHeight of the sub-views. See
   * .[[fittingWidth]].
   */
  fittingHeight: number
  /**
   * Dictionary of SubView objects that have been created when adding constraints.
   */
  subViews: { [name in Names]: SubView }
  /**
   * Sets the width and height of the view.
   */
  setSize(width: number, height: number): View
  /**
   * Sets the spacing for the view.
   *
   * The spacing can be set for 7 different variables: top, right, bottom, left, width, height and zIndex. The
   * left-spacing is used when a spacer is used between the parent-view and a sub-view (e.g. |-[subView]). The
   * same is true for the right, top and bottom spacers. The width and height are used for spacers in between
   * sub-views (e.g. [view1]-[view2]).
   *
   * Instead of using the full spacing syntax, it is also possible to use shorthand notations:
   *
   * |Syntax|Type|Description|
  |---|---|---|
   * |[top, right, bottom, left, width, height, zIndex]|Array(7)|Full syntax including z-index (clockwise
   * order).| |[top, right, bottom, left, width, height]|Array(6)|Full horizontal & vertical spacing syntax
   * (no z-index) (clockwise order).| |[horizontal, vertical, zIndex]|Array(3)|Horizontal = left, right,
   * width, vertical = top, bottom, height.| |[horizontal, vertical]|Array(2)|Horizontal = left, right, width,
   * vertical = top, bottom, height, z-index = 1.| |spacing|number|Horizontal & vertical spacing are all the
   * same, z-index = 1.|
   *
   * Examples:
  ```
   * view.setSpacing(10); // horizontal & vertical spacing 10 view.setSpacing([10, 15, 2]); // horizontal
   * spacing 10, vertical spacing 15, z-axis spacing 2 view.setSpacing([10, 20, 10, 20, 5, 5]); // top, right,
   * bottom, left, horizontal, vertical view.setSpacing([10, 20, 10, 20, 5, 5, 1]); // top, right, bottom,
   * left, horizontal, vertical, z
  ```
  */
  setSpacing(spacing: number | number[]): View
  addConstraint(constraint: Constraint): View
  addConstraints(constraints: Constraint[]): View

}
interface VisualFormat {
  /**
   * Parses one or more visual format strings into an array of constraint definitions. When the visual-format
   * could not be succesfully parsed an exception is thrown containing additional info about the parse error
   * and column position.
   */
  parse(constraints: string[], options?: ParseOptions): Constraint[]
  /**
   * Parses a single line of vfl into an array of constraint definitions. When the visual-format could not be
   * successfully parsed an exception is thrown containing additional info about the parse error and column
   * position.
   */
  parseLine(visualFormat: string, options?: ParseLineOptions): Constraint[]

  /**
Parses meta information from the comments in the VFL.

Additional meta information can be specified in the comments for previewing and rendering purposes. For
instance, the view-port aspect-ratio, sub-view widths and colors, can be specified. The following example
renders three colored circles in the visual-format editor:

```vfl
//viewport aspect-ratio:3/1 max-height:300
//colors red:#FF0000 green:#00FF00 blue:#0000FF
//shapes red:circle green:circle blue:circle
H:|-[row:[red(green,blue)]-[green]-[blue]]-|
V:|[row]|
```

Supported categories and properties:

|Category|Property|Example|
|--------|--------|-------|
|`viewport`|`aspect-ratio:{width}/{height}`|`//viewport aspect-ratio:16/9`|
||`width:[{number}/intrinsic]`|`//viewport width:10`|
||`height:[{number}/intrinsic]`|`//viewport height:intrinsic`|
||`min-width:{number}`|
||`max-width:{number}`|
||`min-height:{number}`|
||`max-height:{number}`|
|`spacing`|`[{number}/array]`|`//spacing:8` or `//spacing:[10, 20, 5]`|
|`widths`|`{view-name}:[{number}/intrinsic]`|`//widths subview1:100`|
|`heights`|`{view-name}:[{number}/intrinsic]`|`//heights subview1:intrinsic`|
|`colors`|`{view-name}:{color}`|`//colors redview:#FF0000 blueview:#00FF00`|
|`shapes`|`{view-name}:[circle/square]`|`//shapes avatar:circle`|
   */
  parseMetaInfo(visualFormat: string | string[], options?: parseMetaInfoOptions): void
}
interface parseMetaInfoOptions {
  /**
   * String that defines the end of a line (default \n).
   */
  lineSeparator?: string
  /**
   * When specified, also processes the categories using that prefix (e.g. "-dev-viewport max-height:10").
   */
  prefix?: string
}
interface ParseOptions extends ParseLineOptions {
  /**
   * When set to false trims any leading/trailing spaces and ignores empty lines (default: true).
   */
  strict?: boolean
  /**
   * String that defines the end of a line (default \n).
   */
  lineSeparator?: string
}
interface ParseLineOptions {
  /**
   * When set to true uses the extended syntax (default: false).
   */
  extended?: boolean,
  /**
   * Output format (constraints or raw) (default: constraints).
   */
  spacing?: number
  /**
   * Output format (constraints or raw) (default: constraints).
   */
  outFormat?: 'constraints' | 'raw'
}

type Attribute = 'const' | 'var' | 'left' | 'right' | 'top' | 'bottom' | 'width' | 'height' | 'centerX' | 'centerY' | 'zIndex'

type Relation = 'leq' | 'equ' | 'gep'

interface Constraint {
  view1: string,
  attr1: Attribute,
  relation: Relation,
  view2: String,
  attr2: Attribute,
  multiplier: Number,
  constant: number,
  priority: number
}

interface SubView {
  left: number,
  top: number,
  right: number,
  bottom: number,
  width: number,
  height: number
  name: string
  /**
   * Intrinsic width of the sub-view. Use this property to explicitly set the width of the sub-view, e.g.:
   *
```
   * var view = new AutoLayout.View(AutoLayout.VisualFormat.parse('|[child1][child2]|'), {width: 500
});
   * view.subViews.child1.intrinsicWidth = 100; console.log('child2 width: ' + view.subViews.child2.width); //
   * 400
```
   */
  intrinsicWidth: number
  /**
   * Intrinsic height of the subView. See [[intrinsicWidth]]
   */
  intrinsicHeight: number
  centerX: number
  centerY: number
  zIndex: number
  type: String
  getValue(attr: string): number | undefined
}
// }

function createAutoLayout(el: ProgramElement, visualConstraints: string[], options?: ParseOptions) {
  let constraints = AutoLayout.VisualFormat.parse(visualConstraints, options)
  let view = new AutoLayout.View({ constraints: constraints })
  view.setSize(el.contentWidth, el.contentHeight)
  el.childNodes.filter(isElement).forEach((c, i) => {
    if (c.props.name) {
      const v = view.subViews[c.props.name]
      if (!v) {
        debug('Warning, no constraint found for child named ' + c.props.name)
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
      debug('Warning, child without name will be ignored in the layout.')
    }
  })
  view.setSize(el.contentWidth, el.contentHeight)
  return {
    getChildrenBounds() {
      view.setSize(el.contentWidth, el.contentHeight)
      return el.childNodes.filter(isElement).map((c, i) => {
        if (c.props.name) {
          const v = view.subViews[c.props.name]
          if (!v) {
            console.log('Warning, no constraint found for child named ' + c.props.name)
            return
          }
          return extractBounds(v)
        } else {
          debug('Warning, child without name will be ignored in the layout.')
        }
      })
    },
    apply(options: { fitContainerBounds?: boolean } = {}) {
      view.setSize(el.contentWidth, el.contentHeight)
      if (options.fitContainerBounds) {
        el.contentWidth = Math.round(view.fittingWidth)
        el.contentHeight = Math.round(view.fittingHeight)
      }
      el.childNodes.filter(isElement).forEach((c, i) => {
        if (c.props.name) {
          const v = view.subViews[c.props.name]
          if (!v) {
            console.log('Warning, no constraint found for child named ' + c.props.name)
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

function extractBounds(view: SubView) {
  return {
    left: view.left, top: view.top,
    // right: view.right, bottom: view.bottom,
    width: view.width, height: view.height
  }
}
// function extractBounds(sv: SubView){return   {top: sv.getValue('top'), left: sv.getValue('left'), width:
// sv.getValue('width'), height: sv.getValue('height')}
// }

describe('auto layout - boundConstrain', () => {
  let flor: FlorDocumentTesting
  beforeEach(() => {
    flor = new FlorDocumentTesting()
  })
  afterEach(() => {
    flor.destroy()
  })

  it('auto layout api', async done => {
    let constraints = AutoLayout.VisualFormat.parse([
      'H:|[view1(==view2/1.5)]-10-[view2(==20)]-10-[view3(==view1*2)]|',
      'C:view1.top(10).height(>=10)',
      'V:|[view1(==20)]-10-[view2(==20)]-10-[view3(==20)]|'
    ], { extended: true, spacing: 1 })
    let view = new AutoLayout.View<'view1' | 'view2' | 'view3'>({ constraints: constraints })
    view.setSize(100, 50)

    const bounds = Object.keys(view.subViews).map(k => extractBounds((view.subViews as any)[k]))
    expect(bounds).toEqual([{ left: 0, top: 0, width: 20, height: 20 },
    { left: 30, top: 0, width: 20, height: 20 },
    { left: 60, top: 30, width: 40, height: 20 }])
    done()
  })

  it('createAutoLayout', async done => {
    const el = flor.create(
      <box width={44} height={15} top={2} left={2}
        border={{ type: BorderStyle.round }}
      >test123
    <box name="child1" ch="1" top={2} left={10} width={10} height={4} bg={color()}></box>
        <box name="child2" ch="2" top={4} left={20} width={10} height={4} bg={color()}></box>
        <box name="child3" ch="3" top={6} left={30} width={10} height={4} bg={color()}></box>
      </box>
    )
    flor.render()
    await willContain(flor, 'test123')
    expectToContain(flor, `
  ╭──────────────────────────────────────────╮
  │test123                                   │
  │                                          │
  │          ╭────────╮                      │
  │          │11111111│                      │
  │          │11111111│╭────────╮            │
  │          ╰────────╯│22222222│            │
  │                    │22222222│╭────────╮  │
  │                    ╰────────╯│33333333│  │
  │                              │33333333│  │
  │                              ╰────────╯  │
  │                                          │
  │                                          │
  │                                          │
  ╰──────────────────────────────────────────╯
`)

    const autoLayout = createAutoLayout(el, [

      // dont go out of parent's
      'C:child1.top(>=0).left(>=0).bottom(<=15).right(<=44)',
      'C:child2.top(>=0).left(>=0).bottom(<=15).right(<=44)',
      'C:child3.top(>=0).left(>=0).bottom(<=15).right(<=44)',

      'H:|-[child1(==child2.height*1.5)]-5-[child2(>=child1*2)]-5-[child3(==child1*1.3)]-|',
      'C:child1.top(<=8).height(>=5).height(<=10).left(==5)',
      'C:child2.top(<=child1.top*0.5).height(==child3.height*2).left(>=child1.left+20)',
      'C:child3.height(==child2.height*1.6).width(==child1.width*2.5).bottom(<=child2.top).right(<=child1.left)'
    ], { extended: true, spacing: 1 })

    autoLayout.apply({ fitContainerBounds: true })
    flor.render()
    await sleep(100)
    expectToContain(flor, `
  ╭──────────────────────────────────────────╮
  │test123                 ╭────────╮        │
  │                        │33333333│        │
  │                        │33333333│        │
  │                        ╰────────╯        │
  │                    ╭────────╮            │
  │                    │22222222│            │
  │                    │22222222│            │
  │                    ╰────────╯            │
  │     ╭────────╮                           │
  │     │11111111│                           │
  │     │11111111│                           │
  │     ╰────────╯                           │
  │                                          │
  ╰──────────────────────────────────────────╯
`)

    debug(autoLayout.getChildrenBounds())

    done()
  })

  it('1', async done => {

    //     const el = flor.create(<box width={.9} height={.9} top={.1} left={.1}>test123
    //     {array(10).map(i=><box top={i*2} left={i*10} width={10} height={4} bg={color()}></box>)} </box>
    //     )

    // (view[.{attribute}]['*'|'/'{value}]['+'|'-'{value}]) To, for instance, make the width or height
    // proportional to another view, use:

    // |-[view1(==view2/2)]-[view2]-|  // view1 is half the width of view2 |-[view1(==view2*4-100)]-[view2]-|
    // // view1 is four times the width minus 100 of view2

    // function createAutoLayout(el: ProgramElement, constraints: string[]) {

    // }
    // var constraints =
    //   AutoLayout.VisualFormat.parse(['H:|[view1(==view2/1.5)]-10-[view2(==20)]-10-[view3(==view1*2)]|',
    //   'C:view1.top(10).height(>=10)', // 'C:view1.top(>=12)',//(C:view1.centerX(view2.centerX))
    //   'V:|[view1(==20)]-10-[view2(==20)]-10-[view3(==20)]|'], { extended: true, spacing: 1 }); var view =
    //   new AutoLayout.View<'view1' | 'view2' | 'view3'>({ constraints: constraints }); view.setSize(100,
    //   50);

    // const bounds = Object.keys(view.subViews).map(k => extractBounds((view.subViews as any)[k]))
    // console.log(bounds);

    //     flor.render()

    // expect(YogaDocument.is(flor.document)).toBe(false) await sleep(1000)

    // function extractBounds(view: SubView) {return {left: view.left, top: view.top, // right: view.right,
    //   bottom: view.bottom, width: view.width, height: view.height
    //   }
    // }

    // const b2 = el.findDescendantContaining<ProgramElement>('view2')!; const b1 =
    // el.findDescendantContaining<ProgramElement>('view1')!; debug(!!b1, !!b2, b1 &&   b1.parentNode!!, b2 &&
    // !!b2.parentNode!!); b2 && isElement(b2.parentNode) &&
    // b2.parentNode.props.assign(extractBounds(view.subViews.view2)); b1 && isElement(b1.parentNode)&&
    // b1.parentNode&& b1.parentNode!.props.assign(extractBounds(view.subViews.view1)); await sleep(122)
    // flor.render()

    // // extractBounds(view.subViews.view1)

    // // debug(view.subViews.view1); // {left: 0, top: 0, width: 195, height: 500} //
    // debug(view.subViews.view2); // {left: 205, top: 0, width: 195, height: 500}

    // await sleep(50000)

    // // el.findDescendantContaining<ProgramElement>('view2')!.props.assign(view.subViews.view2) //
    // flor.destroy()
    done()
  })
})
