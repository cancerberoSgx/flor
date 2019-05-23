import { BorderStyle, Flor, FlorDocument, Layout } from '../src'
import { color } from './data'
import { defaultTestSetup, expectToContain, willContain } from './testUtil'

describe('position', () => {
  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('layout should ignore position absolute elements', async done => {
    const a = <el {...{ height: 20, width: 33, layout: { neverResizeContainer: true, layout: Layout.pack } }} border={{ type: BorderStyle.round }}>
      <el height={.3} width={.5} bg={color()}>button1</el>
      <el height={.3} width={.5} bg={color()}>button2</el>
      <el height={.3} width={.5} bg={color()} >button3</el>
      <el height={.3} width={.5} bg={color()}>button4</el>
      <el height={.3} width={.5} bg={color()} position="absolute" top={0.6} left={0.4}>absolute2</el>
      <el height={.3} width={.5} bg={color()} position="absolute" top={0.2} left={0.1}>absolute1</el>
    </el>
    flor.create(a)
    flor.render()
    await willContain(flor, 'absolute1')
    expectToContain(flor, `
╭───────────────────────────────╮
│button1────────╮button4────────╮
││              ││              │
││              ││              │
││              ││              │
│╰──absolute1──────╮────────────╯
│but│              │            │
││  │              │            │
││  │              │            │
││  ╰──────────────╯            │
│╰──────────────╯               │
│button3────────╮               │
││           absolute2──────╮   │
││           │              │   │
││           │              │   │
│╰───────────│              │   │
│            ╰──────────────╯   │
│                               │
│                               │
╰───────────────────────────────╯
    `.trim())
    done()
  })

})
