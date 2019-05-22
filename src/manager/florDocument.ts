import { isObject } from 'misc-utils-of-mine-generic'
import { inspect } from 'util'
import { FullProps, isElement, ProgramDocument, ProgramElement } from '..'
import { Program } from '../declarations/program'
import { Flor, isJSXElementImpl } from '../jsx/createElement'
import { addLogger } from '../util'
import { Deferred } from '../util/misc'
import { CursorManager } from './cursorManager'
import { StyleEffectsManager } from './effects'
import { EventManager } from './eventManager'
import { FocusManager } from './focusManager'
import { createProgramForBrowser, installExitKeys, ProgramBrowserOptions } from './programUtil'
import { ProgramDocumentRenderer, RendererCreateOptions } from './renderer'

export interface FlorDocumentOptions<E extends ProgramElement = ProgramElement, T extends ProgramDocument<E> = ProgramDocument<E>> extends RendererCreateOptions, ProgramBrowserOptions {
  /**
   * By default is true.
   */
  installExitKeys?: boolean
  /**
   * If provided, this program instance will be used instead of creating a new one
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

  installLoggers?:  boolean
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

  protected static programDefaultOptions = { 
    buffer: true, 
    installExitKeys: true, 
    enableMouse: true, 
    browser: false, 
    installLoggers: false 
  }
  
  constructor(o?: FlorDocumentOptions ) {
    // this.ready = new Deferred<void>()
    const options = { ...FlorDocument.programDefaultOptions, ...o||{} }
    // if (!o.program && o.browser) {
      // this._program  = o.program || createProgramForBrowser(options)
      // .then(program => {
      //   this._program = program
        // this.initialize(options)
      // })
    // // } else {
      this._program = options.program || options.browser ? createProgramForBrowser(options) : new Program(options)
    // }
    if(options.enableMouse){
      this._program.setMouse({
        allMotion: true
      }, true)
      this._program.enableMouse()
    }
    this.render = this.render.bind(this)
    this._events = new EventManager(this._program)
    if(options.installExitKeys){
      installExitKeys(this._program)
    }
    this._document = options.documentImplementation ? options.documentImplementation() : new ProgramDocument() as any
    Flor.setDocument(this._document)
    this.body.props.assign({ height: this.program.rows, width: this.program.cols, top: 0, left: 0 })
    this._renderer = new ProgramDocumentRenderer({ program: this._program })
    this._focus = new FocusManager(this._events, this._document)
    // this.createTextNode = this.createTextNode.bind(this)
    this._cursor = new CursorManager({ program: this._program, cursor: {} })
    this._cursor.enter()
    this._effects = new StyleEffectsManager<E>({
      focusManager: this.focus as any
    })
    this._document._setManagers(this)
    this.debug = this.debug.bind(this)
    options.installLoggers && this.installLoggers()
    // this.initialize(o)
  }

  // protected initialize(options: FlorDocumentOptions<ProgramElement, ProgramDocument<ProgramElement>>) {

    // this.ready.resolve()
  // }

  // ready: Deferred<void>

  /**
   * Destroys the program.
   */
  destroy(): any {
    // this.document.destroy()
    this.events.destroy()
    this.cursor.leave()
    this.renderer.destroy()
  }

  // /**
  //  * Creates an empty Element with given tagName with no parent.
  //  */
  // createElement(tagName: string) {
  //   return this._document.createElement(tagName)
  // }

  // /**
  //  * Creates a new text node with given text with no parent.
  //  */
  // createTextNode(text: string) {
  //   return this._document.createTextNode(text)
  // }

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
    setTimeout(() => {
      this.program.saveCursor('flordebug')
      args.map(a => typeof a === 'string' ? [a] : inspect(a, { sorted: true, compact: true, maxArrayLength: 44, breakLength: 120 }).split('\n')).flat()
        .forEach((c, i) => {
          this.renderer.write(i, 0, c)
        })
      this.program.restoreCursor('flordebug')
      setTimeout(() => {
        this.program.saveCursor('flordebug')
        this.render()
        this.program.restoreCursor('flordebug')
      }, 3000)
    }, 1000)
  }

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
