import { BorderStyle, Flor, FlorDocument, Input, input, MouseAction, ProgramElement } from '../src'
describe('input component', () => {

  let flor: FlorDocument
  beforeEach(() => {
    flor = new FlorDocument()
    flor.renderer.program.enableMouse()
    flor.renderer.program.hideCursor()
    flor.render()
  })
  afterEach(() => {
    flor.destroy()
  })

  function test(el: ProgramElement, flor: FlorDocument) {
    expect(!!el.props.input).toBe(false)
    expect(!!el.props.value).toBe(false)
    expect(flor.renderer.program.cursorHidden).toBe(true)
    expect(flor.renderer.printBuffer()).not.toContain('value===')
    flor.events.triggerMouseEvent({
      action: MouseAction.mouseup,
      x: 9, y: 11, button: 'left'
    })
    expect(flor.renderer.program.cursorHidden).toBe(false)
    expect(!!el.props.input).toBe(false)
    expect(!!el.props.value).toBe(false)
    expect(flor.renderer.printBuffer()).not.toContain('value===')
    flor.events.triggerKeyEvent('a')
    expect(el.props.input).toBe('a')
    expect(!!el.props.value).toBe(false)
    expect(flor.renderer.printBuffer()).not.toContain('value===')
    flor.events.triggerKeyEvent('b')
    expect(el.props.input).toBe('ab')
    expect(!!el.props.value).toBe(false)
    expect(flor.renderer.printBuffer()).not.toContain('value===')
    flor.events.triggerKeyEvent('c')
    expect(el.props.input).toBe('abc')
    expect(!!el.props.value).toBe(false)
    expect(flor.renderer.printBuffer()).not.toContain('value===')
    flor.events.triggerKeyEvent(undefined, { name: 'enter' })
    expect(el.props.input).toBe('abc')
    expect(el.props.value).toBe('abc')
    expect(flor.renderer.printBuffer()).toContain('*value===abc*')
  }

  it('Input should grab user input', async done => {
    const p = <Input top={10} left={8} width={15} height={3} border={{ type: BorderStyle.heavy }} bg="blue" onChange={e => flor.debug('*value===' + e.value + '*')} />
    const el = flor.create(p)
    flor.render()
    test(el, flor)
    done()
  })
  
  it('plain input should grab user input', async done => {
    const p = input({ top: 10, left: 8, height: 3, width: 15, border: { type: BorderStyle.heavy }, bg: 'blue', onChange: e => flor.debug('*value===' + e.value + '*') , document: flor.document })
    flor.render(p)
    flor.render()
    test(p, flor)
    done()
  })
})

