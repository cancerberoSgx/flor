import { array, waitForPredicate } from 'misc-utils-of-mine-generic'
import { BorderStyle, easing, FlorDocument, Layout, Input } from '../src'
import { Scrollable } from '../src/component/scrollable'
import { Flor } from '../src/jsx/createElement'
import { char, color, int, words } from './data'
import { defaultTestSetup } from './testUtil'

describe('scrollable', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
    const el = <Scrollable {...{top: 8, left: 12, width: 24, height: 26, ch: char(),
      border: { type: BorderStyle.double }}}normalVerticalStep={3}>
      {words(3).join(' ')}sdf
      <box {...{ top: -5, left: 9, width: 11, height: 14, bg: color(), ch: char() }}>firstEl88</box>
      <box {...{ top: 12, left: 1, width: 18, height: 14, bg: color(), ch: char(), layout: { layout: Layout.topDown } }}>
        <box width={15} height={3}>visible3</box>
        <box width={15} height={3}>visible4</box>
      </box>
      <box {...{ top: 20, left: 12, width: 8, height: 18, bg: color(), ch: char() }}>  {words(2).join(' ')}</box>
      <box {...{ top: 35, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
      <box {...{ top: 46, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
      <box {...{ top: 78, left: 1, width: 18, height: 14, bg: color(), ch: char() }}> {words(1).join(' ')}</box>
      <box {...{ top: 99, left: 12, width: 8, height: 18, bg: color(), ch: char() }}> 7 {words(3).join(' ')}</box>
      <box {...{ top: 120, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 8 {words(5).join(' ')}</box>{}
    </Scrollable>
    flor.create(el)
    flor.render()
    await waitForPredicate(() => flor.renderer.printBuffer(true).includes('visible3'))
    expect(flor.renderer.printBuffer(true)).toContain('visible4')
    done()
  })

  it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
    const a = <Scrollable top={10} left={20} width={55} height={23}
      border={{ type: BorderStyle.double }} preventChildrenCascade={true}
      layout={{ layout: Layout.topDown }} normalVerticalStep={2} overflow="hidden" largeVerticalScrollStep={40}
      verticalAnimationDuration={1400} largeScrollAnimation={easing.easeOutBounce()}>
      <box height={2} width={23}>firstChild123</box>
      {array(int(4, 11)).map(i => <box ch=" " layout={{ layout: Layout.leftRight }}
        bg={color()} height={int(7, 11)} width={int(40, 85)}>
        {i} - - {words(4).join(', ')} {array(10).map(j =>
          <box ch=" " bg={color()} height={int(3, 7)} width={int(14, 20)}>
            {i}, {j}
          </box>)}
      </box>)}
    </Scrollable>
    flor.create(<box>Hello</box>)
    const el = flor.create(a)
    flor.render()
    await waitForPredicate(() => flor.renderer.printBuffer(true).includes('firstChild123'))
    expect(flor.renderer.printBuffer(true)).toContain('0, 0')
    done()
  })  

  xit('should scroll text ', async done => {
    const value = "hello scrolled world"
    const a = (
    <Scrollable top={1} left={2} width={15} height={5} leftExtraOffset={5}
      border={{ type: BorderStyle.double }}>
     <Input 
     top={0} left={0} border={{ type: BorderStyle.double }}
     height={3} width={value.length + 4} value={value}></Input>
     </Scrollable>
    )
    const el = flor.create(a)
    flor.render()
    // await waitForPredicate(() => flor.renderer.printBuffer(true).includes('hello'))
    // expect(flor.renderer.printBuffer(true)).toContain('0, 0')
    // done()
  })

})
