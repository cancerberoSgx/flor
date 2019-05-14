import { KeyEvent, KeyListener, KeyPredicate } from './'
import { CursorHandler } from './cursorManager'
import { getPreviousMatchingPos } from 'misc-utils-of-mine-generic'

interface TextInputCursorKeys {
  left: KeyPredicate
  right: KeyPredicate
  up: KeyPredicate
  down: KeyPredicate
  backspace: KeyPredicate
  delete: KeyPredicate
  enter: KeyPredicate
  controlLeft: KeyPredicate
  controlRight: KeyPredicate
  controlUp: KeyPredicate
  controlDown: KeyPredicate
  controlBackspace: KeyPredicate
  controlDelete: KeyPredicate
}

interface Options {
  /**
   * if true it won't allow to create new lines.
   */
  singleLine?: boolean
  /**
   * Absolute coordinates in the screen where the text begins rendering.
   */
  origin: Pos
  /**
   * Initial text.
   */
  text?: string
  /**
   * Initial cursor position.
   */
  pos?: Pos

  keys?: Partial<TextInputCursorKeys>

  /**
   * Is user responsibility to provide a key emitter that we can subscribe .
   */
  addKeyListener(l: KeyListener): void

  cursor: CursorHandler

  // writer: TerminalWriter

  /**
   * Notifies for invalid user actions, like pressing 'backspace at the begging of the file, otr 'right' /
   * 'down' at the end of the file. Listeners can right a bell for example.
   */
  onInvalidAction?(a: Action): void
}
// export interface TerminalWriter {

// }
/**
 * represent a invalid user action, like pressing 'backspace at the begging of the file, otr 'right' / 'down'
 * at the end of the file. Listeners can right a bell for example.
 */
interface Action {
  key: string
  reason?: string
}
function noModifiers(e: KeyEvent, name?: string) {
  return !e.ctrl && !e.meta && !e.ctrl && !e.shift && (name ? e.name === name : true)
}

const defaultTextInputCursorKeys: TextInputCursorKeys = {
  left: e => noModifiers(e, 'left'),
  right: e => noModifiers(e, 'right'),
  up: e => noModifiers(e, 'up'),
  down: e => noModifiers(e, 'down'),
  backspace: e => noModifiers(e, 'backspace'),
  delete: e => noModifiers(e, 'delete'),
  enter: e => noModifiers(e, 'enter'),
  controlLeft: e => e.name==='left' && e.ctrl &&!e.shift&&!e.meta,
  controlRight: e =>e.name==='right' && e.ctrl &&!e.shift&&!e.meta,
  controlUp: e => e.name==='up' && e.ctrl &&!e.shift&&!e.meta,
  controlDown: e =>e.name==='down' && e.ctrl &&!e.shift&&!e.meta,
  controlBackspace: e => e.name==='backspace' && e.ctrl &&!e.shift&&!e.meta,
  controlDelete: e =>e.name==='delete' && e.ctrl &&!e.shift&&!e.meta,
}

interface Pos {
  row: number
  col: number
}

/**
 * Single line support for [[CursorTextInputCursor]].
 */
export class SingleLineTextInputCursor {
  protected text: string
  protected x: number
  get pos() {
    return { col: this.x, row: 0 }
  }
  get value() {
    return this.text + ''
  }
  protected keys: TextInputCursorKeys
  constructor(protected options: Options) {
    this.text = options.text || ''
    this.x = options.pos ? options.pos.row : 0
    this.keys = { ...defaultTextInputCursorKeys, ...options.keys || {} }
    this.onKey = this.onKey.bind(this)
    options.addKeyListener(this.onKey)
  }
  protected onKey(e: KeyEvent) {
    if (this.keys.right(e)) {
      this.right()
    }else if (this.keys.controlRight(e)) {
      this.controlRight()
    } 
    else if (this.keys.left(e)) {
      this.left()
    } else if (this.keys.controlLeft(e)) {
      this.controlLeft()
    } 
    else if (this.keys.up(e)) {
      this.up()
    } else if (this.keys.down(e)) {
      this.down()
    } else if (this.keys.enter(e)) {
      this.enter()
    } else if (this.keys.backspace(e)) {
      this.backspace()
    } else if (this.keys.delete(e)) {
      this.delete()
    } else {
      this.invalidAction({
        key: e.name, reason: 'key not implemented'
      })
    }
  }
  right() {
    if (this.x < this.text.length) {
      this.x++
    } else {
      this.invalidAction({
        key: 'right', reason: 'cannot go further right when at the end of file'
      })
    }
  }
  left() {
    if (this.x > 0) {
      this.x--
    } else {
      this.invalidAction({
        key: 'left', reason: 'cannot go further left when at the beginning of file'
      })
    }
  }
  up() {
    if (this.x > 0) {
      this.x = 0
    } else {
      this.invalidAction({
        key: 'up', reason: 'cannot go further up when at the beginning of file'
      })
    }
  }
  down() {
    if (this.x >= this.text.length) {
      this.invalidAction({
        key: 'down', reason: 'cannot go further down when at the end of file'
      })
    } else {
      this.x = this.text.length
    }
  }
  enter() {
    this.invalidAction({
      key: 'enter', reason: 'enter not supposed by single line'
    })
  }
  backspace() {
    if (this.x > 0) {
      this.text = this.text.substring(0, this.x - 1) + this.text.substring(this.x, this.text.length)
      this.x--
    } else {
      this.invalidAction({
        key: 'backspace', reason: 'cannot remove previous character when at the begging of the file.'
      })
    }
  }
  delete() {
    if (this.x < this.text.length) {
      this.text = this.text.substring(0, this.x) + this.text.substring(this.x + 1, this.text.length)
    } else {
      this.invalidAction({
        key: 'delete', reason: 'cannot remove next character when at the end of the file.'
      })
    }
  }

  controlRight() {
    if (this.x < this.text.length) {
      this.x = this.text.split('').findIndex((s,i,a)=> i>this.x&&!s.trim())
      this.x = this.x===-1 ? this.text.length : this.x
    } else {
      this.invalidAction({
        key: 'controlRight', reason: 'cannot go further right when at the end of file'
      })
    }
  }
  controlLeft() {
    if (this.x > 0) {
      this.x = this.text.split('').reverse().findIndex((s,i,a)=> i>a.length-this.x&&!s.trim())
      this.x = this.x===-1 ? 0: this.x
    } else {
      this.invalidAction({
        key: 'controlRight', reason: 'cannot go further right when at the end of file'
      })
    }
  }
  protected invalidAction(a: Action) {
    this.options.onInvalidAction && this.options.onInvalidAction(a)
  }
}

/**
 * Synchronizes text being edited with cursor movement.
 *
 * It only moves the cursor but doesn't remove characters from the screen. Instead updates the internal text
 * and the cursor position.
 *
 * For example:
 *
 *  * will allow to move cursor down only if is not currently in the last line
 *  * input a new line will break current line in two and position the cursor on the beggining of the next
 *    line
 *  * input backspace: 1) if cursor is not at col===0 willi remove previous char 2) else will move current
 *    line up and append it to the previous one. The cursor will be in the middle of two.
 *
 */
class CursorTextInputCursor extends SingleLineTextInputCursor {
  constructor(options: Options) {
    super(options)
  }
}
