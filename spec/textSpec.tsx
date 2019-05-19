import { trimRightLines } from 'misc-utils-of-mine-generic'
import { Flor, FlorDocument } from '../src'
import { Text, text } from '../src/component/text'
import { BorderStyle } from '../src/util/border'
import { defaultTestSetup } from './testUtil'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('text', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('default behavior', async done => {

    const el = flor.create(<Text width={38} top={3} left={4} height={16}
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
    </Text>)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`


    ╔════════════════════════════════════╗
    ║                                    ║
    ║   Eiusmod nostrud deserunt ex      ║
    ║   qui in non magna velit nulla     ║
    ║   sint adipisicing sit veniam      ║
    ║   consectetur. Non minim sit       ║
    ║   cupidatat nulla nostrud cillum   ║
    ║   proident labore. Sint amet eu    ║
    ║   pariatur magna laboris           ║
    ║   occaecat in anim consectetur     ║
    ║   labore ipsum esse Lorem          ║
    ║   nostrud. Labore eu aliqua        ║
    ║   dolore tempor ea in sint culpa   ║
    ║   ipsum.                           ║
    ║                                    ║
    ╚════════════════════════════════════╝
`))
    done()
  })

  it('function text()', async done => {

    const el = text({
      width: 38, top: 3, left: 4, height: 16
      , padding: { top: 1, right: 2, left: 3, bottom: 1 }, border: { type: BorderStyle.double }, children: ['Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.']
    })

    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`


    ╔════════════════════════════════════╗
    ║                                    ║
    ║   Eiusmod nostrud deserunt ex      ║
    ║   qui in non magna velit nulla     ║
    ║   sint adipisicing sit veniam      ║
    ║   consectetur. Non minim sit       ║
    ║   cupidatat nulla nostrud cillum   ║
    ║   proident labore. Sint amet eu    ║
    ║   pariatur magna laboris           ║
    ║   occaecat in anim consectetur     ║
    ║   labore ipsum esse Lorem          ║
    ║   nostrud. Labore eu aliqua        ║
    ║   dolore tempor ea in sint culpa   ║
    ║   ipsum.                           ║
    ║                                    ║
    ╚════════════════════════════════════╝
`))
    done()
  })

  it('column direction', async done => {
    const el = flor.create(<Text width={38} top={3} left={4} height={22} textDirection="column"
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
     </Text>)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`


    ╔════════════════════════════════════╗
    ║                                    ║
    ║   Eiusmod      cupidatat   esse    ║
    ║   nostrud      nulla       Lorem   ║
    ║   deserunt     nostrud     nostrud.║
    ║   ex           cillum      Labore  ║
    ║   qui          proident    eu      ║
    ║   in           labore.     aliqua  ║
    ║   non          Sint        dolore  ║
    ║   magna        amet        tempor  ║
    ║   velit        eu          ea      ║
    ║   nulla        pariatur    in      ║
    ║   sint         magna       sint    ║
    ║   adipisicing  laboris     culpa   ║
    ║   sit          occaecat    ipsum.  ║
    ║   veniam       in                  ║
    ║   consectetur. anim                ║
    ║   Non          consectetur         ║
    ║   minim        labore              ║
    ║   sit          ipsum               ║
    ║                                    ║
    ╚════════════════════════════════════╝
`))
    done()
  })

  it('align justify', async done => {
    const el = flor.create(<Text width={38} top={3} left={4} height={16} wordsAlign="justify"
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
    </Text>)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`


    ╔════════════════════════════════════╗
    ║                                    ║
    ║   Eiusmod  nostrud  deserunt  ex   ║
    ║   qui in  non magna  velit nulla   ║
    ║   sint  adipisicing  sit  veniam   ║
    ║   consectetur.  Non   minim  sit   ║
    ║   cupidatat nulla nostrud cillum   ║
    ║   proident labore.  Sint amet eu   ║
    ║   pariatur     magna     laboris   ║
    ║   occaecat  in anim  consectetur   ║
    ║   labore   ipsum    esse   Lorem   ║
    ║   nostrud.   Labore  eu   aliqua   ║
    ║   dolore tempor ea in sint culpa   ║
    ║   ipsum.                           ║
    ║                                    ║
    ╚════════════════════════════════════╝
`))
    done()
  })

  it('align center', async done => {
    const el = flor.create(<Text width={48} top={3} left={4} height={16} wordsAlign="center"
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
    </Text>)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`


    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║    Eiusmod nostrud deserunt ex qui in non    ║
    ║    magna velit nulla sint adipisicing sit    ║
    ║       veniam consectetur. Non minim sit      ║
    ║    cupidatat nulla nostrud cillum proident   ║
    ║      labore. Sint amet eu pariatur magna     ║
    ║     laboris occaecat in anim consectetur     ║
    ║    labore ipsum esse Lorem nostrud. Labore   ║
    ║   eu aliqua dolore tempor ea in sint culpa   ║
    ║                    ipsum.                    ║
    ║                                              ║
    ║                                              ║
    ║                                              ║
    ║                                              ║
    ╚══════════════════════════════════════════════╝
`))
    done()
  })

  it('lines align bottom', async done => {
    const el = flor.create(<Text width={52} top={1} left={4} height={18} linesAlign="bottom"
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
    </Text>)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║   Eiusmod nostrud deserunt ex qui in non magna   ║
    ║   velit nulla sint adipisicing sit veniam        ║
    ║   consectetur. Non minim sit cupidatat nulla     ║
    ║   nostrud cillum proident labore. Sint amet eu   ║
    ║   pariatur magna laboris occaecat in anim        ║
    ║   consectetur labore ipsum esse Lorem nostrud.   ║
    ║   Labore eu aliqua dolore tempor ea in sint      ║
    ║   culpa ipsum.                                   ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
`))
    done()
  })

  it('lines align center', async done => {
    const el = flor.create(<Text width={52} top={1} left={4} height={18} linesAlign="center" wordsAlign="justify"
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
    </Text>)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║   Eiusmod nostrud deserunt ex qui in non magna   ║
    ║   velit  nulla  sint  adipisicing  sit  veniam   ║
    ║   consectetur. Non  minim sit  cupidatat nulla   ║
    ║   nostrud cillum proident labore. Sint amet eu   ║
    ║   pariatur  magna  laboris  occaecat  in  anim   ║
    ║   consectetur labore ipsum esse Lorem nostrud.   ║
    ║   Labore eu  aliqua dolore  tempor ea  in sint   ║
    ║   culpa                                 ipsum.   ║
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
`))
    done()
  })

  it('Should update if bounds change', async done => {
    const el = flor.create(<Text width={38} top={3} left={4} height={16} wordsAlign="justify"
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
    </Text>)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`


    ╔════════════════════════════════════╗
    ║                                    ║
    ║   Eiusmod  nostrud  deserunt  ex   ║
    ║   qui in  non magna  velit nulla   ║
    ║   sint  adipisicing  sit  veniam   ║
    ║   consectetur.  Non   minim  sit   ║
    ║   cupidatat nulla nostrud cillum   ║
    ║   proident labore.  Sint amet eu   ║
    ║   pariatur     magna     laboris   ║
    ║   occaecat  in anim  consectetur   ║
    ║   labore   ipsum    esse   Lorem   ║
    ║   nostrud.   Labore  eu   aliqua   ║
    ║   dolore tempor ea in sint culpa   ║
    ║   ipsum.                           ║
    ║                                    ║
    ╚════════════════════════════════════╝
`))

    el.props.width = 54
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`


    ╔════════════════════════════════════════════════════╗
    ║                                                    ║
    ║   Eiusmod nostrud  deserunt ex qui in  non magna   ║
    ║   velit  nulla   sint  adipisicing   sit  veniam   ║
    ║   consectetur.  Non  minim sit  cupidatat  nulla   ║
    ║   nostrud cillum  proident labore. Sint  amet eu   ║
    ║   pariatur  magna   laboris  occaecat   in  anim   ║
    ║   consectetur labore  ipsum esse  Lorem nostrud.   ║
    ║   Labore  eu aliqua  dolore  tempor  ea in  sint   ║
    ║   culpa                                   ipsum.   ║
    ║                                                    ║
    ║                                                    ║
    ║                                                    ║
    ║                                                    ║
    ║                                                    ║
    ╚════════════════════════════════════════════════════╝
`))
    el.props.height = 14
    el.props.top = 1
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`
    ╔════════════════════════════════════════════════════╗
    ║                                                    ║
    ║   Eiusmod nostrud  deserunt ex qui in  non magna   ║
    ║   velit  nulla   sint  adipisicing   sit  veniam   ║
    ║   consectetur.  Non  minim sit  cupidatat  nulla   ║
    ║   nostrud cillum  proident labore. Sint  amet eu   ║
    ║   pariatur  magna   laboris  occaecat   in  anim   ║
    ║   consectetur labore  ipsum esse  Lorem nostrud.   ║
    ║   Labore  eu aliqua  dolore  tempor  ea in  sint   ║
    ║   culpa                                   ipsum.   ║
    ║                                                    ║
    ║                                                    ║
    ║                                                    ║
    ╚════════════════════════════════════════════════════╝
`))

    el.props.padding = { top: 2, left: 6, right: 8, bottom: 1 }
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`
    ╔════════════════════════════════════════════════════╗
    ║                                                    ║
    ║                                                    ║
    ║      Eiusmod  nostrud deserunt  ex qui  in         ║
    ║      non    magna    velit   nulla    sint         ║
    ║      adipisicing  sit veniam  consectetur.         ║
    ║      Non minim sit cupidatat nulla nostrud         ║
    ║      cillum proident labore.  Sint amet eu         ║
    ║      pariatur  magna  laboris occaecat  in         ║
    ║      anim  consectetur  labore ipsum  esse         ║
    ║      Lorem   nostrud.  Labore   eu  aliqua         ║
    ║      dolore tempor ea in sint culpa ipsum.         ║
    ║                                                    ║
    ╚════════════════════════════════════════════════════╝
`))

    done()
  })

})
