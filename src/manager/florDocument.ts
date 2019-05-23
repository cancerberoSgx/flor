import { isObject } from 'misc-utils-of-mine-generic'
import { FullProps, isElement, ProgramDocument, ProgramElement } from '..'
import { Program } from '../declarations/program'
import { Flor, isJSXElementImpl } from '../jsx/createElement'
import { addLogger } from '../util'
import { CursorManager } from './cursorManager'
import { StyleEffectsManager } from './effects'
import { EventManager } from './eventManager'
import { FocusManager } from './focusManager'
import { installExitKeys } from './programUtil'
import { createProgramForBrowser, ProgramBrowserOptions } from "./browser";
import { ProgramDocumentRenderer, RendererCreateOptions } from './renderer'

export interface FlorDocumentOptions<E extends ProgramElement = ProgramElement, T extends ProgramDocument<E> = ProgramDocument<E>> extends RendererCreateOptions, ProgramBrowserOptions {

  /**
   * If true, it will install key listeners so `tab` and `S-tab` will focus next and previous focusable
   * elements present in the program respectively. By default is false.
   */
  installDefaultChangeFocusKeys?: boolean

  /**
   * If true, it will install key listeners so when 'q' or 'C-c' keys are pressed the program is destroyed.
   *
   * By default is true.
   */
  installDefaultExitKeys?: boolean

  /**
   * If provided, this program instance will be used instead of creating a new one.
   */
  program?: Program

  /**
   * If provided, the DOM [[Document]] instance will be created using this function. The default DOM
   * [[Document]] implementation is [[ProgramDocument]] (`src/programDom`). This allows to use a custom DOM
   * implementation using the same renderer, event, focus manager implementations which should be agnostic to
   * DOM implementation.
   *
   * As an example, currently, flor supports an experimental DOM implementation: [[YogaDocument]] (that
   * extends the first one but with different API, and extra props and different render implementation).
   *
   * To use that implementation, flor needs to be instantiated like this:
   *
   * `const flor = new FlorDocument({documentImplementation: ()=>new YogaDocument()})` . This will make flor
   * use [[YogaDocument]] instance which [[createElement]] method will create [[Element]] implementations
   * other than [[ProgramElement]].
   */
  documentImplementation?: () => T
  /**
   * Will create a program compatible with the browser so it can be bundled using browserify.
   *
   * It will use term.js for emulate a terminal in the browser.
   *
   * Tput (`program.tput`, `program.put`) won't be available.
   *
   * IMPORTANT: Make sure the document is ready and body or provided container element are present and ready
   * in the document. i.e :
   *
```
window.onload=()=>{
  const flor = new FlorDocument({browser: true})
}
```

*/
  browser?: boolean

  installLoggers?: boolean
  enableMouse?: boolean
}

/**
 * Main entry point for the library. When calling `new FlorDocument()`, a new [[Program]] instance is created along with a new [[ProgramDocumentRenderer]], [[ProgramDocument]], [[EventManager]] and [[FocusManager]].

Examples:
```
const flor = new FlorDocument({})
const mainBox = flor.create({bg: 'red', fg: 'black', left: 0, top: 0, width: .5, height: .5, onClick={e=>flor.debug('Hello world')}})
```

```

```
TODO: probably this should extend ProgramDocument and handle all registerListener call here directly.
*/

export class FlorDocument<E extends ProgramElement = ProgramElement> {
  private _renderer: ProgramDocumentRenderer = undefined as any
  private _program: Program = undefined as any
  private _document: ProgramDocument<E> = undefined as any
  private _events: EventManager = undefined as any
  private _focus: FocusManager = undefined as any
  private _cursor: CursorManager = undefined as any
  private _effects: StyleEffectsManager<E> = undefined as any

  protected static programDefaultOptions: FlorDocumentOptions = {
    buffer: true,
    installDefaultExitKeys: true,
    installDefaultChangeFocusKeys: false,
    enableMouse: true,
    browser: false,
    installLoggers: false
  }

  constructor(o?: FlorDocumentOptions) {
    const options = { ...FlorDocument.programDefaultOptions, ...o || {} }
    this._program = options.program || options.browser ? createProgramForBrowser(options) : new Program(options)
    if (options.enableMouse) {
      this._program.setMouse({
        allMotion: true
      }, true)
      this._program.enableMouse()
    }
    this.render = this.render.bind(this)
    this._events = new EventManager(this._program)
    if (options.installDefaultExitKeys) {
      installExitKeys(this._program)
    }
    this._document = options.documentImplementation ? options.documentImplementation() : new ProgramDocument() as any
    Flor.setDocument(this._document)
    this.body.props.assign({ height: this.program.rows, width: this.program.cols, top: 0, left: 0 })
    this._renderer = new ProgramDocumentRenderer({ program: this._program })
    this._focus = new FocusManager(this._events, this._document)
    if (options.installDefaultChangeFocusKeys) {
      this._focus.installDefaultChangeFocusKeys()
    }
    this._cursor = new CursorManager({ program: this._program, cursor: {} })
    this._cursor.enter()
    this._effects = new StyleEffectsManager<E>({
      focusManager: this.focus as any
    })
    this._document._setManagers(this)
    this.debug = this.debug.bind(this)
    options.installLoggers && this.installLoggers()
  }

  /**
   * Destroys the program.
   */
  destroy(): any {
    this.document.destroy()
    this.events.destroy()
    this.cursor.leave()
    this.renderer.destroy()
  }

  /**
   * Creates an Element from given Props or by rendering given JSXElement and appends it to [[body]].
   */
  create(el: ProgramElement | Partial<FullProps> | JSX.Element): E {
    let r: ProgramElement | undefined
    if (isElement(el)) {
      r = el
    } else if (isJSXElementImpl(el)) {
      r = this.Flor.render(el)
    } else if (isObject(el)) {
      r = this.document.create({ ...el as any })
    }
    if (r) {
      this.document.body.appendChild(r)
    } else {
      throw new Error('Could not create element for input ' + el)
    }
    return r as E
  }

  /**
   * Current [[ProgramDocument]] instance.
   */
  get document() {
    return this._document
  }

  /**
   * Gets the cursor manager instance
   */
  public get cursor(): CursorManager {
    return this._cursor
  }

  /**
   * Shortcut for [[Flor]] global as in Flor.render().
   */
  get Flor() {
    return Flor
  }

  /**
   * Current [[Program]] instance.
   */
  get program() {
    return this._program
  }

  /**
   * Current [[EventManager]] instance.
   */
  get events() {
    return this._events
  }

  /**
   * Document's body, this is the root Element.
   */
  get body() {
    return this.document.body as E
  }

  /**
   * Current [[FocusManager]] instance.
   */
  get focus() {
    return this._focus
  }

  public get effects() {
    return this._effects
  }

  /**
   * Current [[ProgramDocumentRenderer]] instance.
   */
  get renderer(): ProgramDocumentRenderer {
    return this._renderer
  }

  /**
   * Draw given element in the terminal. If none provided, it will draw [[body]]
   */
  render(el: ProgramElement = this.body) {
    this.renderer.eraseElement(el)
    this.renderer.renderElement(el)
  }

  /**
   * Prints a box, by default at the right-bottom corner of the screen, with given text or element inside.
   */
  debug(...args: any[]) {
    if (this._debugTimer) {
      clearTimeout(this._debugTimer)
    }
    setTimeout(() => {
      this.program.saveCursor('flor.debug')
      args.map(a => JSON.stringify(a))
        // inspect(a, { sorted: true, compact: true, maxArrayLength: 4, breakLength: 44 })
        // .split('\n'))
        // .flat()
        .forEach((c, i) => {
          // this.program.saveCursor(  'flor.debug')
          const writeArea = { ...this.renderer.writeArea }
          this.renderer.resetWriteArea()
          this.renderer.write(i, 0, `<DEBUG>${c}</DEBUG>`)
          this.renderer.writeArea = writeArea
          // this.program.restoreCursor(  'flor.debug')

        })
      this.program.restoreCursor('flor.debug')
      this._debugTimer = setTimeout(() => {
        this.program.saveCursor('flor.debug')
        this.render()
        this.program.restoreCursor('flor.debug')
      }, 30000)
    }, 500)
  }
  private _debugTimer: NodeJS.Timeout | undefined

  private installLoggers() {
    addLogger({
      log: (...args: any[]) => {
        this.debug('', undefined, ...args)
      }
    })
  }

  printBuffer(linesTrimRight = true) {
    return this.renderer.printBuffer(linesTrimRight)
  }

}
