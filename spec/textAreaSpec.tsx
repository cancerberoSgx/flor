import { trimRightLines, sleep } from 'misc-utils-of-mine-generic'
import { Flor, FlorDocument, ElementOfComponent, debug } from '../src'
import { Text, text } from '../src/component/text'
import { BorderStyle } from '../src/util/border'
import { defaultTestSetup, willContain, expectToContain } from './testUtil'
import { TextArea } from '../src/component/textArea';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

fdescribe('textArea', () => {

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
        bg="gray" fg="green" padding={{top: 1, left: 1, right: 1, bottom: 1}}
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
// await sleep(1000)

ta.element!.click()

// await sleep(1000)
ta.element!.key('down')
// ta.element!.key('tab')
await ta.element!.enterText('Seba')
expected = `
      Dolor velit eiusmod in in amet et sit ex
      Seba    non ipsum enim.
      Nostrud sint minim nostrud irure ullamco
                sit cillum veniam id commodo.
           Velit occaecat pariatur minim enim aliqua
      tempor enim occaecat.`.trim()
debug(flor.printBuffer(), '\n', expected)
await willContain(flor,expected )


      


// debug(flor.printBuffer())
// await sleep(1000)

// ta.element!.key('tab')

// // await sleep(1000)
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

// // debug(flor.printBuffer())

// await sleep(1000)

    done()
  })

})
