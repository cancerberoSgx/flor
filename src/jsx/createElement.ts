import { Node } from '../dom'
import { ProgramDocument, ProgramElement } from '../programDom'
import { Component } from './component'
import { FlorJsx, FlorJsxAttrs, RefObject, RenderOptions } from './types'

interface ComponentConstructor<P = {}, S = {}> {
  new(p: P, s: S): Component
}

function isComponentConstructor(tag: any): tag is ComponentConstructor {
  return typeof tag === 'function' && tag.prototype && tag.prototype.render
}

class JSXElementImpl<P extends { children?: JSX.FlorJsxNode } = { children: Array<JSX.FlorJsxNode> }> implements JSX.Element<P> {
  _component?: Component | undefined
  constructor(public type: string, attrs: FlorJsxAttrs) {
    this.props = { ...attrs || {} } as any
  }
  children: any[] = []
  props: P
}

/**
 * This implementation has a trivial createElement() and a heavier render(). This means that : "parsing" the
 * jsx will be fast. render() will be slower. PRO: createElement doesn't create any Elements so we are able to
 * modify the nodes and visit all of them bfore creating the ProgramElements. (implement Providers, etc.)
 */
class FlorJsxImpl implements FlorJsx {
  protected doc: ProgramDocument | undefined

  private _render({ e, document, parent }: { e: JSX.Element<{}> } & Required<RenderOptions>) {
    if (typeof e.type !== 'string') {
      throw new Error('unexpected undefined type ' + e)
    }
    const el = document.createElement(e.type)
    parent.appendChild(el)
    if (isJSXElementImpl(e) && e._component) {
      e._component.element = el;
      (el as any)._component = e._component
      e._component._elementCreated()
    }
    Object.keys(e.props || {}).forEach(attr => {
      const val = (e as any).props[attr]
      if (typeof val === 'function') {
        el._addEventListener(attr, val)
      }
      (el.props as any)[attr] = val
    })
    if (e.children) {
      if (Array.isArray(e.children)) {
        e.children.forEach(c => {
          if (isJSXElementImpl(c)) {
            let r: Node
            if (c.type === '__text') {
              r = document.createTextNode((c.props as any).textContent + '')
              el.appendChild(r)
            } else {
              r = this._render({ e: c, document, parent: el })
              // parent.appendChild(r)
            }
          } else {
            throw new Error('Unrecognized child type ' + c)
          }
        })
      } else {
        throw new Error('Unrecognized children type ' + e.children)
      }
    }
    if (isJSXElementImpl(e) && e._component) {
      e._component._elementReady()
      e._component.element && e._component.element._childrenReady()
    }
    this.installRefs(el, (el as any)._component)
    return el
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
   * Default blessed Node factory for text like "foo" in <box>foo</box>.
   */
  protected createTextNode(c: JSX.FlorJsxText | false, el: JSXElementImpl) {
    if (c !== null && c !== false) {
      const t = {
        type: '__text',
        props: {
          textContent: c + '',
          children: []
        }, children: []
      }
      this.appendChild(el, t)
    }
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
      } else if (Array.isArray(c2)) {
        this._addChildrenArray(c2, el)
      } else {
        this.createTextNode(c2, el)
      }
    })
  }

  protected installRefs(el: JSX.FlorJsxNode, component?: Component): any {
    if (component && (component as any).props && (component as any).props.ref) {
      (component as any).props.ref.current = component
        ; (component as any).props.ref.callback && (component as any).props.ref.callback(component)
    } else if ((el! as any) && (el! as any).props && (el! as any).props.ref && !(el! as any).props.ref.current) {
      (el! as any).props.ref.current = el! as any
        ; (el! as any).props.ref.callback && (el! as any).props.ref.callback(el)
    }
  }

  render<E extends ProgramElement = ProgramElement>(e: JSX.Element, options: RenderOptions = {}): E {
    if (!this.doc && !options.document) {
      throw new Error('Need to provide a document with setDocument() before render')
    }
    const document = options.document || this.doc!
    const el = this._render({ e, document, parent: options.parent || document.body })
    return el as E
  }

  setDocument<E extends ProgramElement = ProgramElement>(doc: ProgramDocument<E>) {
    this.doc = doc
  }

  createElement(tag: JSX.ElementType, attrs: FlorJsxAttrs, ...children: any[]) {
    let el: JSX.FlorJsxNode
    let component: Component | undefined
    if (isComponentConstructor(tag)) {
      component = new tag({ ...attrs, children }, {})
      el = component.render()
      if (isJSXElementImpl(el)) {
        el._component = component
      }
    } else if (typeof tag === 'function') {
      el = tag({ ...attrs, children })
    } else if (typeof tag === 'string') {
      el = new JSXElementImpl(tag, attrs)
      this.installAttributesAndChildren(el as any, children)
    }
    return el!
  }

  createRef<T extends ProgramElement | Component>(callback?: (current: T) => any): RefObject<T> {
    return ({
      current: undefined,
      callback
    } as any) as RefObject<T>
  }

}

export const Flor: FlorJsx = new FlorJsxImpl()

export function isJSXElementImpl(e: any): e is JSXElementImpl {
  return e && e.props && e.children
}

export function isJsxNode(el: any): el is JSX.FlorJsxNode {
  return isJSXElementImpl(el) || typeof el === 'string' || typeof el === 'number'
}
