import { Flor, FlorDocument, Scrollable } from '../src'
import { TextArea } from '../src/component/textArea'
import { defaultTestSetup, willContain } from './testUtil'
import { longText } from './data';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('textArea', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should render text, allow to focus, move cursor and insert text', async done => {

    const value = `
Dolor velit eiusmod in in amet et sit ex
    non ipsum enim.
Nostrud sint minim nostrud irure ullamco
          sit cillum veniam id commodo.
     Velit occaecat pariatur minim enim aliqua
tempor enim occaecat.
  `.trim()
    const app = <el  width={.9} height={.9} left={4} top={3}
    >
      <TextArea focus={undefined}
        value={value} width={55} height={7} left={1} top={1} border={undefined}
        bg="gray" fg="green" padding={{ top: 1, left: 1, right: 1, bottom: 1 }}
      >
      </TextArea>
    </el>
    const le = flor.create(app)
    flor.render()

    let expected =     `
      Dolor velit eiusmod in in amet et sit ex
          non ipsum enim.
      Nostrud sint minim nostrud irure ullamco
                sit cillum veniam id commodo.
           Velit occaecat pariatur minim enim aliqua
      tempor enim occaecat.
`.trim()

    await willContain(flor, expected)

    const ta =    le.childNodes.find(TextArea.is)!.getComponent()

    ta.element!.click()

    ta.element!.key('down')
    await ta.element!.enterText('Seba')
    expected = `
      Dolor velit eiusmod in in amet et sit ex
      Seba    non ipsum enim.
      Nostrud sint minim nostrud irure ullamco
                sit cillum veniam id commodo.
           Velit occaecat pariatur minim enim aliqua
      tempor enim occaecat.`.trim()
    await willContain(flor,expected)

    ta.element!.key('down')
    ta.element!.key('right', 5)
    ta.element!.key('delete', 4)
    await willContain(flor, `
      Dolor velit eiusmod in in amet et sit ex
      Seba    non ipsum enim.
      Nostrint minim nostrud irure ullamco
                sit cillum veniam id commodo.
           Velit occaecat pariatur minim enim aliqua
      tempor enim occaecat.`.trim())

    ta.element!.key('right', 5)
    ta.element!.key('enter')
    await ta.element!.enterText('A new line.')
    ta.element!.key('enter')
    await willContain(flor, `
      Dolor velit eiusmod in in amet et sit ex
      Seba    non ipsum enim.
      Nostrint m
      A new line.
      inim nostrud irure ullamco
                sit cillum veniam id commodo.
           Velit occaecat pariatur minim enim aliqua
      tempor enim occaecat.`.trim())
    done()
  })



  xit('should render text, allow to focus, move cursor and insert text', async done => {
    const value = longText()
    const app = <el  width={.9} height={.9} left={.1} top={.1}    >
      <Scrollable width={.9} height={.9} left={1} top={1}>
        <TextArea focus={undefined}
      value={value} width={888} height={88} left={1} top={1} border={undefined}  
      bg="gray" fg="green" padding={{ top: 1, left: 1, right: 1, bottom: 1 }}
      >
      </TextArea>
      </Scrollable>
    </el>
    const le = flor.create(app)
    flor.render()

  })



})
