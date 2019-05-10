import { Program } from '../declarations/program';
import { colors, ColorName, Color } from '../declarations/colors';
type CursorShape = 'block' | 'underline' | 'line';
interface Cursor {
  // /**
  //  * Have blessed draw a custom cursor and hide the terminal cursor (experimental).
  //  */
  // artificial: boolean
  /**
   * Shape of the cursor. Can be: block, underline, or line.
   */
  shape?: CursorShape;
  /**
   * Whether the cursor blinks.
   */
  blink?: boolean;
  /**
   * Color of the color. Accepts any valid color value (null is default).
   */
  color?: Color;
  _set?: boolean;
  _state?: number;
  _hidden?: boolean;
}
interface Options {
  cursor?: Cursor;
  program: Program;
}

/**
 * Manages the cursor. Adapted from blessed screen. 
 */
export class CursorManager {
  cursor: Cursor;
  program: Program;
  constructor(options: Options) {
    options.cursor = options.cursor || {} as any;
    // const c: Cursor = options.cursor || {shape: 'block'}
    this.cursor = {
      // artificial: options.cursor.artificial || false,
      shape: options.cursor!.shape || 'block',
      blink: options.cursor!.blink || false,
      color: options.cursor!.color || undefined,
      _set: false,
      _state: 1,
      _hidden: true
    };
    this.program = options.program;
  }


  cursorShape(shape?: CursorShape, blink?: boolean) {
    this.cursor.shape = shape || 'block';
    this.cursor.blink = blink || false;
    this.cursor._set = true;
    // if (this.cursor.artificial) {
    //   if (!this.program.hideCursor_old) {
    //     var hideCursor = this.program.hideCursor;
    //     this.program.hideCursor_old = this.program.hideCursor;
    //     this.program.hideCursor = function() {
    //       hideCursor.call(self.program);
    //       self.cursor._hidden = true;
    //       if (self.renders) self.render();
    //     };
    //   }
    // if (!this.program.showCursor_old) {
    //   var showCursor = this.program.showCursor;
    //   this.program.showCursor_old = this.program.showCursor;
    //   this.program.showCursor = function() {
    //     self.cursor._hidden = false;
    //     if (self.program._exiting) showCursor.call(self.program);
    //     if (self.renders) self.render();
    //   };
    // }
    // if (!this._cursorBlink) {
    //   this._cursorBlink = setInterval(function() {
    //     if (!self.cursor.blink) return;
    //     self.cursor._state ^= 1;
    //     if (self.renders) self.render();
    //   }, 500);
    //   if (this._cursorBlink.unref) {
    //     this._cursorBlink.unref();
    //   }
    // }
    // return true;
    // }
    // return this.program.cursorShape(this.cursor.shape, this.cursor.blink);
  }
  enter(): any {
    // Screen.prototype.enter = function() {
    if (this.program.isAlt)
      return;
    if (!this.cursor._set) {
      if (this.cursor.shape) {
        this.cursorShape(this.cursor.shape, this.cursor.blink);
      }
      if (this.cursor.color) {
        this.cursorColor(this.cursor.color);
      }
    }
    if (process.platform === 'win32') {
      try {
        require('child_process').execSync('cls', { stdio: 'ignore', timeout: 1000 });
      }
      catch (e) {
        ;
      }
    }
    this.program.alternateBuffer();
    this.program.put.keypad_xmit();
    this.program.csr(0, this.program.rows - 1);
    this.program.hideCursor();
    this.program.cup(0, 0);
    // We need this for tmux now:
    if (this.program.tput.strings.ena_acs) {
      this.program._write(this.program.tput.enacs());
    }
    // this.alloc();
    // };
  }
  cursorColor(color: Color): any {
    this.cursor.color = color != null
    ? colors.convert(color)
    : undefined;
  this.cursor._set = true;

  // if (this.cursor.artificial) {
  //   return true;
  // }

  return this.program.cursorColor((colors.ncolors as any)[this.cursor.color! as any]as any);
  }


  leave() {
    if (!this.program.isAlt)
      return;
    this.program.put.keypad_local();
    if (this.program.scrollTop !== 0
      || this.program.scrollBottom !== this.program.rows - 1) {
      this.program.csr(0, this.program.rows - 1);
    }
    // XXX For some reason if alloc/clear() is before this
    // line, it doesn't work on linux console.
    this.program.showCursor();
    // this.alloc();
    // if (this._listenedMouse) {
    this.program.disableMouse();
    // }
    this.program.normalBuffer();
    // if (this.cursor._set) 
    this.resetCursor();
    this.program.flush();
    if (process.platform === 'win32') {
      try {
        require('child_process').execSync('cls', { stdio: 'ignore', timeout: 1000 });
      }
      catch (e) {
        ;
      }
    }
  }
  ;
  resetCursor() {
    this.cursor.shape = 'block';
    this.cursor.blink = false;
    this.cursor.color = undefined;
    this.cursor._set = false;
    // if (this.cursor.artificial) {
    //   this.cursor.artificial = false;
    //   if (this.program.hideCursor_old) {
    //     this.program.hideCursor = this.program.hideCursor_old;
    //     delete this.program.hideCursor_old;
    //   }
    //   if (this.program.showCursor_old) {
    //     this.program.showCursor = this.program.showCursor_old;
    //     delete this.program.showCursor_old;
    //   }
    //   if (this._cursorBlink) {
    //     clearInterval(this._cursorBlink);
    //     delete this._cursorBlink;
    //   }
    //   return true;
    // }
    return this.program.cursorReset();
  }
}
