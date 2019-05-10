import { isObject } from 'misc-utils-of-mine-generic'
import { Program, ProgramOptions } from '../declarations/program'
import { Flor, isJSXElementImpl } from '../jsx/createElement'
import { ElementProps, FullProps, isElement, ProgramDocument, ProgramElement } from '../programDom'
import { installExitKeys } from '../util/util'
import { EventManager } from './eventManager'
import { FocusManager } from './focusManager'
import { ProgramDocumentRenderer, RendererOptions } from './renderer'

interface FlorDocumentOptions extends ProgramOptions, RendererOptions {
  program?: Program
}
/**
 * Main entry point for the library. When calling `new FlorDocument()`, a new [[Program]] instance is created along with a new [[ProgramDocumentRenderer]], [[ProgramDocument]], [[EventManager]] and [[FocusManager]].

Examples:
```
const flor = new FlorDocument({})
const mainBox = flor.create({bg: 'red', fg: 'black', left: 0, top: 0, width: .5, height: .5})
```

```

```
TODO: probably this should extend ProgramDocument and handle all registerListener call here directly.
*/
export class FlorDocument {
  private _renderer: ProgramDocumentRenderer
  private _program: Program = undefined as any
  private _document: ProgramDocument
  private _events: EventManager
  private _focus: FocusManager

  constructor(o: FlorDocumentOptions = { buffer: true }) {
    if (!o.program) {
      this._program = new Program(o)
      this._program.enableMouse()
      installExitKeys(this._program)
    }
    this._events = new EventManager(this._program)
    this._document = new ProgramDocument()
    Flor.setDocument(this._document)
    this._renderer = new ProgramDocumentRenderer({ program: this._program })
    this._focus = new FocusManager(this._events, this._document)
    this.body.props.assign({ height: this.program.rows, width: this.program.cols, top: 0, left: 0 })
    this._document._setManagers(this)
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
  create(el: ProgramElement | Partial<FullProps> | JSX.Element) {
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
    return r
  }

  /**
   * Current [[ProgramDocument]] instance.
   */
  get document() {
    return this._document
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
    return this.document.body
  }

  /**
   * Current [[FocusManager]] instance.
   */
  get focus() {
    return this._focus
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
  render(el?: ProgramElement) {
    this.renderer.eraseElement(el || this.body)
    this.renderer.renderElement(el || this.body)
  }

  private _debugEl: ProgramElement | undefined
  /**
   * Prints a box, by default at the right-bottom corner of the screen, with given text or element inside.
   */
  debug(el: ProgramElement | string, props: Partial<ElementProps> & {hideTimeout?: number} = {}) {
    if (!this._debugEl) {
      this._debugEl = this.create({   top: .7, left: .7, width: .3, height: .3, ...props, children: [] })
    }
    this._debugEl.empty()
    if (typeof el === 'string') {
      this._debugEl.appendChild(this.create({ top: 0, left: 0, children: [el] }))
    } else if (this._debugEl) {
      el.debug().split('\n').forEach((l, i) => {
        this._debugEl!.appendChild(this.create({ top: i, left: 0, children: [l] }))
      })
    }
    this.renderer.renderElement(this._debugEl)
    if (props.hideTimeout) {
      setTimeout(() => {
        if (this._debugEl) {
          this._debugEl.empty()
          this.render(this._debugEl)
        }
      }, props.hideTimeout)
    }
  }

  /**
   * Destroys the program.
   */
  destroy(): any {
    this.renderer.destroy()
  }

}
