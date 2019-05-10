import { ProgramDocument } from '..'
import { Node } from '../dom'
import { ProgramElement } from '../programDom'
import { Component } from './component'
import { BlessedJsxAttrs, FlorJsx } from './types'

interface RenderOptions {
  document?: ProgramDocument
  wrapTextInElement?: boolean | string
  /**
   * parent element to attach the rendered elements. if not provided document.body
   */
  parent?: ProgramElement
}

interface ComponentConstructor<P = {}, S = {}> {
  new (p: P, s: S): Component
}

function isComponentConstructor(tag: any): tag is ComponentConstructor {
  return typeof tag === 'function' && tag.prototype && tag.prototype.render
}

class JSXElementImpl<P extends { children?: JSX.FlorJsxNode } = {children: Array<JSX.FlorJsxNode>}> implements JSX.Element<P> {
  _component?: Component | undefined
  constructor(public type: string, attrs: BlessedJsxAttrs) {
    this.props = { ...attrs || {} } as any
  }
  children: any[] = []
  props: P
  _type: 'string' | 'function' | 'class' | undefined
}

/**
 * This implementation has a trivial createElement() and a heavier render(). This means that : "parsing" the jsx will be fast. render() will be slower. PRO: createElement doesn't create any Elements so we are able to modify the nodes and visit all of them bfore creating the ProgramElements. (implement Providers, etc.)
 */
class FlorJsxImpl implements FlorJsx {
  protected doc: ProgramDocument | undefined

  render(e: JSX.Element, options: RenderOptions = {}) {
    if (!this.doc && !options.document) {
      throw new Error('Need to provide a document with setDocument() before render')
    }
    const wrapInElement = options.wrapTextInElement ? typeof options.wrapTextInElement === 'boolean' ? 'text' : options.wrapTextInElement : undefined
    const document = options.document || this.doc!
    const el =  this._render({ e, document, wrapInElement })
    ;(options.parent || document.body).appendChild(el)
    return el
  }

  private _render({ e, document, wrapInElement }: {e: JSX.Element<{}>, document: ProgramDocument, wrapInElement?: string}) {
    if (typeof e.type !== 'string') {
      throw new Error('unexpected undefined type ' + e)
    }
    const el = document.createElement(e.type)
    if (isJSXElementImpl(e) && e._component) {
      e._component.element = el;
      (el as any)._component = e._component
      e._component.elementCreated()
    }
    Object.keys(e.props || {}).forEach(attr => {
      const val = (e as any).props[attr]
      if (typeof val === 'function') {
        el._addEventListener(attr, val)
      }
      //  else {
        (el.props as any)[attr] = val
      // }
    })
    if (e.children) {
      if (Array.isArray(e.children)) {
        e.children.forEach(c => {
          if (isJSXElementImpl(c)) {
            let r: Node
            if (c.type === '__text') {
              const text  = document.createTextNode((c.props as any).textContent + '')
              if (wrapInElement) {
                r = document.createElement(wrapInElement)
                r.appendChild(text)
              } else {
                r = text
              }
            } else {
              r = this._render({ e: c, document, wrapInElement })
            }
            el.appendChild(r)
          } else {
            throw new Error('Unrecognized child type ' + c)
          }
        })
      } else {
        throw new Error('Unrecognized children type ' + e.children)
      }
    }
    if (isJSXElementImpl(e) && e._component) {
      e._component.elementReady()
    }
    return el
  }

  setDocument(doc: ProgramDocument) {
    this.doc = doc
  }

  createElement(tag: JSX.ElementType, attrs: BlessedJsxAttrs, ...children: any[]) {
    let el: JSX.FlorJsxNode
    let component: Component | undefined
    if (isComponentConstructor(tag)) {
      component = new tag({ ...attrs, children }, {})
      el = component.render();
      (el as any)._type = 'class'
      if (isJSXElementImpl(el)) {
        el._component = component
      }
    } else if (typeof tag === 'function') {
      el = tag({ ...attrs, children });
      (el as any)._type = 'function'
    } else if (typeof tag === 'string') {
      el = new JSXElementImpl(tag, attrs);
      (el as any)._type = 'string'
    }
    if (typeof tag === 'string') {
      this.installAttributesAndChildren(el! as any,         children)
    }
    return el!
  }

  private installAttributesAndChildren(
    el: JSXElementImpl,
    children: any[]
  ): any {
    children.forEach(c => {
      if (isJSXElementImpl(c)) {
        this.appendChild(el, c)
      } else if (Array.isArray(c)) {
        this._addChildrenArray(c, el)
      } else {
        this.createTextNode(c, el)
      }
    })
  }

  private _addChildrenArray(c: any[], el: JSXElementImpl) {
    c.forEach(c2 => {
      if (isJSXElementImpl(c2)) {
        this.appendChild(el, c2)
        // }
      } else if (Array.isArray(c2)) {
        this._addChildrenArray(c2, el)
      } else {
        this.createTextNode(c2, el)
      }
    })
  }

  /**
   * all children blessed nodes, even from text  are appended to the blessed element using this method, so
   * subclasses can override to do something about it. will notify beforeAppendChildListeners and if any
   * return true the child won't be appended
   */
  protected appendChild(el: JSXElementImpl, child: JSXElementImpl): any {
    if (el && el.props && el.children) {
      el.children.push(child)
    }
  }

  /**
   * Default blessed Node factory for text like "foo" in <box>foo</box>
   */
  protected createTextNode(c: JSX.BlessedJsxText, el: JSXElementImpl) {
    const t = { type: '__text', props: { textContent: c + '', children: [] }, children: [], _type: 'string' as any }
    this.appendChild(el, t)
    return t
  }

}

export const Flor: FlorJsx = new FlorJsxImpl()

export function isJSXElementImpl(e: any): e is JSXElementImpl {
  return e && e.props && e.children &&  ['string', 'function', 'class' , undefined].includes(e._type)
}

export function isJsxNode(el: any): el is JSX.FlorJsxNode {
  return isJSXElementImpl(el) || typeof el === 'string' || typeof el === 'number'
}
