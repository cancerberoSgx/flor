 import { BorderStyle, debug, Flor, FlorDocument, isElement, Layout } from '../src'
import { Button } from '../src/component/button'
import { color } from './data'
import { defaultTestSetup } from './testUtil'

describe('button', () => {
      // let flor: FlorDocumentTesting
      // beforeEach(() => {
      //   flor = new FlorDocumentTesting({
      //     // documentImplementation() { return new YogaDocument() }
      //   })
      // })
      // afterEach(() => {
      //   flor.destroy()
      // })

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

      // let flor: FlorDocument
      // defaultTestSetup(f => flor = f || flor)

  xit('button Component', async done => {
        //   function msg(s:string){}
        //   const a = <el {...{ height: .9, width: .9, top: 0, left: 0, layout: { neverResizeContainer: true, layout: Layout['leftRight'] } }}>
        //   <el {...{ height: .9, width: .4, layout: { layout: Layout.topDown } }}>
        //     <el height={6} width={.9} focusable={true} onFocus={e => msg('button 1 focused')} onClick={e => msg('button 1 clicked')} >button1</el>
        //     <el height={6} width={.9} focusable={true} onFocus={e => msg('button 2 focused')} onClick={e => msg('button 2 clicked')} >button2</el>
        //     <el height={6} width={.9} focusable={true} onFocus={e => msg('button 3 focused')} onClick={e => msg('button 3 clicked')} >button3</el>
        //     <el height={6} width={.9} onFocus={e => msg('button 4 focused')} onClick={e => msg('button 4 clicked')} >button4</el>
        //   </el>
        //   <el {...{ height: .9, width: .57 }}></el>
        // </el>
        // 1
        try {

          let counter = 0
          const p = <el  {...{ height: .9, width: .9, top: 0, left: 0 }}
        border={{ type: BorderStyle.doubleLight }}
        layout={{ layout: Layout.leftRight }}
        > b1

        >
        <el width={9} height={8} top={2} left={8} bg={color()}>s</el>

        <el width={9} height={8} top={2} left={13} fg={color()}> b2</el>
        <el width={9} height={8} top={12} left={8} fg={color()}> b3</el>

        <box width={4} height={9} top={22} left={13} bg={color()}> b4</box>

        <el width={9} height={8} top={12} left={29} fg={color()} > b2</el>
        <Button border={{ type: BorderStyle.doubleLight }}  width={4} height={9} onClick={e => {
          const s = e.currentTarget!.previousSibling()
          // debug(isElement(s) &&  s.debugAsJson())
          if (s && isElement(s)) {
            // s.findDescendant(isDomText)!.textContent = 'COUN' + counter++
            // debug('HSHSH', s.findDescendantTextNodeContaining('') && s.findDescendantTextNodeContaining('')!.textContent)
            s.findDescendantTextNodeContaining('')!.textContent = 'COUN' + counter++

            // s.empty()

            // s!.textContent= 'COUN' + counter++
            flor.render(s)
            flor.render()
          }
        }}>CLICK ME</Button>

        </el>
          {/* <el width={10} height={2}>text1</el> */}
          {/* <Button border={{type: BorderStyle.doubleLight}} onClick={e => {
          e.currentTarget!.previousSibling()!.textContent= 'clicked_' + counter++
          flor.render()
        }}>CLICK ME</Bu                                }

          flor.create(p)
          flor.render()
        // </el>

        // {/* <Rando          }
        // {/* <Button onClick={e => {
        //   e.currentTarget!.childNodes[0]!.textContent = 'clicked_' + counter++
        //   flor.renderer.renderElement(le)
        // }}>CLICK ME2</Button>
        // <el width={10} height={2}>text2</el> */}
        // flor.create(p)
        // flor.render()
        // // const le = flor.create(p)
        // // done()

        } catch (error) {
          debug(error)
        }

      })

})
