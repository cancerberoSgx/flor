import { BorderStyle, Flor, FlorDocument, ProgramElement } from '../src'
import { defaultTestSetup } from './testUtil'
import { SingleLineCursorTextEditor } from '../src/manager/cursorTextEditor';

describe('cursorTextEditor', () => {
 

describe('single line', () => {
  let flor: FlorDocument
  defaultTestSetup(f => {

function build( ) {
  const initialValue = 'hello world';
  el = flor.create(<box top={10} left={8} width={33} height={3} border={{ type: BorderStyle.heavy }} bg="blue">{initialValue}</box>);
  flor.debug('teCst');
  flor.render();
  flor.cursor.show({
    name: 'cursorTextEditorTest1', top: 11, left: 9
  });
  editor = new SingleLineCursorTextEditor({
  singleLine: true, text: initialValue, pos: { col: 0, row: 0 }, origin: { row: 11, col: 9 }, cursor: flor.cursor, addKeyListener: l => {
    flor.events.addKeyListener(e => {
      flor.debug(e);
      l(e);
      el.childNodes.item(0)!.textContent = editor.value;
      el.render();
      flor.program.cursorPos(11 + editor.pos.row, 9 + editor.pos.col);
    });
  }
  })
  return { el, editor };
}

    flor =  f || flor;
    ({ el, editor } = build());
   return flor
  }) 
  
  let editor: SingleLineCursorTextEditor
  let el : ProgramElement



  it('should render value and cursor pos initially', async done => {
    expect(flor.printBuffer()).toContain('hello world')
    expect(editor.value).toBe('hello world')
    expect(editor.pos).toEqual({col: 0, row: 0})
    done()
  })
  it('cannot go left or up if at beginning of file', async done => {
    expect(editor.pos).toEqual({col: 0, row: 0})
    el.key('right')
    expect(editor.pos).toEqual({col: 1, row: 0})
    el.key('left')
    expect(editor.pos).toEqual({col: 0, row: 0})
    el.key('left')
    expect(editor.pos).toEqual({col: 0, row: 0})
    el.key('right')
    el.key('right')
    el.key('right')
    expect(editor.pos).toEqual({col: 3, row: 0})
    el.key('up')
    expect(editor.pos).toEqual({col: 0, row: 0})
    el.key('up')
    expect(editor.pos).toEqual({col: 0, row: 0})
    done()
  })
  
  it('should backspace delete', async done => {
    expect(editor.value).toBe('hello world')  
    expect(flor.printBuffer()).toContain('hello world')
    expect(editor.pos).toEqual({col: 0, row: 0})
    el.key('right')    
    expect(editor.pos).toEqual({col: 1, row: 0})
    expect(editor.value).toBe('hello world')
    expect(flor.printBuffer()).toContain('hello world')
    el.key('backspace')    
    expect(editor.pos).toEqual({col: 0, row: 0})
    expect(editor.value).toBe('ello world')
    expect(flor.printBuffer()).not.toContain('hello world')
    expect(flor.printBuffer()).toContain('ello world')

    el.key('backspace')    
    expect(editor.pos).toEqual({col: 0, row: 0})
    expect(editor.value).toBe('ello world')
    expect(flor.printBuffer()).not.toContain('hello world')
    expect(flor.printBuffer()).toContain('ello world')

    el.key('right')
    el.key('right')
    el.key('right')
    expect(editor.pos).toEqual({col: 3, row: 0})
    expect(editor.value).toBe('ello world')
    expect(flor.printBuffer()).not.toContain('hello world')
    expect(flor.printBuffer()).toContain('ello world')

    el.key('backspace')    
    expect(editor.pos).toEqual({col: 2, row: 0})
    expect(editor.value).toBe('elo world')
    expect(flor.printBuffer()).not.toContain('ello world')
    expect(flor.printBuffer()).toContain('elo world')

    el.key('down')
    expect(editor.pos).toEqual({col: 9, row: 0})
    expect(editor.value).toBe('elo world')
    expect(flor.printBuffer()).not.toContain('ello world')
    expect(flor.printBuffer()).toContain('elo world')

    el.key('backspace')    
    expect(editor.pos).toEqual({col: 8, row: 0})
    expect(editor.value).toBe('elo worl')
    expect(flor.printBuffer()).not.toContain('elo world')
    expect(flor.printBuffer()).toContain('elo worl')

    done()
  })
})
})

