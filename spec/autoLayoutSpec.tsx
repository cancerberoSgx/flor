import { Flor, FlorDocument, YogaDocument, ProgramElement, debug, isElement, BorderStyle } from '../src';
import { defaultTestSetup, willContain, expectToContain } from './testUtil';
import { int, color } from './data';
import { FlorDocumentTesting } from './florTestHelper';
import { sleep, array } from 'misc-utils-of-mine-generic';
import { TODO } from 'misc-utils-of-mine-typescript';

describe('AutoLayout', () => {
  let flor: FlorDocumentTesting
  beforeEach(() => {
    flor = new FlorDocumentTesting()
  })
  afterEach(() => {
    flor.destroy()
  })

  xit('auto layout api', async done => {
    var constraints = AutoLayout.VisualFormat.parse([
      'H:|[view1(==view2/1.5)]-10-[view2(==20)]-10-[view3(==view1*2)]|',
      'C:view1.top(10).height(>=10)',
      'V:|[view1(==20)]-10-[view2(==20)]-10-[view3(==20)]|'
    ], { extended: true, spacing: 1 });
   
    const el = flor.create(
      <box width={44} height={15} top={2} left={2} 
      border={{type: BorderStyle.round}}
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

    
    done()
  })
})
