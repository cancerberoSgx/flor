import { BorderStyle, Flor, FlorDocument } from '../src'
import { TextArea } from '../src/component/textArea'
import { defaultTestSetup, expectNotToContain, expectToContain, willContain } from './testUtil'

describe('textArea', () => {

  describe('should allow to navigate up and down, create new lines with enter', () => {

    let flor: FlorDocument
    defaultTestSetup(f => flor = f || flor)

    it('should render value and cursor pos initially', async done => {
      const text = `
Que los cumplas feliz,
QUe los cumplas feliz,
Que los cumplas, que los cumplas
Que los cumplas feliz.
      `.trim()
      const el = flor.create(<TextArea focused={true} top={10} left={18} width={33} height={23} border={{ type: BorderStyle.heavy }} bg="blue" text={text} pos={{ col: 0, row: 0 }}
        enabled={true} />)
      flor.render()
      await willContain(flor, 'Que los cumplas,')
      expectNotToContain(flor, '*um*')
      expectNotToContain(flor, '*plas*')
      el.key({ name: 'right', ctrl: true })
      el.key({ name: 'right', ctrl: true })
      el.key('right', 2)
      el.key('down')
      el.key('*')
      el.key('enter')
      el.key('*')
      el.key('right', 2)
      el.key('*')
      el.key('enter')
      el.key('*')
      el.key({ name: 'right', ctrl: true })
      el.key('*')
      el.key('enter')
      expectToContain(flor, '*um*')
      expectToContain(flor, '*plas*')

      done()
    })
  })
})
