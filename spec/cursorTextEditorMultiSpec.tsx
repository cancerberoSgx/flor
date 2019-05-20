import { TextInputCursorMulti } from '../src'

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

      ed.enter()
      expect(ed.value).toContain(`
Que los cumplas feliz,
QUe los cumplas
 feliz,
Que los cumplas, que los cumplas
Que los cumplas feliz.`.trim())
      expect(ed.charAtPos()).toBe(' ')
      expect(ed.pos).toEqual({ row: 2, col: 0 })

      ed.right()
      ed.right()
      expect(ed.charAtPos()).toBe('e')
      expect(ed.pos).toEqual({ row: 2, col: 2 })
      done()
    })

  })
})
