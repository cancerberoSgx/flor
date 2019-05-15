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

    const el =  flor.create(<Text width={38} top={3} left={4}  height={16}
   padding={{ top: 1, right: 2, left: 3, bottom: 1 } }  border={{ type: BorderStyle.double }}>
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

    const el =  text({ width: 38, top: 3 , left: 4 , height: 16
   , padding: { top: 1, right: 2, left: 3, bottom: 1 } , border: { type: BorderStyle.double }, children: ['Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.']})

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
    const el =  flor.create(<Text width={38} top={3} left={4}  height={22} direction="column"
    padding={{top: 1, right: 2, left: 3, bottom: 1} }  border={{type: BorderStyle.double}}>
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
    const el =  flor.create(<Text width={38} top={3} left={4}  height={16} wordsAlign="justify"
   padding={{ top: 1, right: 2, left: 3, bottom: 1 } }  border={{ type: BorderStyle.double }}>
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
    const el =  flor.create(<Text width={48} top={3} left={4}  height={16} wordsAlign="center"
   padding={{ top: 1, right: 2, left: 3, bottom: 1 } }  border={{ type: BorderStyle.double }}>
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
    const el =  flor.create(<Text width={52} top={1} left={4}  height={18}  linesAlign="bottom"
   padding={{ top: 1, right: 2, left: 3, bottom: 1 } }  border={{ type: BorderStyle.double }}>
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
    const el =  flor.create(<Text width={52} top={1} left={4}  height={18}  linesAlign="center" wordsAlign="justify"
   padding={{ top: 1, right: 2, left: 3, bottom: 1 } } border={{ type: BorderStyle.double }}>
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

})

//   it('default behavior', async done => {

//    const el =  flor.create(<Text width={28} top={2} left={4} fg="red" height={16  }
//    padding={{top: 1, right: 2, left: 3, bottom: 1} } bg="green"
//    newLineString="-0-0-" border={{type: BorderStyle.double}}>
// {'-0-0-'}
// Músicos
// {'-0-0-'}
// Tom Jobim (piano, violão e cravo), {'-0-0-'}
// Ron Carter (contrabaixo), Dom Um Romão (bateria),{'-0-0-'}

// Bobby Rosengardarden (bateria){'-0-0-'}{'-0-0-'}
// Claudio Slon (bateria), Joseph Singer (trompa), {'-0-0-'}
// {'-0-0-'}{'-0-0-'}{'-0-0-'}{'-0-0-'}Ray Beckenstein (flauta e flautim), Romeo Penque (flauta e flautim){'-0-0-'}
// Jerome Richardson (flauta e flautim), Urbie Green (trombone), Bernard Eichein (violino){'-0-0-'}
// {'-0-0-'}
// {'-0-0-'}
// Paul Gershman (violino), Emanuel Green (violino), Louis Haber (violino){'-0-0-'}
// {'-0-0-'}
// {'-0-0-'}
// {'-0-0-'}
// Julius Held (violino), Leo Kruczeck (violino), {'-0-0-'}
// Harry Lookofsky (violino), Joseph Malignaggi (violino){'-0-0-'}
// Gene Orloff (violino), Raoul Poliakin (violino){'-0-0-'}
// {'-0-0-'}
//     </Text>)
//     flor.render()
//     flor.render(el)
//     expect(flor.renderer.printBuffer(true)).toContain(trimRightLines(`

//     ╔══════════════════════════╗
//     ║                          ║
//     ║                          ║
//     ║    Músicos               ║
//     ║    Tom Jobim (piano, viol║o e cravo),
//     ║    Ron Carter (contrabaix║), Dom Um Romão (bateria),
//     ║    Bobby Rosengardarden (║ateria)
//     ║                          ║
//     ║    Claudio Slon (bateria)║ Joseph Singer (trompa),
//     ║                          ║
//     ║                          ║
//     ║                          ║
//     ║                          ║
//     ║    Ray Beckenstein (flaut║ e flautim), Romeo Penque (flauta e flautim)
//     ║    Jerome Richardson (fla║ta e flautim), Urbie Green (trombone), Bernard Eichein (violino)
//     ╚══════════════════════════╝

//          Paul Gershman (violino), Emanuel Green (violino), Louis Haber (violino)

//          Julius Held (violino), Leo Kruczeck (violino),
//          Harry Lookofsky (violino), Joseph Malignaggi (violino)
//          Gene Orloff (violino), Raoul Poliakin (violino)
// `))
//     done()
//   })

// })

//   let flor: FlorDocument
//   defaultTestSetup(f => flor = f || flor)

//   it('should print lines identical to originals padding to the right with parents ch by default', async done => {

//    const el =  flor.create(<Text width={0.7} top={2} left={4} fg="red" height={0.6} newLineString="$$$" border={{type: BorderStyle.round}}>
// Eu duis laborum est irure in consectetur. Amet consequat amet cillum aute. Sint reprehenderit nostrud sint dolore pariatur dolor fugiat.
// {'$$$'}

// Eu ea consectetur aliquip nostrud magna voluptate adipisicing velit nostrud excepteur culpa dolore nulla quis. Sint irure ex esse veniam fugiat nostrud ut id sint sit cupidatat.

// {'$$$' /** heads up, we need tp add these spaces in order to separate in different JSXTextNodes. Since JSX in general will remove text spaces. See https://github.com/facebook/jsx/issues/19 */}

// Nisi mollit ad aliqua tempor. Cillum nostrud culpa nostrud reprehenderit. Deserunt enim tempor commodo consectetur eu pariatur deserunt dolor. Sint irure do consequat laborum proident duis aliqua tempor do laboris consequat amet. Lorem excepteur elit aliqua et et.

// {'$$$'}

// Eu qui cupidatat eu est culpa quis. Reprehenderit magna cillum nulla sint aliqua laborum dolor. Consectetur magna consectetur eiusmod consectetur consectetur non. Consectetur amet ea id dolor eiusmod proident et exercitation do magna.
// {'$$$'}

// And anoter paragraph
// {'$$$'}

// Eu qui cupidatat eu est culpa quis. Reprehenderit magna cillum nulla sint aliqua laborum dolor. Consectetur magna consectetur eiusmod consectetur consectetur non. Consectetur amet ea id dolor eiusmod proident et exercitation do magna.

//     </Text>)

// debug(el.debug())
//     flor.render()
//     flor.render(el)
// //     expect(flor.renderer.printBuffer(true)).toContain(`

// //       hello world_____
// //       ________________
// //       ________________
// //       ________________
// //       ________________
// //       ________________
// // `)
    // done()
  // })
