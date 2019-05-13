import { tryTo } from 'misc-utils-of-mine-generic'
import { Program, ProgramDocument, ProgramDocumentRenderer } from '../src'
import { trimRightLines } from 'misc-utils-of-mine-generic'
import { installExitKeys } from '../src/util/programUtil'

describe('styleProps', () => {
  let program: Program
  let doc: ProgramDocument
  let renderer: ProgramDocumentRenderer

  beforeEach(() => {
    program = new Program()
    installExitKeys(program)
    program.reset()
    jasmine.addMatchers(require('jasmine-diff')(jasmine, {
      colors: true, inline: true
    }))
    doc = new ProgramDocument()
    renderer = new ProgramDocumentRenderer({ program })
  })

  afterEach(() => {
    tryTo(() => {
      renderer.destroy()
    })
  })

  it('top left can be negative', async done => {
    const el = doc.create({top: 5, left: 12, width: 24, height: 6, ch: '0',
      children: [
      { top: -2, left: -3, width: 22, height: 4, ch: '1' }
      ]})
    renderer.renderElement(el)
    expect(renderer.printBuffer(true)).toContain(`


         1111111111111111111111
         1111111111111111111111
         111111111111111111111100000
         111111111111111111111100000
            000000000000000000000000
            000000000000000000000000
            000000000000000000000000
            000000000000000000000000
`)
    done()
  })

  it('top left can be negative fractions', async done => {
    const el = doc.create({top: 10, left: 14, width: 24, height: 15, ch: '0',
      children: [
      { top: .7, left: .7, width: .4, height: .4, ch: '1' },
      { top: -.2, left: -.2, width: .4, height: .4, ch: '2' },
      { top: -.4, left: .9, width: .3, height: .3, ch: '3' }
      ]})
    renderer.renderElement(el)
    expect(renderer.printBuffer(true)).toContain(trimRightLines(`



                                    3333333
                                    3333333
                                    3333333
         2222222222                 3333333
         2222222222                 3333333
         2222222222
         22222222220000000000000000000
         22222222220000000000000000000
         22222222220000000000000000000
              000000000000000000000000
              000000000000000000000000
              000000000000000000000000
              000000000000000000000000
              000000000000000000000000
              000000000000000000000000
              000000000000000000000000
              000000000000000000000000
              000000000000000001111111111
              000000000000000001111111111
              000000000000000001111111111
              000000000000000001111111111
                               1111111111
                               1111111111
`))
    done()
  })

})
