import { sleep } from 'misc-utils-of-mine-generic';
import { BorderStyle, Flor } from '../src';
import { AutoLayout } from '../src/util/layout/autolayout/autoLayout';
import { color } from './data';
import { FlorDocumentTesting } from './florTestHelper';
import { expectToContain, willContain } from './testUtil';

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
        border={{ type: BorderStyle.round }}
      >
        <box name="child1" top={2} left={10} width={10} height={4} bg={color()}>child1</box>
        <box name="child2" top={4} left={20} width={10} height={4} bg={color()}>child2</box>
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
    const constraints = [
      'H:|[child1(==child2*0.5)][child2]|',
      'V:|[child1,child2]|'
    ]
    const l = new AutoLayout({ parent: el, constraints, options: { extended: true, spacing: 0 } })
    l.apply({ fitContainerBounds: true })
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

el.width = 22
el.height = 8
l.apply({ fitContainerBounds: true })
    flor.render()
    await sleep(100)

    expectToContain(flor, `
  ╭────────────────────╮
  │child1╮child2──────╮│
  ││     ││           ││
  ││     ││           ││
  ││     ││           ││
  ││     ││           ││
  │╰─────╯╰───────────╯│
  ╰────────────────────╯
`)
    done()
  })
})
