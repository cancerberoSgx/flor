import { KeyEvent } from '../..';
import { Pos } from '../../manager/cursorManager';
import { SingleLineTextInputCursor, Options } from './singleLine';
let multiLine;
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
 *
 */
export class TextInputCursorMulti extends SingleLineTextInputCursor {
  constructor(options: Options) {
    super(options);
    this.y = options.pos && options.pos.row || 0;
  }

  // set value(v: string) {
  //   this._lines = v.split('\n');
  //   const row = Math.max(this._lines.length - 1);
  //   const col = Math.max(this.x);
  // }

  // get value() {
  //   return this.lines.join('\n');
  // }
  onKey(e: KeyEvent) {
    if (!this.enabled) {
      this.invalidAction({
        key: e.name, reason: 'TextInputCursor disabled'
      });
    }
    else if (this.keys.up(e)) {
      this.up();
    }
    else if (this.keys.down(e)) {
      this.down();
    }
    else {
      super.onKey(e);
    }
  }
  down() {
    if (this.pos.row === this.lines.length) {
      super.down();
    }
    else {
      debugger
      this.pos = { row: this.pos.row + 1, col: Math.min(this.x, this.lines[this.pos.row ].length) };
      // this.x = this.pos.col;
      this.lineText = this.lines[this.y];
    }
  }
  up() {
    if (this.pos.row === 0) {
      super.up();
    }
    else {
      this.pos = { row: this.pos.row - 1, col: Math.min(this.x, this.lines[this.pos.row ].length) };
    }
  }
}
