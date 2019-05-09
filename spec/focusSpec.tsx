import { BorderStyle, Flor, FlorDocument, Input, input, MouseAction, ProgramElement } from '../src';
describe('focus', () => {

  let flor: FlorDocument
  beforeEach(() => {
    flor = new FlorDocument()
    flor.renderer.program.enableMouse()
    flor.renderer.program.hideCursor()
    flor.render()
  })
  afterEach(() => {
    flor.destroy()
  })

  it('Input should grab user input', async done => {
   

    done()
  })
})
