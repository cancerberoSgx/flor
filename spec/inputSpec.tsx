import { BorderStyle, Flor, FlorDocument, Input, input, ProgramElement } from '../src'

describe('input', () => {
  function test(f: (flor: FlorDocument) => ProgramElement) {
    let flor: FlorDocument = null as any
    let el: ProgramElement

    beforeEach(() => {
      flor = new FlorDocument()
      el = f(flor)
      flor.render()
      m=''
    })
    afterEach(() => {
      flor.destroy()
    })

    it('initial state', done => {
      expect(!!el.props.input).toBe(false)
      expect(!!el.props.value).toBe(false)
      expect(flor.renderer.program.cursorHidden).toBe(true)
      expect(m).not.toContain('value===')
      done()
    })

    it('focus should not change state', done => {
      flor.events.click(el)
      expect(flor.renderer.program.cursorHidden).toBe(false)
      expect(!!el.props.input).toBe(false)
      expect(!!el.props.value).toBe(false)
      expect(m).not.toContain('value===')
      done()
    })

    it('input "a"', done => {
      flor.events.click(el)
      flor.events.triggerKeyEvent('a')
      expect(el.props.input).toBe('a')
      expect(!!el.props.value).toBe(false)
      expect(m).not.toContain('value===')
      done()
    })

    it('input "b"', done => {
      flor.events.click(el)
      flor.events.triggerKeyEvent('a')
      flor.events.triggerKeyEvent('b')
      expect(el.props.input).toBe('ab')
      expect(!!el.props.value).toBe(false)
      done()
    })

    it('input "c"', done => {
      expect(m).not.toContain('value===')
      flor.events.click(el)
      flor.events.triggerKeyEvent('a')
      flor.events.triggerKeyEvent('b')
      flor.events.triggerKeyEvent('c')
      expect(el.props.input).toBe('abc')
      expect(!!el.props.value).toBe(false)
      expect(m).not.toContain('value===')
      done()
    })
    it('"!enter"', done => {
      expect(m).not.toContain('value===')
      flor.events.click(el)
      flor.events.triggerKeyEvent('a')
      flor.events.triggerKeyEvent('b')
      flor.events.triggerKeyEvent('c')
      flor.events.triggerKeyEvent(undefined, { name: 'enter' })
      expect(el.props.input).toBe('abc')
      expect(el.props.value).toBe('abc')
      expect(m).toContain('*value===abc*')
      done()
    })
  }
  let m = ''
  function msg(s: string) {
    m = 'msg:' + s
  }
  describe('component', () => {
    test(flor => flor.create(<Input top={10} left={8} width={15} height={3}  border={{ type: BorderStyle.heavy }} bg="blue" onChange={e => msg('*value===' + e.value + '*')} />))
  })

  describe('plain function', () => {
    test(flor => flor.create(input({
      top: 10, left: 8, height: 3, width: 15, border: { type: BorderStyle.heavy }, bg: 'blue', onChange: e => {
        msg('*value===' + e.value + '*')
      }, document: flor.document
    })))
  })
})
