import { BorderStyle, Flor, FlorDocument, isElement, Layout, ProgramElement } from '../src';
import { color } from './data';
import { defaultTestSetup, expectToContain, willContain } from './testUtil';

describe('visible', () => {
  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should not render non visible elements before setting props.visible to true', async done => {
    const a = <el {...{ height: 20, width: 33, layout: { neverResizeContainer: true, layout: Layout.pack } }} border={{ type: BorderStyle.round }}>
      <el height={.3} width={.5} bg={color()}>button1</el>
      <el name="button2" height={.3} width={.5} bg={color()} visible={false}>button2</el>
      <el height={.3} width={.5} bg={color()} >button3</el>
      <el height={.3} width={.5} bg={color()}>button4</el>
      <el height={.3} width={.5} bg={color()} position="absolute" top={0.6} left={0.4}>absolute2</el>
      <el name="absolute1" height={.3} width={.5} bg={color()} position="absolute" top={0.2} left={0.1} visible={false}>absolute1</el>
    </el>
    const el = flor.create(a)
    flor.render()
    await willContain(flor, 'absolute2')
    expectToContain(flor, `
╭───────────────────────────────╮
│button1────────╮               │
││              │               │
││              │               │
││              │               │
│╰──────────────╯               │
│button3────────╮               │
││              │               │
││              │               │
││              │               │
│╰──────────────╯               │
│button4────────╮               │
││           absolute2──────╮   │
││           │              │   │
││           │              │   │
│╰───────────│              │   │
│            ╰──────────────╯   │
│                               │
│                               │
╰───────────────────────────────╯
    `.trim())
    el.findDescendant<ProgramElement>(d => isElement(d) && d.props.name === 'absolute1')!.props.visible = true
    el.render()
    expectToContain(flor, `
╭───────────────────────────────╮
│button1────────╮               │
││              │               │
││              │               │
││              │               │
│╰──absolute1──────╮            │
│but│              │            │
││  │              │            │
││  │              │            │
││  ╰──────────────╯            │
│╰──────────────╯               │
│button4────────╮               │
││           absolute2──────╮   │
││           │              │   │
││           │              │   │
│╰───────────│              │   │
│            ╰──────────────╯   │
│                               │
│                               │
╰───────────────────────────────╯
        `.trim())
    el.findDescendant<ProgramElement>(d => isElement(d) && d.props.name === 'button2')!.props.visible = true
    el.forceUpdate(true)
    el.render()
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
