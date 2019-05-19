import { BorderStyle, Flor, FlorDocument, isElement, Layout } from '../src'
import { Button } from '../src/component/button'
import { color } from './data'
import { defaultTestSetup, expectNotToContain, expectToContain, willContain } from './testUtil'

describe('button', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should listen to clicks and listeners have access to currentTarget', async done => {
    let counter = 0
    const p = <el  {...{ height: .9, width: .9, top: 0, left: 0 }}
      border={{ type: BorderStyle.doubleLight }}
      layout={{ layout: Layout.leftRight }}
    >
      <el width={9} height={8} top={12} left={8} fg={color()}>sibl1</el>
      <box width={9} height={9} top={22} left={13} bg={color()}>sibl2</box>
      <el width={9} height={8} top={12} left={29} fg={color()}>sibl3</el>
      <Button ref={Flor.createRef<Button>(c => button = c)} border={{ type: BorderStyle.doubleLight }} width={14} height={9} onClick={e => {
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
    expect(button.element!.previousSibling()!.childNodes[0].textContent).toContain('sibl3')
    expectToContain(flor, 'sibl1')
    expectToContain(flor, 'sibl2')
    expectToContain(flor, 'sibl3')
    expectNotToContain(flor, 'COUNT')
    button.element!.click()
    await willContain(flor, 'COUNT0')
    expectToContain(flor, 'sibl1')
    expectToContain(flor, 'sibl2')
    expectNotToContain(flor, 'sibl3')
    button.element!.click()
    await willContain(flor, 'CLICK ME')
    expectToContain(flor, 'COUNT1')

    done()
  })

})
