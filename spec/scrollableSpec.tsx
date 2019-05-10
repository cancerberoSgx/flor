import { ProgramDocument, FlorDocument, BorderStyle, ProgramElement, KeyEvent, ProgramDocumentRenderer, ElementProps, debug } from '../src'
import { Component } from '../src/jsx/component'
import { Flor } from '../src/jsx/createElement'
import { isElement } from '../src/programDom/elementUtil'
import { trimRightLines } from '../src/util/misc'
import { createProgramRendererDocument } from '../src/util/util'
import { scrollable, Scrollable } from '../src/component/scrollable';
import { float } from './data';
import { asArray } from 'misc-utils-of-mine-generic';

describe('jsx', () => {
beforeEach(()=>{
  jasmine.DEFAULT_TIMEOUT_INTERVAL=99999
})
  
  fit('scrollable', async done => {
    
    try {
 
    
    
      
      const flor = new FlorDocument()
      const el = <Scrollable {...{top: 8, left: 12, width: 24, height: 26, ch: '0', border: { type: BorderStyle.double }}} >
      sfsdfsdfsdf
      <box {...{top: -5, left: 9, width: 11, height: 14, bg: 'red', ch: '2' }}> sdfsdf</box>
      <box {...{top: 12, left: 1, width: 18, height: 14, bg: 'blue', ch: 'i' }}> iiiii</box>
      <box {...{top: 20, left: 12, width: 8, height: 18, bg: 'green', ch: 'g' }}> green</box>
      <box {...{top: 35, left: 9, width: 11, height: 14, bg: 'red', ch: '2' }}> sdfsdaaaaaqqq</box>{}
      </Scrollable>
    
    flor.create(el)
    flor.debug('hello')
    flor.render()
    } catch (error) {
      debug('ERROR', 'error')
    }
      
  // const el = scrollable({document: doc, top: 8, left: 12, width: 24, height: 16, ch: '0', border: { type: BorderStyle.double },  
    //   children: [
    //   { top: -5, left: 9, width: 11, height: 14, bg: 'red', ch: '2' },
    //   { top: 11, left: 8, width: 3, height: 8, ch: 'K', fg: 'cyan' },
    //   { top: 23, left: 4, width: 4, height: 12, ch: '-', fg: 'magenta' },
    //   ]})
    // renderer.renderElement(el)
//     expect(renderer.printBuffer(true)).toContain(`
// `)
//     done()



  })

})

interface ScrollableProps extends Partial<ElementProps> {
  onScroll?: (e: { currentTarget: ProgramElement, Scrollable: string }) => void
  // children: JSX.FlorJsxNode | JSX.FlorJsxNode[]
  verticalStep?: number
  horizontalStep?: number
}
