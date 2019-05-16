import { Flor, FlorDocument, Layout } from '../src'
import { defaultTestSetup } from './testUtil'

describe('focus', () => {
  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should visit focusable elements', async done => {
    function msg(s: string) {
      flor.debug('msg:' + s)
    }
    const a = <el {...{ height: .9, width: .9, top: 0, left: 0, layout: { neverResizeContainer: true, layout: Layout['leftRight'] } }}>
      <el {...{ height: .9, width: .4, layout: { layout: Layout.topDown } }}>
        <el height={6} width={.9} focusable={true} onFocus={e => msg('button 1 focused')} onClick={e => msg('button 1 clicked')} >button1</el>
        <el height={6} width={.9} focusable={true} onFocus={e => msg('button 2 focused')} onClick={e => msg('button 2 clicked')} >button2</el>
        <el height={6} width={.9} focusable={true} onFocus={e => msg('button 3 focused')} onClick={e => msg('button 3 clicked')} >button3</el>
        <el height={6} width={.9} onFocus={e => msg('button 4 focused')} onClick={e => msg('button 4 clicked')} >button4</el>
      </el>
      <el {...{ height: .9, width: .57 }}></el>
    </el>
    1
    flor.create(a)
    flor.render()
    flor.events.addKeyListener(e => {
      if (!e.ctrl && e.name === 'tab') {
        flor.focus.focusNext()
      }
      if (e.ctrl && e.name === 'tab') {
        flor.focus.focusPrevious()
      }
    })
    expect(flor.renderer.printBuffer(true)).not.toContain('msg:')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 1 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 2 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 3 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab', ctrl: true })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 2 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    flor.events.triggerKeyEvent(undefined, { name: 'tab' })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 1 focused')
    flor.events.triggerKeyEvent(undefined, { name: 'tab', ctrl: true })
    expect(flor.renderer.printBuffer(true)).toContain('msg:button 3 focused')
    done()
  })
})
