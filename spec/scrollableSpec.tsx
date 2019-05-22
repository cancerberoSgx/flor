import { array, waitForPredicate } from 'misc-utils-of-mine-generic'
import { BorderStyle, debug, easing, FlorDocument, Layout } from '../src'
import { Scrollable } from '../src/component/scrollable'
import { Text } from '../src/component/text'
import { Flor } from '../src/jsx/createElement'
import { char, color, int, longText, words } from './data'
import { defaultTestSetup, expectNotToContain, willContain } from './testUtil'

describe('scrollable', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
    const el = <Scrollable {...{
      top: 8, left: 12, width: 24, height: 26, ch: char(),
      border: { type: BorderStyle.double }
    }} normalVerticalStep={3}>
      {words(3).join(' ')}sdf
      <el {...{ top: -5, left: 9, width: 11, height: 14, bg: color(), ch: char() }}>firstEl88</el>
      <el {...{ top: 12, left: 1, width: 18, height: 14, bg: color(), ch: char(), layout: { layout: Layout.topDown } }}>
        <el width={15} height={3}>visible3</el>
        <el width={15} height={3}>visible4</el>
      </el>
      <el {...{ top: 20, left: 12, width: 8, height: 18, bg: color(), ch: char() }}>  {words(2).join(' ')}</el>
      <el {...{ top: 35, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 4 {words(5).join(' ')}</el>{}
      <el {...{ top: 46, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 5 {words(3).join(' ')}</el>
      <el {...{ top: 78, left: 1, width: 18, height: 14, bg: color(), ch: char() }}> {words(1).join(' ')}</el>
      <el {...{ top: 99, left: 12, width: 8, height: 18, bg: color(), ch: char() }}> 7 {words(3).join(' ')}</el>
      <el {...{ top: 120, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 8 {words(5).join(' ')}</el>{}
    </Scrollable>
    flor.create(el)
    flor.render()
    await willContain(flor.renderer, 'visible3')
    expect(flor.renderer.printBuffer(true)).toContain('visible4')
    done()
  })

  it('should hide overflow and scroll vertical/horizontal with down and right arrows', async done => {
    const a = <Scrollable top={10} left={20} width={35} height={13}
      border={{ type: BorderStyle.double }} preventChildrenCascade={true}
      layout={{ layout: Layout.topDown }} normalVerticalStep={2} overflow="hidden" largeVerticalScrollStep={40}
      verticalAnimationDuration={1400} largeScrollAnimation={easing.easeOutBounce()}>
      <Text height={3} width={23}>firstChild123</Text>
      <Text height={17} width={58} border={{ type: BorderStyle.round }}
        padding={{ top: 1, right: 2, left: 3, bottom: 1 }}>
        Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum. Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Final words.</Text>
      <Text height={3} width={23}>lastChild123</Text>
    </Scrollable>

    const el = flor.create(a)
    flor.render()

    await willContain(flor.renderer, 'firstChild123')
    expect(flor.renderer.printBuffer(true)).not.toContain('Final words.')
    expect(flor.renderer.printBuffer(true)).not.toContain('lastChild123')

    // wont scroll if not focused
    el.key('down', 8)
    await willContain(flor.renderer, 'firstChild123')
    expect(flor.renderer.printBuffer(true)).not.toContain('Final words.')
    expect(flor.renderer.printBuffer(true)).not.toContain('lastChild123')

    // focus with click
    el.click()
    el.key('down', 8)
    await willContain(flor.renderer, 'lastChild123')
    expect(flor.renderer.printBuffer(true)).not.toContain('Final words.')
    expect(flor.renderer.printBuffer(true)).not.toContain('firstChild123')

    el.key('right', 20)
    await willContain(flor.renderer, 'Final words.')
    expect(flor.renderer.printBuffer(true)).not.toContain('firstChild123')
    expect(flor.renderer.printBuffer(true)).not.toContain('lastChild123')
    done()
  })

  it('should scroll text ', async done => {
    const value = 'hello scrolled world'
    const a = (
      <Scrollable top={1} left={2} width={25} height={12} rightExtraOffset={3} bottomExtraOffset={3}
        border={{ type: BorderStyle.double }} bg="green">
        <Text bg="red" top={13} left={14} height={23} width={58}
          linesAlign="center" wordsAlign="justify" border={{ type: BorderStyle.round }}
          padding={{ top: 1, right: 2, left: 3, bottom: 1 }}>
          Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.</Text>
      </Scrollable>
    )
    const el = flor.create(a)
    el.getComponent<Scrollable>()!.scroll({ x: 0, y: 0 })
    flor.render()
    await willContain(flor.renderer, '════════')
    expect(flor.renderer.printBuffer(true)).not.toContain('Eiusmod nostrud')
    el.getComponent<Scrollable>()!.scroll({ x: 18, y: 20 })
    flor.render()
    await willContain(flor.renderer, 'Eiusmod nostrud')
    done()
  })

  it('should scroll long text ', async done => {
    const a = (
      <Scrollable top={0} left={0} width={50} height={30} rightExtraOffset={3} bottomExtraOffset={3} focus={undefined}
        border={{ type: BorderStyle.double }}
        layout={{ layout: Layout.topDown }} preventChildrenCascade={true}  >
        {['First paragraph. ', ...longText().split('\n')].map(text =>
          <Text width={.999} border={undefined} focus={undefined}
            padding={{ top: 1, right: 2, left: 3, bottom: 1 }}
          >
            {text}</Text>
        )}
      </Scrollable>
    )
    const el = flor.create(a)
    el.getComponent<Scrollable>()!.scroll({ x: 0, y: 0 })
    flor.render()
    await willContain(flor.renderer, 'First paragraph')
    expectNotToContain(flor.renderer, 'Aliquip tempor')
    el.getComponent<Scrollable>()!.scroll({ x: 0, y: 100 })
    flor.render()
    debug(flor.printBuffer())
    await willContain(flor.renderer, 'Aliquip tempor')
    expectNotToContain(flor.renderer, 'First paragraph')
    done()
  })

  it('should scroll many children rows with', async done => {
    const a = <Scrollable top={10} left={20} width={55} height={23}
      border={{ type: BorderStyle.double }} preventChildrenCascade={true}
      layout={{ layout: Layout.topDown }} normalVerticalStep={2} overflow="hidden" largeVerticalScrollStep={40}
      verticalAnimationDuration={1400} largeScrollAnimation={easing.easeOutBounce()}>
      <el height={2} width={23}>firstChild123</el>
      {array(int(20)).map(i => <el ch=" " layout={{ layout: Layout.leftRight }}
        bg={color()} height={int(7, 11)} width={int(40, 85)}>
        {i} - - {words(4).join(', ')}
        {array(10).map(j =>
          <el ch=" " bg={color()} height={int(3, 7)} width={int(14, 20)}>
            {i}, {j}
          </el>)}
      </el>)}
    </Scrollable>
    const el = flor.create(a)
    flor.render()
    await waitForPredicate(() => flor.renderer.printBuffer(true).includes('firstChild123'))
    expect(flor.renderer.printBuffer(true)).toContain('0, 0')
    done()
  })
})
