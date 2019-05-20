import { Flor, FlorDocument } from '../src'
import { TextInputCursorMulti } from '../src'
import { BorderStyle } from '../src/util/border'
import { defaultTestSetup } from './testUtil'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('TextInputCursorMulti', () => {



  describe('multi up and down', () => {
    it('shoul1', async done => {
      const ed = new TextInputCursorMulti({
        text: `
Nulla ullamco esse in commodo commodo veniam.
Eiusmod voluptate cillum pariatur aliquip.
Laborum voluptate proident id proident ex non.
Non deserunt Lorem mollit qui sunt sint magna.
Commodo labore adipisicing ut enim in voluptate.
      `.trim(),
        pos: { col: 0, row: 0 },
        enabled: true
      })
      debugger
      expect(ed.charAtPos()).toBe('N')

      ed.down()
      expect(ed.charAtPos()).toBe('E')
      expect(ed.pos).toEqual({ row: 1, col: 0 })

      ed.up()
      expect(ed.charAtPos()).toBe('N')
      expect(ed.pos).toEqual({ row: 0, col: 0 })

      ed.right()
      expect(ed.charAtPos()).toBe('u')
      expect(ed.pos).toEqual({ row: 0, col: 1 })

      ed.down()
      expect(ed.charAtPos()).toBe('i')
      expect(ed.pos).toEqual({ row: 1, col: 1 })

      ed.rightWord()
      expect(ed.charAtPos()).toBe(' ')
      expect(ed.pos).toEqual({ row: 1, col: 7 })

      ed.rightWord()
      expect(ed.charAtPos()).toBe(' ')
      expect(ed.pos).toEqual({ row: 1, col: 17 })

      ed.rightWord()
      expect(ed.charAtPos()).toBe(' ')
      expect(ed.pos).toEqual({ row: 1, col: 24 })

      ed.down()
      expect(ed.charAtPos()).toBe('n')
      expect(ed.pos).toEqual({ row: 2, col: 24 })

      // ed.leftWord()                                   //  <---- error
      // expect(ed.charAtPos()).toBe(' ')
      // expect(ed.pos).toEqual({ row: 2, col: 19 })

      done()
    })

    it('enter keypress should create a new line splitting current line', async done => {
      const ed = new TextInputCursorMulti({
        text: `
Que los cumplas feliz,
QUe los cumplas feliz, 
Que los cumplas, que los cumplas
Que los cumplas feliz.
      `.trim(),
        pos: { col: 0, row: 0 },
        enabled: true
      })
      debugger
      expect(ed.charAtPos()).toBe('Q')

      ed.down()
      expect(ed.charAtPos()).toBe('Q')
      expect(ed.pos).toEqual({ row: 1, col: 0 })

      ed.rightWord()
      expect(ed.charAtPos()).toBe(' ')
      expect(ed.pos).toEqual({ row: 1, col: 3 })

      ed.rightWord()
      expect(ed.charAtPos()).toBe(' ')
      expect(ed.pos).toEqual({ row: 1, col: 7 })

      ed.rightWord()
      expect(ed.charAtPos()).toBe(' ')
      expect(ed.pos).toEqual({ row: 1, col: 15 })

      done()
    })

  })


  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)





//   xit('up and down', async done => {

// //     const text = `
// // Eu duis laborum est irure in consectetur. Amet consequat amet cillum aute. Sint reprehenderit nostrud sint dolore pariatur dolor fugiat. Eu ea consectetur aliquip nostrud magna voluptate adipisicing velit nostrud excepteur culpa dolore nulla quis. Sint irure ex esse veniam fugiat nostrud ut id sint sit cupidatat.

// // Nisi mollit ad aliqua tempor. Cillum nostrud culpa nostrud reprehenderit. Deserunt enim tempor commodo consectetur eu pariatur deserunt dolor. Sint irure do consequat laborum proident duis aliqua tempor do laboris consequat amet. Lorem excepteur elit aliqua et et.

// // Eu qui cupidatat eu est culpa quis. Reprehenderit magna cillum nulla sint aliqua laborum dolor. Consectetur magna consectetur eiusmod consectetur consectetur non. Consectetur amet ea id dolor eiusmod proident et exercitation do magna.
// // `

//     const text = `Eu duis laborum est irure in consectetur.
// Amet consequat amet cillum aute.
// Sint reprehenderit nostrud sint dolore pariatur dolor fugiat. `

//     const editor = new TextInputCursorMulti({ text: '' , pos: { col: 0, row: 0 }, enabled: true })

//     const a = <box textWrap={true} width={60} height={40} border={{ type: BorderStyle.heavy }} bg="blue" focusable={true} onClick={e => {
//       el.focus()
//       flor.cursor.show({
//         name: 'cursorTextEditorTest2', top: el.absoluteContentTop + editor.pos.row, left: el.absoluteContentLeft + editor.pos.col
//       })
//     }} onKeyPressed={e => {
//       editor.onKey(e)
//       el.childNodes[0]!.textContent = editor.value
//       el.render()
//       flor.program.cursorPos(el.absoluteContentTop + editor.pos.row, el.absoluteContentLeft + editor.pos.col)
//     }}>{text}</box>
//     const el = flor.create(a)
//     flor.render()
//     editor.value = el.childNodes[0]!.textContent || ''
//     flor.cursor.show({
//       name: 'cursorTextEditorTest2', top: el.absoluteContentTop + editor.pos.row, left: el.absoluteContentLeft + editor.pos.col
//     })
//     el.render()
//     done()
//   })

})
