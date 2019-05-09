import { isObject } from 'misc-utils-of-mine-generic'
import { Program, ProgramOptions } from '../declarations/program'
import { Node } from '../dom'
import { Flor, isJSXElementImpl } from '../jsx/createElement'
import { FullProps, isElement, ProgramDocument, ProgramElement } from '../programDom'
import { installExitKeys } from '../util/util'
import { EventManager } from './eventManager'
import { ProgramDocumentRenderer, RendererOptions } from './renderer'

interface FlorDocumentOptions extends ProgramOptions, RendererOptions {
  program?: Program
}
/**
 * Main entry point of the library
 *
```
const flor = new FlorDocument({})
flor.create({bg: 'red', fg: 'black', border: 'round', children: []})
```
 */
export class FlorDocument {
  // body: FlorBody
  static DOCUMENT_TYPE_NODE = Node.DOCUMENT_TYPE_NODE
  static TEXT_NODE = Node.TEXT_NODE
  static ELEMENT_NODE = Node.ELEMENT_NODE

  private _renderer: ProgramDocumentRenderer
  private _program: Program = undefined as any
  private _document: ProgramDocument
  private _events: EventManager

  constructor(o: FlorDocumentOptions = { buffer: true }) {
    if (!o.program) {
      this._program = new Program(o)
      installExitKeys(this._program)
    }
    this._events = new EventManager(this._program)
    this._document = new ProgramDocument(this._events)
    Flor.setDocument(this._document)
    this._renderer = new ProgramDocumentRenderer({ program: this._program })
  }

  get body() {
    return this.document.body
  }

  createElement(t: string) {
    return this._document.createElement(t)
  }

  createTextNode(c: string) {
    return this._document.createTextNode(c)
  }

  create(el: ProgramElement | Partial<FullProps> | JSX.Element) {
    let r: ProgramElement | undefined
    if (isElement(el)) {
      r = el;
    }
    else if (isJSXElementImpl(el)) {
      r = this.Flor.render(el  );
    }
    else if (isObject(el)) {
      r = this.document.create({ ...el as any });
    }
    if(r){
      this.document.body.appendChild(r)
    }
    else {
      throw new Error('Could not create element for input ' + el)
    }
    return r
  }

  get document() {
    return this._document
  }

  get Flor() {
    return Flor
  }

  get program() {
    return this._program
  }

  get events() {
    return this._events
  }

  get renderer(): ProgramDocumentRenderer {
    return this._renderer
  }

  render(el?: ProgramElement) {
    this.renderer.eraseElement(el || this.body)
    this.renderer.renderElement(el || this.body)
  }

  private _debugEl: ProgramElement = undefined as any
  debug(el: ProgramElement, props = {}) {
    if (!this._debugEl) {
      this._debugEl = this.create({   top: 10, left: 40, width: 40, height: 20, ...props, children: [el.debug()] })
    }
    this._debugEl.empty()
    el.debug().split('\n').forEach((l, i) => {
      this._debugEl.appendChild(this.create({ top: i, left: 0, children: [l] }))
    })
    this.renderer.renderElement(this._debugEl)
  }
}
