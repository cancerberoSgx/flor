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
  leftWord: KeyPredicate
  rightWord: KeyPredicate
  controlUp: KeyPredicate
  controlDown: KeyPredicate
  controlBackspace: KeyPredicate
  controlDelete: KeyPredicate
  shiftLeft: KeyPredicate
  shiftRight: KeyPredicate
  pagedown: KeyPredicate
  pageup: KeyPredicate
  home: KeyPredicate
  end: KeyPredicate
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

  /**
   * For pageup / pagedown actions, since this component is purely logic and independent from UI implementation it needs to be provided the page size.
   */
  pageSize?: number
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
  home: e => noModifiers(e, 'home'),
  end: e => noModifiers(e, 'end'),
  backspace: e => noModifiers(e, 'backspace'),
  delete: e => noModifiers(e, 'delete'),
  // heads up: when 'enter' key is pressed two events are emitted, 'enter' and 'return' we want to handle only one.
  enter: e => e.name === 'enter',//  || e.name === 'return',
  leftWord: e => e.name === 'left' && e.ctrl && !e.shift && !e.meta,
  rightWord: e => e.name === 'right' && e.ctrl && !e.shift && !e.meta,
  controlUp: e => e.name === 'up' && e.ctrl && !e.shift && !e.meta,
  controlDown: e => e.name === 'down' && e.ctrl && !e.shift && !e.meta,
  controlBackspace: e => e.name === 'backspace' && e.ctrl && !e.shift && !e.meta,
  controlDelete: e => e.name === 'delete' && e.ctrl && !e.shift && !e.meta,
  shiftLeft: e => e.name === 'right' && !e.ctrl && e.shift && !e.meta,
  shiftRight: e => e.name === 'right' && !e.ctrl && e.shift && !e.meta,
  pageup: e => noModifiers(e, 'pageup'),
  pagedown: e => noModifiers(e, 'home')
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

  protected previousEvent: KeyEvent | undefined
  /**
   * Notification of a key press event. We update out internal state [[pos]] and [[text]] user is responsible of the rest (update the UI, render(), absolute position, etc)
   */
  onKey(e: KeyEvent) {
    if (!this.enabled) {
      this.invalidAction({
        key: e.name, reason: 'TextInputCursor disabled'
      })
    } else if (this.previousEvent && ['enter', 'return'].includes(this.previousEvent.name) && ['enter', 'return'].includes(e.name)) {
      // wne 'enter' hwy is pressed two events are emitted 'enter', 'return and we want to to handle only one of them.
    } else if (this.keys.right(e)) {
      this.right()
    } else if (this.keys.rightWord(e)) {
      this.rightWord()
    } else if (this.keys.left(e)) {
      this.left()
    } else if (this.keys.leftWord(e)) {
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
    } else if (this.keys.end(e)) {
      this.end()
    } else if (this.keys.home(e)) {
      this.home()
    } else if (this.keys.pageup(e)) {
      this.pageup()
    } else if (this.keys.pagedown(e)) {
      this.pagedown()
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

  pagedown(): any {
    if (this.x >= this.lineText.length) {
      this.invalidAction({
        key: 'pagedown', reason: 'cannot go further down when at the end of file'
      })
    } else {
      this.x = this.lineText.length
    }
  }

  pageup(): any {
    if (this.x > 0) {
      this.x = 0
    } else {
      this.invalidAction({
        key: 'pageup', reason: 'cannot go further up when at the beginning of file'
      })
    }
  }

  home(): any {
    if (this.x > 0) {
      this.x = 0
    } else {
      this.invalidAction({
        key: 'pageup', reason: 'cannot go further up when at the beginning of file'
      })
    }
  }

  end(): any {
    if (this.x >= this.lineText.length) {
      this.invalidAction({
        key: 'pagedown', reason: 'cannot go further down when at the end of file'
      })
    } else {
      this.x = this.lineText.length
    }
  }

  right() {
    if (this.x < this.lineText.length) {
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
    if (this.x >= this.lineText.length) {
      this.invalidAction({
        key: 'down', reason: 'cannot go further down when at the end of file'
      })
    } else {
      this.x = this.lineText.length
    }
  }

  enter() {
    this.invalidAction({
      key: 'enter', reason: 'enter not supposed by single line'
    })
  }

  backspace() {
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
    if (this.x < this.lineText.length) {
      this.lineText = this.lineText.substring(0, this.x) + this.lineText.substring(this.x + 1, this.lineText.length)
    } else {
      this.invalidAction({
        key: 'delete', reason: 'cannot remove next character when at the end of the file.'
      })
    }
  }

  rightWord() {
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
