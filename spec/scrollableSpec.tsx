import { array } from 'misc-utils-of-mine-generic'
import { BorderStyle, easing, FlorDocument, Layout } from '../src'
import { Scrollable } from '../src/component/scrollable'
import { Flor } from '../src/jsx/createElement'
import { char, color, int, words } from './data'
import { defaultTestSetup } from './testUtil'

describe('scrollable', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
    const el = <Scrollable {...{
      top: 8, left: 12, width: 24, height: 26, ch: char(),
      border: { type: BorderStyle.double }
    }}
        normalVerticalStep={3}
      >
        {words(3).join(' ')}sdf
      <box {...{ top: -5, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> first1 top el</box>
        <box {...{ top: 12, left: 1, width: 18, height: 14, bg: color(), ch: char() }}> {words(2).join(' ')}</box>
        <box {...{ top: 20, left: 12, width: 8, height: 18, bg: color(), ch: char() }}>  {words(2).join(' ')}</box>
        <box {...{ top: 35, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
        <box {...{ top: 46, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
        <box {...{ top: 78, left: 1, width: 18, height: 14, bg: color(), ch: char() }}> {words(1).join(' ')}</box>
        <box {...{ top: 99, left: 12, width: 8, height: 18, bg: color(), ch: char() }}> 7 {words(3).join(' ')}</box>
        <box {...{ top: 120, left: 9, width: 11, height: 14, bg: color(), ch: char() }}> 8 {words(5).join(' ')}</box>{}
      </Scrollable>
    flor.create(<box>Hello</box>)
    flor.create(el)
    flor.render()
    expect(flor.renderer.printBuffer(true)).toContain(`Hello`)
    done()
  })

  it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
    flor.debug('start')
    const a = <Scrollable
        top={10} left={20}
        width={55} height={23}
        border={{ type: BorderStyle.double }}
        preventChildrenCascade={true}
        layout={{
          layout: Layout.topDown
        }}
        normalVerticalStep={2}
        overflow="hidden"
        largeVerticalScrollStep={40}
        verticalAnimationDuration={1400}
        largeScrollAnimation={easing.easeOutBounce()}
      >
        {array(int(4, 11)).map(i =>
        <box ch=" "
        layout={{
          layout: Layout.leftRight
        }}
        bg={color()}
        height={int(7, 11)}
        width={ int(40, 85)}
         >{i} - - {words(4).join(', ')}
        {array(10).map(j =>

        <box
        ch=" " bg={color()}
        height={int(3, 7)}
        width={ int(14, 20)}
        >
        {i}, {j}
        </box>)}
        </box>)}
      </Scrollable>
    flor.create(<box>Hello</box>)
    const el = flor.create(a)
    flor.render()

    expect(flor.renderer.printBuffer(true)).toContain(`Hello`)
    done()
  })
})
