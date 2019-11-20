import { array } from 'misc-utils-of-mine-generic';
import { char, color, int, words } from '../../spec/data';
import { BorderStyle, easing, FlorDocument, Layout } from '../../src';
import { Scrollable } from '../../src/component/scrollable';
import { Text } from '../../src/component/text';
import { Flor } from '../../src/jsx/createElement';

// describe('scrollable', () => {

// let flor: FlorDocument
// defaultTestSetup(f => flor = f || flor)

// it('should hide overflow and scroll vertical with up and down arrows by default', async done => {

const flor = new FlorDocument()
let el: any = <Scrollable {...{
  top: 1, left: 1, width: 24, height: 26, ch: char(),
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
//   await willContain(flor.renderer, 'visible3')
//   expect(flor.renderer.printBuffer(true)).toContain('visible4')
//   done()
// })

// it('should hCide overflow and scroll vertical/horizontal with down and right arrows', async done => {
let a = <Scrollable top={0} left={48} width={35} height={13}
  border={{ type: BorderStyle.double }} preventChildrenCascade={true}
  layout={{ layout: Layout.topDown }} normalVerticalStep={2} overflow="hidden" largeVerticalScrollStep={40}
  verticalAnimationDuration={1400} largeScrollAnimation={easing.easeOutBounce()}>
  <Text height={3} width={23}>firstChild123</Text>
  <Text height={17} width={58} border={{ type: BorderStyle.round }}
    padding={{ top: 1, right: 2, left: 3, bottom: 1 }}>
    Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum. Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Final words.</Text>
  <Text height={3} width={23}>lastChild123</Text>
</Scrollable>

flor.create(a)
flor.render()

a = (
  <Scrollable top={28} left={2} width={25} height={12} rightExtraOffset={3} bottomExtraOffset={3}
    border={{ type: BorderStyle.double }} bg="green">
    <Text bg="red" top={13} left={14} height={23} width={58}
      linesAlign="center" wordsAlign="justify" border={{ type: BorderStyle.round }}
      padding={{ top: 1, right: 2, left: 3, bottom: 1 }}>
      Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.</Text>
  </Scrollable>
)
el = flor.create(a)
//   el.getComponent<Scrollable>()!.scroll({ x: 0, y: 0 })
//   flor.render()
//   await willContain(flor.renderer, '════════')
//   expect(flor.renderer.printBuffer(true)).not.toContain('Eiusmod nostrud')
//   el.getComponent<Scrollable>()!.scroll({ x: 18, y: 20 })
//   flor.render()
//   await willContain(flor.renderer, 'Eiusmod nostrud')
//   done()
// })

// it('should scroll many children rows with', async done => {
a = <Scrollable top={20} left={76} width={55} height={23}
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
flor.create(<el>Hello</el>)
el = flor.create(a)
flor.render()
//     await waitForPredicate(() => flor.renderer.printBuffer(true).includes('firstChild123'))
//     expect(flor.renderer.printBuffer(true)).toContain('0, 0')
//     done()
//   })
// })
