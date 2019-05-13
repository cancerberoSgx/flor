import { Flor, FlorDocument, Layout } from '../src'

describe('focus', () => {

  let flor: FlorDocument
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

    flor = new FlorDocument()
    flor.renderer.program.enableMouse()
    flor.renderer.program.hideCursor()
    flor.render()
  })
  afterEach(() => {
    flor.destroy()
  })

  it('should visit focusable elements', async done => {
    function msg(s: string) {
      flor.debug('msg:' + s)
    }
    const a = <box {...{ height: .9, width: .9, top: 0, left: 0, layout: { neverResizeContainer: true, layout: Layout['leftRight'] } }}>
      <box {...{ height: .9, width: .4, layout: { layout: Layout.topDown } }}>
        <box height={6} width={.9} focusable={true} onFocus={e => msg('button 1 focused')} onClick={e => msg('button 1 clicked')} >button1</box>
        <box height={6} width={.9} focusable={true} onFocus={e => msg('button 2 focused')} onClick={e => msg('button 2 clicked')} >button2</box>
        <box height={6} width={.9} focusable={true} onFocus={e => msg('button 3 focused')} onClick={e => msg('button 3 clicked')} >button3</box>
        <box height={6} width={.9} onFocus={e => msg('button 4 focused')} onClick={e => msg('button 4 clicked')} >button4</box>
      </box>
      <box {...{ height: .9, width: .57 }}></box>
    </box>
    1
    flor.create(a)
    flor.render()
    flor.events.addKeyListener(e => {
      if (e.name === 'tab') {
        flor.focus.focusNext()
      }
    })
    expect(flor.renderer.printBuffer(true)).not.toContain('msg:')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 1 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 2 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 3 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 1 focused')
    done()
  })
})
