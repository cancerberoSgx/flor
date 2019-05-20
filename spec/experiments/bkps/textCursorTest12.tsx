import { ok } from 'assert'
import { array, trimRightLines } from 'misc-utils-of-mine-generic'
import * as yoga from 'yoga-layout'
import { Flor, FlorDocument, KeyEvent } from '../../../src'
import { Text, TextProps } from '../../../src/component/text'
import { BorderStyle } from '../../../src/util/border'

interface Pos { x: number, y: number }
interface TextCursorProps extends TextProps {
  pos?: Pos
}
class TextCursor extends Text<TextCursorProps> {
  originalAfterRender: (() => void) | undefined
  pos: { x: number; y: number; }
  originalBeforeRender: (() => boolean) | undefined
  nodeAtPos: number | undefined
  originalOnKeyPressed: undefined | ((e: KeyEvent) => boolean | void)

  onKey(k: KeyEvent) {
    if (!this.yNode || !this.cursor) {
      return
    }
    if (!this.nodeAtPos) {
      this.nodeAtPos = findNodeAtPos(this.yNode, this.pos)
    }
    if (!this.nodeAtPos) {
      throw new Error('Cannot find yoga node at pos ' + this.pos.x + ', ' + this.pos.y)
    }

    if (k.name === 'up') {

    } else if (k.name === 'down') {

    } else if (['left', 'right'].includes(k.name) || this.validInputChar(k)) {

    } else if (this.validInputChar(k)) {

    }
    this.cursor.show({ name: 'florTextCursor', top: this.pos.y, left: this.pos.x })

    this.originalOnKeyPressed && this.originalOnKeyPressed(k)
  }
  protected validInputChar(e: KeyEvent) {
    if (e.ch) {
      return e.ch
    }
    // TODO else {
  }
  // protected afterRender(){
  //   this.originalAfterRender && this.originalAfterRender()

  // }

  protected beforeRender() {
    this.cursor && this.cursor.hide({ name: 'florTextCursor' })
    return !!this.originalBeforeRender && this.originalBeforeRender()
  }

  constructor(p: TextCursorProps, s: {}) {
    super(p, s)
    this.pos = this.props.pos || { x: 0, y: 0 }
    // this.afterRender = this.afterRender.bind(this)
    // this.originalAfterRender = this.props.afterRender
    this.originalBeforeRender = this.props.beforeRender
    this.originalOnKeyPressed = this.props.onKeyPressed
    // this.props.afterRender=this.afterRender.bind(this)
    this.props.beforeRender = this.beforeRender.bind(this)
    this.props.onKeyPressed = this.onKey.bind(this)

  }

  protected createYNode(word: string, index: number) {
    const node = super.createYNode(word, index)
    this.setNodeWord(node, { word, index })
    // debugger
    return node
    // node.setr
  }

  private setNodeWord(node: any, p: { word: string, index: number }) {
    node.florTextCursor = p
  }
  // render(){
  //   // const e: JSX.Element<{children?: any}&RemoveProperties<TextProps, 'children'>> = super.render()
  //   return a
  // }
}

function findNodeAtPos(parent: yoga.YogaNode, pos: Pos) {
  return array(parent.getChildCount()).find(i => {
    const c = parent.getChild(i)
    const l = c.getComputedLayout()
    return l.left <= pos.x && l.right >= pos.x && l.top <= pos.y && l.bottom >= pos.y
  })
}

let flor: FlorDocument
flor = new FlorDocument()
const el = flor.create(<TextCursor width={38} top={3} left={4} height={16}
  padding={{ top: 1, right: 2, left: 3, bottom: 1 }} border={{ type: BorderStyle.double }}>
  Eiusmod nostrud deserunt ex qui in non magna velit nulla sint adipisicing sit veniam consectetur. Non minim sit cupidatat nulla nostrud cillum proident labore. Sint amet eu pariatur magna laboris occaecat in anim consectetur labore ipsum esse Lorem nostrud. Labore eu aliqua dolore tempor ea in sint culpa ipsum.
    </TextCursor>)
flor.render()
ok(flor.renderer.printBuffer(true).includes(trimRightLines(`


    ╔════════════════════════════════════╗
    ║                                    ║
    ║   Eiusmod nostrud deserunt ex      ║
    ║   qui in non magna velit nulla     ║
    ║   sint adipisicing sit veniam      ║
    ║   consectetur. Non minim sit       ║
    ║   cupidatat nulla nostrud cillum   ║
    ║   proident labore. Sint amet eu    ║
    ║   pariatur magna laboris           ║
    ║   occaecat in anim consectetur     ║
    ║   labore ipsum esse Lorem          ║
    ║   nostrud. Labore eu aliqua        ║
    ║   dolore tempor ea in sint culpa   ║
    ║   ipsum.                           ║
    ║                                    ║
    ╚════════════════════════════════════╝
`)))
