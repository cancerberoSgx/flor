import { BorderStyle, Flor, FlorDocument, KeyListener, ProgramElement } from '../src'
import { SingleLineTextInputCursor, TextInputCursorMulti } from '../src/manager/textInputCursor'
import { defaultTestSetup } from './testUtil'

describe('should move right, left, rightWord, leftWord', () => {
  it('shoul1', async done => {
    const ed = new SingleLineTextInputCursor({
      text: `
Hello world
      `.trim(),
      pos: {col: 0, row: 0}, 
      enabled: true
    })
    expect(ed.charAtPos()).toBe('H')

    ed.up()
    expect(ed.charAtPos()).toBe('H')

    ed.right()
    expect(ed.charAtPos()).toBe('e')   

    ed.rightWord()
    expect(ed.charAtPos()).toBe(' ')
    expect(ed.pos).toEqual({row: 0, col:  5}) 

    ed.right()
    expect(ed.charAtPos()).toBe('w')

    ed.right()
    expect(ed.charAtPos()).toBe('o')
    expect(ed.pos).toEqual({row: 0, col: 7})

    ed.right()
    expect(ed.charAtPos()).toBe('r')
    expect(ed.pos).toEqual({row: 0, col: 8})

    ed.rightWord()
    expect(ed.charAtPos()).toBe('')
    expect(ed.pos).toEqual({row: 0, col: 11})   

    ed.leftWord()
    expect(ed.charAtPos()).toBe(' ')
    expect(ed.pos).toEqual({row: 0, col:  5}) 

    ed.leftWord()
    expect(ed.charAtPos()).toBe('H')
    expect(ed.pos).toEqual({row: 0, col:  0}) 

    // expect(ed.charAtPos()).toBe('w')
    // expect(ed.pos).toEqual({row: 0, col: 11})

    done()
  })


describe('multi up and down', () => {
  xit('shoul1', async done => {
    const ed = new TextInputCursorMulti({
      text: `
Nulla ullamco esse in commodo commodo veniam. 
Eiusmod voluptate cillum pariatur aliquip. 
Laborum voluptate proident id proident ex non. 
Non deserunt Lorem mollit qui sunt sint magna.
Commodo labore adipisicing ut enim in voluptate.
      `.trim(),
      pos: {col: 0, row: 0}, 
      enabled: true
    })
    expect(ed.charAtPos()).toBe('N')

    ed.down()
    expect(ed.charAtPos()).toBe('E')
    expect(ed.pos).toEqual({row: 1, col:  0}) 

    done()
  })
})


})
