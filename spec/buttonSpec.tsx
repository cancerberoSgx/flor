import { BorderStyle, Flor, FlorDocument, isElement, Layout } from '../src'
import { Button } from '../src/component/button'
import { color } from './data'
import { defaultTestSetup, expectNotToContain, expectToContain, willContain } from './testUtil'

describe('button', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should listen to clicks and listeners have access to currentTarget', async done => {
    let counter = 0
    const p = <el height={12} width={33}
      border={{ type: BorderStyle.doubleLight }}
      layout={{ layout: Layout.leftRight }} preventChildrenCascade={true}
    >
      <el width={9} height={8} fg={color()}>sibl1</el>
      <box width={9} height={9} bg={color()}>sibl2</box>
      <el width={9} height={8} fg={color()}>sibl3</el>
      <Button ref={Flor.createRef<Button>(c => button = c)} border={{ type: BorderStyle.round }} width={14} height={4}
        focus={{
          border: { type: BorderStyle.singleRareCorners, fg: 'red' },
          bold: true,
          fg: 'green',
          bg: 'gray'
        }}
        onClick={e => {
          const s = e.currentTarget!.previousSibling()
          if (s && isElement(s)) {
            s.findDescendantTextNodeContaining('')!.textContent = 'COUNT' + counter++
            flor.render(s)
          }
        }}>CLICK ME</Button>
    </el>

    let button: Button = null as any
    flor.create(p)
    flor.render()
    await willContain(flor, 'CLICK ME')
    expectToContain(flor, `
╒═════════════════════════════════════════╕
│sibl1    sibl2    sibl3    ╭────────────╮│
│                           │CLICK ME    ││
│                           │            ││
│                           ╰────────────╯│
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
╘═════════════════════════════════════════╛
`.trim())
    expect(button.element!.previousSibling()!.childNodes[0].textContent).toContain('sibl3')
    expectNotToContain(flor, 'COUNT')
    button.element!.click()
    await willContain(flor, 'COUNT0')
    expectToContain(flor, `
╒═════════════════════════════════════════╕
│sibl1    sibl2    COUNT0══╕⎡⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎤│
│                  │       │⎢CLICK ME    ⎥│
│                  │       │⎢            ⎥│
│                  │       │⎣⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎦│
│                  │       │              │
│                  │       │              │
│                  │       │              │
│                  ╘═══════╛              │
│                                         │
╘═════════════════════════════════════════╛
    `.trim())
    expectNotToContain(flor, 'sibl3')
    button.element!.click()
    await willContain(flor, 'CLICK ME')
    expectToContain(flor, 'COUNT1')

    done()
  })

})
