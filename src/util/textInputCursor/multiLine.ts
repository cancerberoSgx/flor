import { SingleLineTextInputCursor, TextInputCursorOptions } from './singleLine'

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
 *  * input backspace: 1) if cursor is not at col===0 will remove previous char 2) else will move current
 *    line up and append it to the previous one. The cursor will be in the middle of two.
 */
export class TextInputCursorMulti extends SingleLineTextInputCursor {

  defaultPageSize: number = 20
  constructor(options: TextInputCursorOptions) {
    super(options)
    this.y = options.pos && options.pos.row || 0
  }

  down() {
    if (this.pos.row === this.lines.length - 1) {
      super.down()
    } else {
      debugger
      this.pos = {
        row: this.pos.row + 1, col: Math.min(this.x, this.lines[this.pos.row].length)
      }
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
    this._lines.splice(this.y, 1, line1, line2)
    this.pos = { row: this.y + 1, col: 0 }
  }

  backspace() {
    if (this.x <= 0 && this.y > 0) {
      const prevLineLength = this._lines[this.y - 1].length
      const line = this._lines[this.y - 1] + this._lines[this.y]
      this._lines.splice(this.y - 1, 2, line)
      this.pos = {
        row: this.y - 1,
        col: prevLineLength
      }
    } else {
      super.backspace()
    }
  }

  delete() {
    if (this.x >= this._lines[this.y].length - 1 && this.y < this._lines.length - 1) {
      const thisLineLength = this._lines[this.y].length
      const line = this._lines[this.y] + this._lines[this.y + 1]
      this._lines.splice(this.y, 2, line)
      // this.pos = {
      //   row: this.y,
      //   col: thisLineLength
      // }
    } else {
      super.backspace()
    }
  }

  pagedown(): any {
    if (this.y >= this._lines.length - 1) {
      super.pagedown()
    } else {
      const row = Math.min(this._lines.length - 1, this.y + this.defaultPageSize)
      this.pos = {
        row,
        col: Math.min(this._lines[row].length - 1, this.x)
      }
    }
  }

  pageup(): any {
    if (this.y <= 0) {
      super.pageup()
    } else {
      const row = Math.max(0, this.y - this.defaultPageSize)
      this.pos = {
        row,
        col: Math.min(this._lines[row].length - 1, this.x)
      }
    }
  }

  home(): any {
    if (this.y <= 0) {
      super.pageup()
    } else {
      // const row = Math.min(0, this.y - this.defaultPageSize)
      this.pos = {
        row: 0,
        col: Math.min(this._lines[0].length - 1, this.x)
      }
    }

  }

  end(): any {
    if (this.y >= this._lines.length - 1) {
      super.pagedown()
    } else {
      this.pos = {
        row: this._lines.length - 1,
        col: Math.min(this._lines[0].length - 1, this.x)
      }
    }
  }

}
