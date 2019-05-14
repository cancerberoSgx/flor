import { FlorDocument, Flor } from '../src'
import { BorderStyle } from '../src/util/border'
import { createElement } from '../src/util/util'
import { defaultTestSetup } from './testUtil'
import { TextInputCursorMulti } from '../src/manager/TextInputCursor';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

xdescribe('TextInputCursorMulti', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('up and down', async done => {

//     const text = `
// Eu duis laborum est irure in consectetur. Amet consequat amet cillum aute. Sint reprehenderit nostrud sint dolore pariatur dolor fugiat. Eu ea consectetur aliquip nostrud magna voluptate adipisicing velit nostrud excepteur culpa dolore nulla quis. Sint irure ex esse veniam fugiat nostrud ut id sint sit cupidatat.

// Nisi mollit ad aliqua tempor. Cillum nostrud culpa nostrud reprehenderit. Deserunt enim tempor commodo consectetur eu pariatur deserunt dolor. Sint irure do consequat laborum proident duis aliqua tempor do laboris consequat amet. Lorem excepteur elit aliqua et et.

// Eu qui cupidatat eu est culpa quis. Reprehenderit magna cillum nulla sint aliqua laborum dolor. Consectetur magna consectetur eiusmod consectetur consectetur non. Consectetur amet ea id dolor eiusmod proident et exercitation do magna.
// `

const text = `Eu duis laborum est irure in consectetur. 
Amet consequat amet cillum aute.
Sint reprehenderit nostrud sint dolore pariatur dolor fugiat. `


    const editor = new TextInputCursorMulti({text: '' , pos: {col: 0, row: 0}, enabled: true})

    const a = <box textWrap={true} width={60} height={40} border={{ type: BorderStyle.heavy }} bg="blue" focusable={true} onClick={e=>{
      el.focus()
      flor.cursor.show({
        name: 'cursorTextEditorTest2', top: el.absoluteContentTop+editor.pos.row, left: el.absoluteContentLeft+editor.pos.col
      })
    }} onKeyPressed={e=>{
      editor.onKey(e)
      el.childNodes.item(0)!.textContent = editor.value;
      el.render();
      flor.program.cursorPos(el.absoluteContentTop + editor.pos.row, el.absoluteContentLeft + editor.pos.col);  
    }}>{text}</box>
    const el = flor.create(a)
    flor.render()
    editor.value = el.childNodes.item(0)!.textContent||''
    flor.cursor.show({
      name: 'cursorTextEditorTest2', top: el.absoluteContentTop+editor.pos.row, left: el.absoluteContentLeft+editor.pos.col
    })
    el.render()
    done()
  })

})
