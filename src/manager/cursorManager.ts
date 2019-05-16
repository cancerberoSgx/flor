import { Color, colors } from '../declarations/colors'
import { Program } from '../declarations/program'
import { enterProgram, leaveProgram } from './programUtil'

type CursorShape = 'block' | 'underline' | 'line'

interface Cursor {
  /**
   * Shape of the cursor. Can be: block, underline, or line.
   */
  shape?: CursorShape
  /**
   * Whether the cursor blinks.
   */
  blink?: boolean
  /**
   * Color of the color. Accepts any valid color value (null is default).
   */
  color?: Color
  _set?: boolean
  _state?: number
  _hidden?: boolean
}

interface Options {
  cursor?: Cursor
  program: Program
}

/**
 * Manages the cursor. Adapted from blessed screen.
 */
export class CursorManager {

  cursor: Cursor
  program: Program

  constructor(options: Options) {
    options.cursor = options.cursor || {} as any
    this.cursor = {
      shape: options.cursor!.shape || 'block',
      blink: options.cursor!.blink || false,
      color: options.cursor!.color || undefined,
      _set: false,
      _state: 1,
      _hidden: true
    }
    this.program = options.program
  }

  cursorShape(shape?: CursorShape, blink?: boolean) {
    this.cursor.shape = shape || 'block'
    this.cursor.blink = blink || false
    this.cursor._set = true    
    this.program.cursorShape(this.cursor.shape, this.cursor.blink)
  }

  cursorColor(color: Color) {
    this.cursor.color = color != null
      ? colors.convert(color)
      : undefined
    this.cursor._set = true
    return this.program.cursorColor((colors.ncolors as any)[this.cursor.color! as any])
  }

  /**
   * frees / unlock keyboard and mouse resources. Don't destroy de program or event listeners but the terminal is
   * reset. To use it again, use [[enterProgram]].
   */
  leave() {
    leaveProgram(this.program)
  }

  /** 
   * restore terminal control after [[leave]] was called 
   */
  enter() {
    if (!this.cursor._set) {
      if (this.cursor.shape) {
        this.cursorShape(this.cursor.shape, this.cursor.blink)
      }
      if (this.cursor.color) {
        this.cursorColor(this.cursor.color)
      }
    }
    enterProgram(this.program)
  }

  resetCursor() {
    this.cursor.shape = 'block'
    this.cursor.blink = false
    this.cursor.color = undefined
    this.cursor._set = false
    return this.program.resetCursor()
  }

  /**
   * API for component implementations to hide the cursor, restoring it to its previews state before [[show]] was called.
   */
  hide(options: {name: string}) {
    this.program.hideCursor()
    this.program.restoreCursor(options.name)
  }

  /**
   * API for component implementations to show the cursor on given coordinates, saving its current state under given name.
   */
  show(options: {name: string, top: number, left: number}) {
    this.program.saveCursor(options.name)
    this.setPosition({ row: options.top, col: options.left })
  }

  /**
   * Sets cursor position.
   */
  setPosition(options: Pos) {
    this.program.cursorPos(options.row, options.col)
    this.program.showCursor()
  }

  // /**
  //  * Moves cursor to the left n times.
  //  */
  // left(n: number) {
  //   this.program.left(n)
  // }

  // right(n: number) {
  //   this.program.right(n)
  // }
}

export interface Pos {
  row: number
  col: number
}

// /**
//  * Can move the cursor
//  */
// export interface CursorHandler {
//   setPosition(pos: Pos): void
//   // left(n: number): void
//   // right(n: number): void
// }
