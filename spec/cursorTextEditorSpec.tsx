import { BorderStyle, Flor, FlorDocument, KeyListener, ProgramElement, SingleLineTextInputCursor, TextInputCursorMulti } from '../src';
import { defaultTestSetup, expectNotToContain, expectToContain, willContain } from './testUtil';

describe('cursorTextEditor', () => {

  describe('single line', () => {

    let editor: SingleLineTextInputCursor
    let el: ProgramElement
    let flor: FlorDocument

    defaultTestSetup(f => {
      flor = f || flor;
      ({ el, editor } = build())
      return flor
    })

    it('should render value and cursor pos initially', async done => {
      expect(flor.printBuffer()).toContain('hello world')
      expect(editor.value).toBe('hello world')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      done()
    })

    it('cannot go left or up if at beginning of file', async done => {
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      el.key('right')
      expect(editor.pos).toEqual({ col: 1, row: 0 })
      el.key('left')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      el.key('left')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      el.key('right')
      el.key('right')
      el.key('right')
      expect(editor.pos).toEqual({ col: 3, row: 0 })
      el.key('up')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      el.key('up')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      done()
    })

    it('should backspace delete', async done => {
      expect(editor.value).toBe('hello world')
      expect(flor.printBuffer()).toContain('hello world')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      el.key('right')
      expect(editor.pos).toEqual({ col: 1, row: 0 })
      expect(editor.value).toBe('hello world')
      expect(flor.printBuffer()).toContain('hello world')
      el.key('backspace')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      expect(editor.value).toBe('ello world')
      expect(flor.printBuffer()).not.toContain('hello world')
      expect(flor.printBuffer()).toContain('ello world')

      el.key('backspace')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      expect(editor.value).toBe('ello world')
      expect(flor.printBuffer()).not.toContain('hello world')
      expect(flor.printBuffer()).toContain('ello world')

      el.key('right')
      el.key('right')
      el.key('right')
      expect(editor.pos).toEqual({ col: 3, row: 0 })
      expect(editor.value).toBe('ello world')
      expect(flor.printBuffer()).not.toContain('hello world')
      expect(flor.printBuffer()).toContain('ello world')

      el.key('backspace')
      expect(editor.pos).toEqual({ col: 2, row: 0 })
      expect(editor.value).toBe('elo world')
      expect(flor.printBuffer()).not.toContain('ello world')
      expect(flor.printBuffer()).toContain('elo world')

      el.key('down')
      expect(editor.pos).toEqual({ col: 9, row: 0 })
      expect(editor.value).toBe('elo world')
      expect(flor.printBuffer()).not.toContain('ello world')
      expect(flor.printBuffer()).toContain('elo world')

      el.key('backspace')
      expect(editor.pos).toEqual({ col: 8, row: 0 })
      expect(editor.value).toBe('elo worl')
      expect(flor.printBuffer()).not.toContain('elo world')
      expect(flor.printBuffer()).toContain('elo worl')
      done()
    })

    it('controlLeft and controlRight', async done => {
      expect(flor.printBuffer()).toContain('hello world')
      expect(editor.value).toBe('hello world')
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      el.key({ name: 'right', ctrl: true })
      expect(editor.pos).toEqual({ col: 5, row: 0 })
      el.key({ name: 'left', ctrl: true })
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      el.key({ name: 'right', ctrl: true })
      el.key({ name: 'right', ctrl: true })
      expect(editor.pos).toEqual({ col: 11, row: 0 })
      el.key({ name: 'left', ctrl: true })
      expect(editor.pos).toEqual({ col: 5, row: 0 })
      el.key({ name: 'left', ctrl: true })
      expect(editor.pos).toEqual({ col: 0, row: 0 })
      done()
    })

    function build() {
      const initialValue = 'hello world'
      el = flor.create(<el focusable={true} focused={true} top={10} left={8} width={33} height={3} border={{ type: BorderStyle.heavy }} bg="blue" onKeyPressed={e => {
        keyListener(e)
        el.childNodes[0].textContent = editor.value
        el.render()
        flor.program.cursorPos(11 + editor.pos.row, 9 + editor.pos.col)
      }}
      >{initialValue}</el>)
      flor.render()
      flor.cursor.show({
        name: 'cursorTextEditorTest1', top: 11, left: 9
      })

      let keyListener: KeyListener = e => { } // overrided by trextinputcursorr dont call!!
      editor = new SingleLineTextInputCursor({
        singleLine: true,
        text: initialValue,
        pos: { col: 0, row: 0 },
        addKeyListener: l => keyListener = l,
        enabled: true
      })
      return { el, editor }
    }

  })

  describe('multi line', () => {

    let flor: FlorDocument
    defaultTestSetup(f =>
      flor = f || flor
    )

    it('should render value and cursor pos initially', async done => {
      const text = `
Que los cumplas feliz,
QUe los cumplas feliz,
Que los cumplas, que los cumplas
Que los cumplas feliz.
      `.trim()
      const ed = new TextInputCursorMulti({
        text,
        pos: { col: 0, row: 0 },
        enabled: true
      })
      const el = flor.create(<el focusable={true} focused={true} top={10} left={18} width={33} height={23} border={{ type: BorderStyle.heavy }} bg="blue" onKeyPressed={e => {
        ed.onKey(e)
        el.empty()
        ed.value.split('\n').forEach((line, i) => {
          el.create({ children: [line], top: i, left: 0, width: .99, height: 1 })
        })
        el.childNodes[0].textContent = ed.value
        el.render()
        flor.cursor.show({
          name: 'cursorTextEditorTest1', top: el.absoluteContentTop + ed.pos.row, left: el.absoluteContentLeft + ed.pos.col
        })
      }}
      >{text.split('\n').map((line, i) => <el {...{ top: i, left: 0, width: .99, height: 1 }}>{line}</el>)}</el>)
      flor.render()
      // flor.cursor.show({
      //   name: 'cursorTextEditorTest1', top: el.absoluteContentTop, left: el.absoluteContentLeft
      // })
      await willContain(flor, 'Que los cumplas,')
      expectNotToContain(flor, '*um*')
      expectNotToContain(flor, '*plas*')
      el.key({ name: 'right', ctrl: true })
      el.key({ name: 'right', ctrl: true })
      el.key('right', 2)
      el.key('down')
      el.key('*')
      el.key('enter')
      el.key('*')
      el.key('right', 2)
      el.key('*')
      el.key('enter')
      el.key('*')
      el.key({ name: 'right', ctrl: true })
      el.key('*')
      el.key('enter')
      expectToContain(flor, '*um*')
      expectToContain(flor, '*plas*')

      done()
    })
  })
})
