import { KeyEvent, KeyListener, KeyPredicate, ProgramElement } from '../..'
import { Pos } from '../../manager/cursorManager'

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
  shiftRight: KeyPredicate
}

export interface Options {
  /**
   * if true it won't allow to create new lines.
   */
  singleLine?: boolean
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
   * Is user responsibility to provide a key emitter that we can subscribe . If not provided here, then method [[onKey]] must be called insteadl.
   */
  addKeyListener?(l: KeyListener): void

  /**
   * Initial enabled/disabled state. Default value: false.
   */
  enabled?: boolean

  /**
   * Notifies for invalid user actions, like pressing 'backspace at the begging of the file, otr 'right' /
   * 'down' at the end of the file. Listeners can right a bell for example.
   */
  onInvalidAction?(a: Action): void
}

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
  // heads up: when 'enter' key is pressed two events are emitted, 'enter' and 'return' we want to handle only one. 
  enter: e => e.name === 'enter',//  || e.name === 'return',  
  controlLeft: e => e.name === 'left' && e.ctrl && !e.shift && !e.meta,
  controlRight: e => e.name === 'right' && e.ctrl && !e.shift && !e.meta,
  controlUp: e => e.name === 'up' && e.ctrl && !e.shift && !e.meta,
  controlDown: e => e.name === 'down' && e.ctrl && !e.shift && !e.meta,
  controlBackspace: e => e.name === 'backspace' && e.ctrl && !e.shift && !e.meta,
  controlDelete: e => e.name === 'delete' && e.ctrl && !e.shift && !e.meta,
  shiftRight: e => e.name === 'right' && !e.ctrl && e.shift && !e.meta
}

/**
 * Single line support for [[CursorTextInputCursor]].
 */
export class SingleLineTextInputCursor {

  protected x: number
  protected y: number

  private _enabled: boolean = false
  protected keys: TextInputCursorKeys
  protected _lines: string[]

  constructor(protected options: Options) {
    this._lines = (options.text || '').split('\n')
    this.enabled = !!options.enabled
    this.x = options.pos ? options.pos.col : 0
    this.y = options.pos ? options.pos.row : 0
    this.keys = { ...defaultTextInputCursorKeys, ...options.keys || {} }
    this.onKey = this.onKey.bind(this)
    options.addKeyListener && options.addKeyListener(this.onKey)
  }

  charAtPos() {
    return this.lineText.charAt(this.x)
  }

  protected get lineText(): string {
    return this._lines[this.y]
  }
  protected set lineText(value: string) {
    this._lines[this.y] = value
  }

  protected get lines() {
    return this._lines
  }

  set value(v: string) {
    this._lines = v.split('\n')
  }
  get value() {
    return this._lines.join('\n')
  }

  public get enabled(): boolean {
    return this._enabled
  }
  public set enabled(value: boolean) {
    this._enabled = value
  }

  get pos() {
    return { col: this.x, row: this.y }
  }
  set pos(p: Pos) {
    this.x = p.col
    this.y = p.row
    this.lineText = this._lines[this.y]
  }

  protected previousEvent: KeyEvent|undefined
  /**
   * Notification of a key press event. We update out internal state [[pos]] and [[text]] user is responsible of the rest (update the UI, render(), absolute position, etc)
   */
  onKey(e: KeyEvent) {
    if (!this.enabled) {
      this.invalidAction({
        key: e.name, reason: 'TextInputCursor disabled'
      })
    } else if(this.previousEvent &&['enter', 'return'].includes(this.previousEvent.name)&& ['enter', 'return'].includes( e.name)){
      // wne 'enter' hwy is pressed two events are emitted 'enter', 'return and we want to to handle only one of them.
    }
      else if (this.keys.right(e)) {
      this.right()
    } else if (this.keys.controlRight(e)) {
      this.rightWord()
    } else if (this.keys.left(e)) {
      this.left()
    } else if (this.keys.controlLeft(e)) {
      this.leftWord()
    } else if (this.keys.up(e)) {
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
      const c = this.validInputChar(e)
      if (c) {
        this.lineText = this.lineText.substring(0, this.x) + c + this.lineText.substring(this.x, this.lineText.length)
        this.x++
      } else {
        this.invalidAction({
          key: e.name, reason: 'key not implemented'
        })
      }
    }
    this.previousEvent = e
  }

  protected validInputChar(e: KeyEvent<ProgramElement>) {
    if (e.ch) {
      return e.ch
    }
    // TODO else {
  }

  // protected insertString(c: string) {
  //   this.lineText = this.lineText.substring(0, this.x) + c + this.lineText.substring(this.x, this.lineText.length)
  //   this.x++
  // }
  right() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'right', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x < this.lineText.length) {
      this.x++
    } else {
      this.invalidAction({
        key: 'right', reason: 'cannot go further right when at the end of file'
      })
    }
  }

  left() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'left', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x > 0) {
      this.x--
    } else {
      this.invalidAction({
        key: 'left', reason: 'cannot go further left when at the beginning of file'
      })
    }
  }

  up() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'up', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x > 0) {
      this.x = 0
    } else {
      this.invalidAction({
        key: 'up', reason: 'cannot go further up when at the beginning of file'
      })
    }
  }

  down() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'down', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x >= this.lineText.length) {
      this.invalidAction({
        key: 'down', reason: 'cannot go further down when at the end of file'
      })
    } else {
      this.x = this.lineText.length
    }
  }

  enter() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'enter', reason: 'TextInputCursor disabled'
      })
    }
    this.invalidAction({
      key: 'enter', reason: 'enter not supposed by single line'
    })
  }

  backspace() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'backspace', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x > 0) {
      this.lineText = this.lineText.substring(0, this.x - 1) + this.lineText.substring(this.x, this.lineText.length)
      this.x--
    } else {
      this.invalidAction({
        key: 'backspace', reason: 'cannot remove previous character when at the begging of the file.'
      })
    }
  }

  delete() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'delete', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x < this.lineText.length) {
      this.lineText = this.lineText.substring(0, this.x) + this.lineText.substring(this.x + 1, this.lineText.length)
    } else {
      this.invalidAction({
        key: 'delete', reason: 'cannot remove next character when at the end of the file.'
      })
    }
  }

  rightWord() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'controlRight', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x < this.lineText.length) {
      this.x = this.lineText.split('').findIndex((s, i, a) => i > this.x && !s.trim())
      this.x = this.x === -1 ? this.lineText.length : this.x
    } else {
      this.invalidAction({
        key: 'controlRight', reason: 'cannot go further right when at the end of file'
      })
    }
  }

  leftWord() {
    if (!this.enabled) {
      return this.invalidAction({
        key: 'controlLeft', reason: 'TextInputCursor disabled'
      })
    }
    if (this.x > 0) {
      // const a = getPreviousMatchingPos(this.lineText, this.x, c=>!c.trim())
      this.x = this.lineText.split('').reverse().findIndex((s, i, a) => i > a.length - this.x && !s.trim())
      this.x = this.x === -1 ? 0 : this.x
      // console.log(a, this.x, this.lineText[a], this.lineText[this.x]);

    } else {
      this.invalidAction({
        key: 'controlLeft', reason: 'cannot go further left when at the beginning of file'
      })
    }
  }

  protected invalidAction(a: Action) {
    this.options.onInvalidAction && this.options.onInvalidAction(a)
  }
}
