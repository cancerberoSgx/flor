import { Flor, FlorDocument, Layout } from '../src'
import { StyleEffectsManager } from '../src/manager/effects'
import { defaultTestSetup, expectToContain, willContain } from './testUtil'

describe('effects', () => {
  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should apply focus style and restore normal', async done => {
    const a =
      <el {...{ height: 12, width: 11, layout: { layout: Layout.topDown } }}>
        <el height={3} width={.9} focusable={true}
          focus={{ bg: 'red', ch: 'F' }} bg="black" ch="N" >button1</el>
        <el focus={{ bg: 'green', ch: 'F' }} bg="black" ch="N" height={3} width={.9} focusable={true}
        >button2</el>
        <el bg="black" ch="N" focus={{ bg: 'blue', ch: 'F' }} height={3} width={.9} focusable={true}
        >button3</el>
        <el  ch="N" height={3} width={.9}
        >button4</el>
      </el>
    flor.create(a)
    flor.events.addKeyListener(e => {
      if (!e.ctrl && e.name === 'tab') {
        flor.focus.focusNext()
      }
      if (e.ctrl && e.name === 'tab') {
        flor.focus.focusPrevious()
      }
    })
    // const effects = new StyleEffectsManager({
    //   focusManager: flor.focus
    // })

    flor.render()
    await willContain(flor, 'button1')
    expectToContain(flor, `
button1NNN
NNNNNNNNNN
NNNNNNNNNN
button2NNN
NNNNNNNNNN
NNNNNNNNNN
button3NNN
NNNNNNNNNN
NNNNNNNNNN
button4NNN
NNNNNNNNNN
NNNNNNNNNN
`.trim())
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    await willContain(flor, 'button1FFF')
    expectToContain(flor, `
button1FFF
FFFFFFFFFF
FFFFFFFFFF
button2NNN
NNNNNNNNNN
NNNNNNNNNN
button3NNN
NNNNNNNNNN
NNNNNNNNNN
button4NNN
NNNNNNNNNN
NNNNNNNNNN
    `.trim())
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    await willContain(flor, 'button2FFF')
    expectToContain(flor, `
button1NNN
NNNNNNNNNN
NNNNNNNNNN
button2FFF
FFFFFFFFFF
FFFFFFFFFF
button3NNN
NNNNNNNNNN
NNNNNNNNNN
button4NNN
NNNNNNNNNN
NNNNNNNNNN
    `.trim())
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    await willContain(flor, 'button3FFF')
    expectToContain(flor, `
button1NNN
NNNNNNNNNN
NNNNNNNNNN
button2NNN
NNNNNNNNNN
NNNNNNNNNN
button3FFF
FFFFFFFFFF
FFFFFFFFFF
button4NNN
NNNNNNNNNN
NNNNNNNNNN
    `.trim())
    done()
  })
})
