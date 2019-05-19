import { Flor, FlorDocument, YogaDocument, ProgramElement, debug, isElement, BorderStyle } from '../src';
import { defaultTestSetup, willContain, expectToContain } from './testUtil';
import { int, color } from './data';
import { FlorDocumentTesting } from './florTestHelper';
import { sleep, array } from 'misc-utils-of-mine-generic';
import { TODO, notFalsy } from 'misc-utils-of-mine-typescript';
import { AutoLayout, extractSubViewBounds } from '../src/util/layout/autolayout/autoLayout';

describe('AutoLayout', () => {
  let flor: FlorDocumentTesting
  beforeEach(() => {
    flor = new FlorDocumentTesting()
  })
  afterEach(() => {
    flor.destroy()
  })

  it('auto layout api', async done => {

   
    const el = flor.create(
      <box width={44} height={15} top={2} left={2} 
      border={{type: BorderStyle.round}}
      >
    <box name="child1"  top={2} left={10} width={10} height={4} bg={color()}>child1</box>
        <box name="child2"   top={4} left={20} width={10} height={4} bg={color()}>child2</box>
      </box>
    )
    flor.render()
    await willContain(flor, 'child1')
    expectToContain(flor, `
  ╭──────────────────────────────────────────╮
  │                                          │
  │                                          │
  │          child1───╮                      │
  │          │        │                      │
  │          │        │child2───╮            │
  │          ╰────────╯│        │            │
  │                    │        │            │
  │                    ╰────────╯            │
  │                                          │
  │                                          │
  │                                          │
  │                                          │
  │                                          │
  ╰──────────────────────────────────────────╯
`)


// C:child1.top(>=0).left(>=0).bottom(<=parent.height).right(<=parent.width).width(>=0).height(>=0)//.height(<=parent.height).width(<=parent.width)
// C:child2.top(>=0).left(>=0).bottom(<=parent.height).right(<=parent.width).width(>=0).height(>=0)//.height(<=parent.height).width(<=parent.width)
    // var constraints =  `
    //   H:|-[child1(==child2/2)]-[child2]-|
    //   V:|-[child1]-|
    //   V:|-[child2]-|
    //   `.split('\n').map(s=>s.trim()).filter(notFalsy)

      const constraints = [
        'H:|[child1(==child2*0.5)][child2]|',
        'V:|[child1,child2]|'
      ] 
//       V:|-[child1,child2]-|
// H:|-[child1(==child2*0.5)][child2]-|
      const l = new AutoLayout({parent: el, constraints, options:{ extended: true , spacing: 0} })
      l.apply({fitContainerBounds: true})
    flor.render()
    await sleep(100)

    expectToContain(flor, `
  ╭──────────────────────────────────────────╮
  │child1───────╮child2─────────────────────╮│
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  ││            ││                          ││
  │╰────────────╯╰──────────────────────────╯│
  ╰──────────────────────────────────────────╯
`)

    // var c = require('autolayout').VisualFormat.parse([
    //   'H:|[view1(==view2)]-10-[view2]|',
    //   'V:|[view1,view2]|'
    // ], {extended: true});
    // var view = new (require('autolayout').View)({constraints: c});
    // view.setSize(el.contentWidth, el.contentHeight);
    // debug(extractBounds(view.subViews.view1)); // {left: 0, top: 0, width: 195, height: 500}
    // debug(extractBounds(view.subViews.view2));// {left: 205, top: 0, width: 195, height: 500}
    // debug(view.subViews.view2+''); // {left: 205, top: 0, width: 195, height: 500}
    // await sleep(20000)
    // , { extended: true, spacing: 1 });

    
    done()
  })
})
