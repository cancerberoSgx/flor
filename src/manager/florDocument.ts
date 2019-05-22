import { isObject } from 'misc-utils-of-mine-generic'
import { inspect } from 'util'
import { FullProps, isElement, ProgramDocument, ProgramElement } from '..'
import { Program, ProgramOptions } from '../declarations/program'
import { Flor, isJSXElementImpl } from '../jsx/createElement'
import { addLogger } from '../util'
import { CursorManager } from './cursorManager'
import { StyleEffectsManager } from './effects'
import { EventManager } from './eventManager'
import { FocusManager } from './focusManager'
import { installExitKeys, createProgramForBrowser, ProgramBrowserOptions } from './programUtil'
import { ProgramDocumentRenderer, RendererCreateOptions } from './renderer'
import { Deferred } from '../util/misc';

export interface FlorDocumentOptions<E extends ProgramElement = ProgramElement, T extends ProgramDocument<E> = ProgramDocument<E>> extends  RendererCreateOptions, ProgramBrowserOptions {
  program?: Program
  useAnsiDiff?: boolean
  documentImplementation?: () => T
  browser?: boolean
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

  constructor(o: FlorDocumentOptions = { buffer: true }) {
    this.ready =  new Deferred<void>()
    // if (!o.program) {
      const programDefaultOptions = { buffer: true }
      const programOptions = { ...programDefaultOptions, ...o }
      if(!o.program && o.browser){
        createProgramForBrowser(programOptions).then(program=>{
          this._program = program
          this.initialize(programOptions)
        })
      }
      else {
        this._program = o.program||new Program(programOptions)
        this.initialize(o);
      }      
    // }
  }

  protected initialize(o: FlorDocumentOptions<ProgramElement, ProgramDocument<ProgramElement>>) {
    this._program.setMouse({
      allMotion: true
    }, true);
    this._program.enableMouse();
    installExitKeys(this._program);
    this.render = this.render.bind(this);
    this._events = new EventManager(this._program);
    this._document = o.documentImplementation ? o.documentImplementation() : new ProgramDocument() as any;
    Flor.setDocument(this._document);
    this._renderer = new ProgramDocumentRenderer({ program: this._program });
    this._focus = new FocusManager(this._events, this._document);
    this.body.props.assign({ height: this.program.rows, width: this.program.cols, top: 0, left: 0 });
    this._document._setManagers(this);
    this.createTextNode = this.createTextNode.bind(this);
    this.debug = this.debug.bind(this);
    this._cursor = new CursorManager({ program: this._program, cursor: {} });
    this._cursor.enter();
    this._effects = new StyleEffectsManager<E>({
      focusManager: this.focus as any
    });
    // this.installLoggers()
    this.ready.resolve()
  }

  ready: Deferred<void>

  /**
   * Destroys the program.
   */
  destroy(): any {
    // this.document.destroy()
    this.cursor.leave()
    this.renderer.destroy()
  }

  /**
   * Creates an empty Element with given tagName with no parent.
   */
  createElement(tagName: string) {
    return this._document.createElement(tagName)
  }

  /**
   * Creates a new text node with given text with no parent.
   */
  createTextNode(text: string) {
    return this._document.createTextNode(text)
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
