import { isObject } from 'misc-utils-of-mine-generic'
import { inspect } from 'util'
import { ElementProps, FullProps, isElement, ProgramDocument, ProgramElement } from '..'
import { Program, ProgramOptions } from '../declarations/program'
import { Flor, isJSXElementImpl } from '../jsx/createElement'
import { addLogger, Layout } from '../util'
import { CursorManager } from './cursorManager'
import { EventManager } from './eventManager'
import { FocusManager } from './focusManager'
import { installExitKeys } from './programUtil'
import { ProgramDocumentRenderer, RendererCreateOptions } from './renderer'
import { StyleEffectsManager } from './effects';

export interface FlorDocumentOptions <E extends ProgramElement = ProgramElement, T extends ProgramDocument<E>= ProgramDocument<E>>  extends ProgramOptions, RendererCreateOptions {
  program?: Program
  useAnsiDiff?: boolean
  documentImplementation?: () => T
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

export class FlorDocument<E extends ProgramElement= ProgramElement> {
  private _renderer: ProgramDocumentRenderer
  private _program: Program = undefined as any
  private _document: ProgramDocument<E>
  private _events: EventManager
  private _focus: FocusManager
  private _cursor: CursorManager
  private _effects: StyleEffectsManager<E>;
 
  constructor(o: FlorDocumentOptions = { buffer: true }) {
    if (!o.program) {
      const programDefaultOptions = { buffer: true }
      this._program = new Program({ ...programDefaultOptions, ...o })
      this._program.setMouse({
        allMotion: true
      }, true)
      this._program.enableMouse()
      installExitKeys(this._program)
    }
    this.render = this.render.bind(this)
    this._events = new EventManager(this._program)
    this._document = o.documentImplementation ? o.documentImplementation() : new ProgramDocument()   as any
    Flor.setDocument(this._document)
    this._renderer = new ProgramDocumentRenderer({ program: this._program })
    this._focus = new FocusManager(this._events, this._document)
    this.body.props.assign({ height: this.program.rows, width: this.program.cols, top: 0, left: 0 })
    this._document._setManagers(this)
    this.createTextNode = this.createTextNode.bind(this)
    this.debug = this.debug.bind(this)
    this._cursor = new CursorManager({ program: this._program, cursor: {} })
    this._cursor.enter()
    this._effects = new StyleEffectsManager<E>({
      focusManager: this.focus  as any
    })
    // this.installLoggers()
  }

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
  create<T extends ProgramElement= ProgramElement>(el: ProgramElement | Partial<FullProps> | JSX.Element): T {
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
    return r as T
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

  public get effects()  {
    return this._effects;
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
  render(el: ProgramElement= this.body) {
    this.renderer.eraseElement(el)
    this.renderer.renderElement(el)
  }

  private _debugEl: ProgramElement | undefined

  /**
   * Prints a box, by default at the right-bottom corner of the screen, with given text or element inside.
   */
  debug(el: any, props: Partial<ElementProps> & {hideTimeout?: number} = {}, ...args: any[]) {
    if (!this._debugEl) {
      this._debugEl = this.create({   top: .7, left: .01, width: 200, height: .3, ...props, children: ['LOG']
      , doLayout: { layout: Layout.justifiedRows }, preventChildrenCascade: true
      })
    }
    this._debugEl.empty()
    if (typeof el === 'string') {
      this._debugEl.appendChild(this.create({  children: [el] }))
    } else if (isElement(el)) {
      (el.debugAsXml() || '').split('\n').forEach((l, i) => {
        this._debugEl!.appendChild(this.create({   children: [l] }))
      })
    } else {
      args.push(el)
    }
    args.map(a => typeof a === 'string' ? a : inspect(a, { sorted: true, compact: true,maxArrayLength: 44, breakLength: 120 }))
    .forEach(c => {
      this._debugEl!.appendChild(this.create({  children: [c] }))
    })
    this._debugEl.forceUpdate(true)
    this.render(this._debugEl)
    if (props.hideTimeout) {
      setTimeout(() => {
        this._debugEl!.forceUpdate(true)
        this.render(this._debugEl)
      }, props.hideTimeout)
    }
  }

  private installLoggers() {
    addLogger({
      log: (...args: any[]) => {
        this.debug('', undefined, ...args)
      }
    })
  }

  printBuffer(linesTrimRight= true)  {
    return this.renderer.printBuffer(linesTrimRight)
  }

}
