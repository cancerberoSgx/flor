import { SingleLineTextInputCursor } from '../src'

describe('should move right, left, rightWord, leftWord', () => {
  it('shoul1', async done => {
    const ed = new SingleLineTextInputCursor({
      text: `
Hello world
      `.trim(),
      pos: { col: 0, row: 0 },
      enabled: true
    })
    expect(ed.charAtPos()).toBe('H')

    ed.up()
    expect(ed.charAtPos()).toBe('H')

    ed.right()
    expect(ed.charAtPos()).toBe('e')

    ed.rightWord()
    expect(ed.charAtPos()).toBe(' ')
    expect(ed.pos).toEqual({ row: 0, col: 5 })

    ed.right()
    expect(ed.charAtPos()).toBe('w')

    ed.right()
    expect(ed.charAtPos()).toBe('o')
    expect(ed.pos).toEqual({ row: 0, col: 7 })

    ed.right()
    expect(ed.charAtPos()).toBe('r')
    expect(ed.pos).toEqual({ row: 0, col: 8 })

    ed.rightWord()
    expect(ed.charAtPos()).toBe('')
    expect(ed.pos).toEqual({ row: 0, col: 11 })

    ed.leftWord()
    expect(ed.charAtPos()).toBe(' ')
    expect(ed.pos).toEqual({ row: 0, col: 5 })

    ed.leftWord()
    expect(ed.charAtPos()).toBe('H')
    expect(ed.pos).toEqual({ row: 0, col: 0 })

    // expect(ed.charAtPos()).toBe('w')
    // expect(ed.pos).toEqual({row: 0, col: 11})

    done()
  })

})
