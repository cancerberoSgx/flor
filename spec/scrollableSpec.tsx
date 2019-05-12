import { array } from 'misc-utils-of-mine-generic'
import { BorderStyle, debug, FlorDocument, Layout } from '../src'
import { Scrollable } from '../src/component/scrollable'
import { Flor } from '../src/jsx/createElement'
import { char, color, int, words } from './data'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

xdescribe('scrollable', () => {
  let flor: FlorDocument
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999
    //     flor = new FlorDocument({buffer: true})
    //     flor.render()
    process.on('uncaughtException', function(err) {
      flor.destroy()
      console.log('Caught exception: ' + err, err, err.stack)
      process.exit(1)
    })
  })
  afterEach(() => {
    flor.destroy()
  })
  it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
    try {
      const el = <Scrollable {...{
        top: 8, left: 12, width: 24, height: 26, ch: char(),
        border: { type: BorderStyle.double }
      }}
        verticalStep={3}
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

      flor.create(el)
      // expect(flor.renderer.printBuffer(true)).toContain(`first1 top el`)
      done()
    } catch (error) {
      debug('ERROR', error)
    }
  })
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999
  it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
    try {
      // const flor = new FlorDocument({
      //   buffer: true
      //   // useAnsiDiff: true
      // })

      const a = <Scrollable {...{
        top: 3, left: 3, width: 55, height: 23,
        border: { type: BorderStyle.double }
      }}
        preventChildrenCascade={true}
        layout={{
          layout: Layout.topDown,
          manualLayout: true,
          neverResizeContainer: true
        }}
        verticalStep={2}
        fastVerticalScrollStep={40}
        verticalAnimationDuration={1000}
        onScroll={e => { debug('scroll ' + e) }}
      >
        {array(80).map(i => <box {...{ width: int(20, 45), height: int(7, 14), bg: color(), padding: { top: 1, left: 1, right: 1, bottom: 1 }, ch: ' ' }}>{i} - - {words(4).join(', ')}</box>)}
        sf{words(3).join(' ')}sdf
        <box {...{ width: int(20, 45), height: int(7, 14), bg: color(), ch: char() }}> 1first1 top el</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}>2 {words(2).join(' ')}</box>
        <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}> 3 {words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 6{words(1).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 7{words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 8{words(2).join(' ')}</box>
        <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}> 9 {words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(1).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 1{words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(2).join(' ')}</box>
        <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}>  {words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(1).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 1{words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(2).join(' ')}</box>
        <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}>  {words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(1).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 1{words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(2).join(' ')}</box>
        <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}>  {words(2).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(1).join(' ')}</box>
        <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}> 7 {words(3).join(' ')}</box>
        <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 8 {words(5).join(' ')}</box>{}
      </Scrollable>

      const el = flor.create(a)
      // el.layout()
      // flor.debug('hello')
      // flor.program.lock
      flor.render()
      // expect(flor.renderer.printBuffer(true)).toContain(`1{words(2).join(' ')}`)
      done()
    } catch (error) {
      debug('ERROR', error)
    }

  })

})

it('should hide overflow and scroll vertical with up and down arrows by default', async done => {
  try {
    const flor = new FlorDocument({
      buffer: true
      // useAnsiDiff: true
    })

    const a = <Scrollable {...{ top: 3, left: 3, width: 55, height: 23, border: { type: BorderStyle.double } }}
      preventChildrenCascade={true}
      layout={{ layout: Layout.topDown, manualLayout: true, neverResizeContainer: true }} verticalStep={2}
      fastVerticalScrollStep={40} verticalAnimationDuration={1000}
    // onScroll={e => {      debug('scroll ' + e)    }    }
    >
    <box {...{ width: int(20, 45), height: int(7, 14), bg: color(), ch: char() }}>_the first1_</box>

      {array(80).map(i => <box {...{
        width: int(15, 35),
        height: int(7, 14),
        bg: color(),
        //  padding: {
        //   top: 1, left: 1, right: 1, bottom: 1
        // },
        ch: ' '
      }
      }>{i
        } - - {words(4).join(', ')
        }</box>)}

      sf{words(3).join(' ')}sdf
    <box {...{ width: int(20, 45), height: int(7, 14), bg: color(), ch: char() }}> 1first1 top el</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}>2 {words(2).join(' ')}</box>
      <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}> 3 {words(2).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 6{words(1).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 7{words(2).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 8{words(2).join(' ')}</box>
      <box {...{ width: 8, height: int(7, 14), bg: color(), ch: char() }}> 9 {words(2).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 4 {words(5).join(' ')}</box>{}
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 5 {words(3).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(1).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> 1{words(2).join(' ')}</box>
      <box {...{ width: int(10, 25), height: int(7, 14), bg: color(), ch: char() }}> {words(2).join(' ')}</box>
    </Scrollable>

    const el = flor.create(a)
    flor.render()
    // expect(flor.renderer.printBuffer(true)).toContain(`_the first1_`)
    done()
  } catch (error) {
    debug('ERROR', error)
  }

})
