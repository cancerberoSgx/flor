import { KeyEvent } from '../..'
import { Options, SingleLineTextInputCursor } from './singleLine'

/**
 * Synchronizes text being edited with cursor movement. Based on [[SingleLineTextInputCursor]]
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
 */
export class TextInputCursorMulti extends SingleLineTextInputCursor {
  constructor(options: Options) {
    super(options)
    this.y = options.pos && options.pos.row || 0
  }

  // onKey(e: KeyEvent) {
  //   if (!this.enabled) {
  //     this.invalidAction({
  //       key: e.name, reason: 'TextInputCursor disabled'
  //     })
  //   } else if (this.keys.up(e)) {
  //     this.up()
  //   } else if (this.keys.down(e)) {
  //     this.down()
  //   } else if (this.keys.enter(e)) {
  //     this.enter(e)
  //   } else {
  //     super.onKey(e)
  //   }
  // }

  down() {
    if (this.pos.row === this.lines.length-1) {
      super.down()
    } else {
      debugger
      this.pos = {
        row: this.pos.row + 1, col: Math.min(this.x, this.lines[this.pos.row ].length) }
    }
  }

  up() {
    if (this.pos.row === 0) {
      super.up()
    } else {
      this.pos = { row: this.pos.row - 1, col: Math.min(this.x, this.lines[this.pos.row - 1].length) }
    }
  }

  enter() {
    const line1 = this.lineText.substring(0, this.x)
    const line2 = this.lineText.substring(this.x, this.lineText.length)
    this._lines .splice(this.y, 1, line1, line2)
    this.pos = {       row: this.y + 1 , col: 0 }
  }

}
