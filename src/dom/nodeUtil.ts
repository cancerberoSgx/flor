import { notFalsy } from 'misc-utils-of-mine-typescript'
import { Element, Node, Document,TextNode  } from '.'
import { repeat } from 'misc-utils-of-mine-generic';

export function nodeTypes(n: Node): number[] {
  const o: number[] = []
  visitChildren(n, c => o.push(c.nodeType))
  return o
}

export function nodeTexts(n: Node): (string | null)[] {
  return mapChildren(n, c => c.textContent)
}

export function isDomElement(n: any): n is Element {
  return n && n.nodeType === Node.ELEMENT_NODE
}

export function isDomText(n: any): n is TextNode {
  return n && n.nodeType === Node.TEXT_NODE
}

export function isDomDocument(n: any): n is Document {
  return n && n.nodeType === Node.DOCUMENT_TYPE_NODE && !!n.createElement
}
// export function nodeAttributes(n: Node): (Attr[] | null)[] {
//   return mapChildren(n, c => {
//     if (isDomElement(c)) {
//       const attrs: Attr[] = []
//       Array.from(c.attributes).forEach(a => attrs.push({ name: a.name, value: a.value }))
//       return attrs
//     } else {
//       return null
//     }
//   })
// }

export function visitChildren(n: Node, v: (c: Node) => void) {
  v(n)
  Array.from(n.childNodes as any).forEach(c => visitChildren(c as any, v))
}

export function mapChildren<T>(n: Node, v: (c: Node) => T): T[] {
  const o: T[] = []
  visitChildren(n, c => o.push(v(c)))
  return o
}

export function findChildren<T extends Node = Node>(n: Node, p: ElementPredicate) {
  return Array.from(n.childNodes).find<T>(c => p(c))
}

export function filterChildren<T extends Node = Node>(n: Node, p: ElementPredicate) {
  return Array.from(n.childNodes).filter(c => p(c))
}

// export type Visitor<T extends Node = Node> = (n: T) => boolean
// /**
//  * settings for visitDescendants regarding visiting order and visit interruption modes.
//  */
// export interface VisitorOptions {
//   childrenFirst?: boolean
//   /**
//    * if a descendant visitor returned true, we stop visiting and signal up
//    */
//   breakOnDescendantSignal?: boolean
//   /**
//    * no matter if visitor returns true for a node, it will still visit its descendants and then break the chain
//    */
//   visitDescendantsOnSelfSignalAnyway?: boolean
// }

// /**
//  * Visit node's descendants until the visitor function return true or there are no more. In the first
//  * different modes on which visiting the rest of descendants or ancestors are configurable through the
//  * options. By default, first the parent is evaluated which is configurable configurable with
//  * [[[VisitorOptions.childrenFirst]]
//  * */
// export function visitDescendants(n: Node, v: Visitor, o: VisitorOptions = {}): boolean {
//   let r = false
//   if (o.childrenFirst) {
//     r = Array.from(n.childNodes).some(c => visitDescendants(c, v, o))
//     if (r) {
//       if (!o.breakOnDescendantSignal) {
//         v(n)
//       }
//       return true
//     } else {
//       return v(n)
//     }
//   } else {
//     r = v(n)
//     if (r) {
//       if (!o.visitDescendantsOnSelfSignalAnyway) {
//         return true
//       } else {
//         return Array.from(n.childNodes).some(c => visitDescendants(c, v, o)) || true // true because self was signaled
//       }
//     } else {
//       return Array.from(n.childNodes).some(c => visitDescendants(c, v, o))
//     }
//   }
// }

// export type ElementPredicate<T extends Node = Node> = (n: T) => boolean

// export function filterDescendants<T extends Node = Node>(n: Node, p: ElementPredicate, o: VisitorOptions = {}): T[] {
//   const a: T[] = []
//   visitDescendants(
//     n,
//     c => {
//       if (p(c)) {
//         a.push(c as T)
//       }
//       return false
//     },
//     o
//   )
//   return a
// }

// export function mapDescendants<T extends Node = Node, V = any>(n: Node, p: (p: T) => V, o: VisitorOptions = {}): V[] {
//   const a: V[] = []
//   visitDescendants(
//     n,
//     c => {
//       a.push(p(c as any))
//       return false
//     },
//     o
//   )
//   return a
// }

// export function findDescendant<T extends Node = Node>(n: Node, p: ElementPredicate, o: VisitorOptions = {}) {
//   let a: T | undefined
//   visitDescendants(
//     n,
//     c => {
//       if (p(c)) {
//         a = c as T
//         return true
//       }
//       return false
//     },
//     o
//   )
//   return a
// }

export function visitAscendants(n: Node, v: Visitor, o = {}): boolean {
  return !n || v(n) || !n.parentNode || visitAscendants(n.parentNode, v, o)
}

export function findAscendant<T extends Node = Node>(n: T, p: ElementPredicate, o = {}) {
  let a: T | undefined
  visitAscendants(
    n,
    c => {
      if (p(c)) {
        a = c as T
        return true
      }
      return false
    },
    o
  )
  return a
}

export function findRootElement(n: Node) {
  return isDomDocument(n) || isDomDocument(n.parentNode) ? n : findAscendant(n, a => isDomDocument(a) || isDomDocument(a.parentNode))
}

export function filterAscendants<T extends Node = Node>(n: Node, p: ElementPredicate, o: VisitorOptions = {}): T[] {
  const a: T[] = []
  visitAscendants(n, c => {
    if (p(c)) {
      a.push(c as T)
    }
    return false
  })
  return a
}

export function findDescendantTextNodeContaining(
  el: Element | Document,
  name: string,
  o: VisitorOptions = {}
): TextNode | undefined {
  return asElements(el)
    .map(c => findDescendant(c, d => (d as any).name === name, o))
    .find(notFalsy)
}

export function filterDescendantTextNodesContaining(
  el: Element | Document,
  name: string,
  o: VisitorOptions = {}
): TextNode[] {
  return asElements(el)
    .map(c => filterDescendants(c, d => isDomText(d) && (d.textContent || '').includes(name)))
    .flat()
}

export function asElements(el: Element | Document): Element[] {
  return (isDomElement(el) ? [el] : [el.body]).filter(isDomElement) // ? Array.from(body.childNodes).filter(isElement) : [el]
}

// export function visitAncestors(n: Node, v: Visitor, o = {}): boolean {
//   return !n || v(n) || !n.parentNode || n.parentNode === n.ownerDocument || visitAncestors(n.parentNode, v, o)
// }

// export function findAncestor<T extends Node = Node>(n: Node, p: ElementPredicate, o = {}) {
//   let a: T | undefined
//   visitAncestors(
//     n,
//     c => {
//       if (p(c)) {
//         a = c as T
//         return true
//       }
//       return false
//     },
//     o
//   )
//   return a
// }

// export function filterAncestors<T extends Node = Node>(n: Node, p: ElementPredicate, o: VisitorOptions = {}): T[] {
//   const a: T[] = []
//   visitAncestors(n, c => {
//     if (p(c)) {
//       a.push(c as T)
//     }
//     return false
//   })
//   return a
// }

  /**
   * returns the first descendant node that contains given text. Warning, if you use the type parameter to
   * cast the result, be aware that this method doesn't perform any verification on the returned type.
   */
export function  findDescendantContaining<T extends Node = Node>(n: Node, text: string, o: VisitorOptions = {}): T | undefined {
  return findDescendant(n, n => (n.textContent || '').includes(text), o)
}

    /**
   * returns the first descendant node that contains given text. Warning, if you use the type parameter to
   * cast the result, be aware that this method doesn't perform any verification on the returned type.
   */
export function  filterDescendantContaining<T extends Node = Node>(n: Node, text: string, o: VisitorOptions = {}): T [] {
  return filterDescendants(n, n => (n.textContent || '').includes(text), o)
}

export type Visitor<T extends Node = Node> = (n: T) => boolean
/**
 * settings for visitDescendants regarding visiting order and visit interruption modes.
 */
export interface VisitorOptions {
  childrenFirst?: boolean
  /**
   * if a descendant visitor returned true, we stop visiting and signal up
   */
  breakOnDescendantSignal?: boolean
  /**
   * no matter if visitor returns true for a node, it will still visit its descendants and then break the chain
   */
  visitDescendantsOnSelfSignalAnyway?: boolean
  andSelf?: boolean
}

/**
 * Visit node's descendants until the visitor function return true or there are no more. In the first
 * different modes on which visiting the rest of descenda|nts or ancestors are configurable through the
 * options. By default, first the parent is evaluated which is configurable configurable with
 * [[[VisitorOptions.childrenFirst]]
 * */
export function visitDescendants(n: Node, v: Visitor, o: VisitorOptions = {}, inRecursion=false): boolean {
  let r = false
  if (o.childrenFirst) {
    r = n.children.some(c => visitDescendants(c, v, o, true))
    if (r) {
      if (!o.breakOnDescendantSignal&&(o.andSelf||inRecursion)) {
        v(n)
      }
      return true
    } else if(o.andSelf||inRecursion){
        r = v(n)
      }
      return false
  } else {
    if(o.andSelf||inRecursion){
      r = v(n)
    }
    if (r) {
      if (!o.visitDescendantsOnSelfSignalAnyway) {
        return true
      } else {
        return n.children.some(c => visitDescendants(c, v, o ,true)) || true // true because self was signaled
      }
    } else {
      return n.children.some(c => visitDescendants(c, v, o, true))
    }
  }
}

export type ElementPredicate<T extends Node = Node> = (n: T) => boolean

export function filterDescendants<T extends Node = Node>(n: Node, p: ElementPredicate, o: VisitorOptions = {}): T[] {
  const a: T[] = []
  visitDescendants(
    n,
    c => {
      if (p(c)) {
        a.push(c as T)
      }
      return false
    },
    o
  )
  return a
}

export function mapDescendants<T extends Node = Node, V = any>(n: Node, p: (p: T) => V, o: VisitorOptions = {}): V[] {
  const a: V[] = []
  visitDescendants(
    n,
    c => {
      a.push(p(c as any))
      return false
    },
    o
  )
  return a
}

export function findDescendant<T extends Node = Node>(n: Node, p: ElementPredicate, o: VisitorOptions = {}) {
  let a: T | undefined
  visitDescendants(
    n,
    c => {
      if (p(c)) {
        a = c as T
        return true
      }
      return false
    },
    o
  )
  return a
}

// export function findChildren<T extends Node = Node>(n: Node, p: ElementPredicate) {
//   return n.children.find<T>(c => p(c))
// }

// export function filterChildren<T extends Node = Node>(n: Node, p: ElementPredicate) {
//   return n.children.filter(c => p(c))
// }

// //TODO: ancestors, direct children and siblings. nice to have getFirstDescendantOfType, etc


export function nodeHtml(node: Node, outer = true, _level=0): string {
  if (isDomDocument(node)) {
    return `<document>${elementHtml(node.body, outer, _level)+'\n'+repeat(_level, '  ')}</document>`
  } else if (isDomElement(node)) {
    return elementHtml(node, outer, _level)
  } else {
    return '\n'+repeat(_level, '  ')+ node.textContent || ''
  }
}

function elementHtml(node: Element, outer: boolean, _level=0) {
  const attrs = [...Array.from(node.attributes), ...Object.keys((node as any).props && (node as any).props.data || {})
    .map(k => ({ name: k, value: (node as any).props[k] }))]
  return `${'\n'+repeat(_level, '  ')}${outer ? `<${node.tagName}${attrs.length ? ' ' : ''}${attrs.map(a => a.value && `${a.name}="${a.value.toString ? a.value.toString() : a.value}"`)
    .filter(a => a)
    .join(' ')}>` : ``}${Array.from(node.childNodes).map(c => nodeHtml(c, true, _level+1)).join('\n'+repeat(_level, '  '))+'\n'+repeat(_level, '  ')}${outer ? `</${node.tagName}>` : ``}`.split('\n')
    .map(l=>l.trim() ? l : '')
    // .filter((l, i, a)=> l || i===0 || a[i-1])
    .join('\n')
    .replace(/\n+/gm, '\n') // removes consecutive end of lines
}
