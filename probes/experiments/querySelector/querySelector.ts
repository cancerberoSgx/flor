import { objectKeys } from 'misc-utils-of-mine-generic';
import { notUndefined, TODO } from 'misc-utils-of-mine-typescript';
import { Node } from '../../../src/dom/node';
import { NodePredicate, VisitorOptions } from '../../../src/dom/nodeUtil';
import { ElementPropsImpl, isElement } from '../../../src/programDom';

export interface Selector<T extends Node = Node, PropValue extends any = any> {
  prop?: { prop: StringPredicate, value: string | number | boolean | undefined | Predicate<PropValue> }
  predicate?: NodePredicate<T>
  // TODO: on other things than descendants, like in siblings or in ascendants:
  // target?: TargetType[]
}

// type TargetType = 'children'|'descendants'|'ascendants'|'siblings'|'sibling-descendants'|'sibling-ascendants'
type Predicate<T> = T | ((s: T, name?: string) => boolean)
type StringPredicate = string | ((s: string) => boolean)

export function querySelector<T extends Node = Node>(n: Node, selector: Selector<T>, options: VisitorOptions): T | undefined {
  let predicate = buildPredicate<T>(selector)
  return n.findDescendant<T>(predicate)
}

export function querySelectorAll<T extends Node = Node>(n: Node, selector: Selector<T>, options: VisitorOptions): T[] {
  let predicate = buildPredicate<T>(selector)
  return n.filterDescendants<T>(predicate)
}

// TODO: MEMOIZE
function buildPredicate<T extends Node = Node>(selector: Selector<T>): NodePredicate<T> {
  return n => {
    if (selector.predicate && !selector.predicate(n)) {
      return false
    } else if (selector.prop) {
      if (!isElement(n)) {
        return false
      } else {
        const prop = (typeof selector.prop.prop === 'string' ? typeof selector.prop.prop : objectKeys(n).find(selector.prop.prop)) as keyof ElementPropsImpl
        if (!prop) {
          return false
        } else {
          let value = n.props[prop]
          return typeof selector.prop.value === 'function' ? selector.prop.value(value, prop) : value === selector.prop.value
        }
      }
    } else {
      throw new Error('Invalid predicate without prop or predicate function')
    }

  }
}

const { parse } = require('./selectorSyntax')

export function parseSelector(s: string): Parsed {
  return parse(s)
}

interface Options {
  all?: boolean
  parent: Node,
  query: Parsed
  visitorOptions?: VisitorOptions
  onMatch?(n: Node): void
  onEnd?(result: TODO): void
  __filterFn?: boolean
}
function select(o: Options) {
  if (o.query.type === 'class') {
    selectClass(o.parent, o.query)
    // .map(r=>handleNextLevel(o.parent,o.query))
  }
  function selectClass<T extends Node = Node>(n: Node, s: Parsed): T[] {
    return filterDescendants(o)(d => isElement(d) && !!d.props.classes && d.props.classes.includes(s.name)) as T[]
  }

  function selectProp<T extends Node = Node>(n: Node, s: Parsed): T[] {
    return filterDescendants(o)(
      d => {
        if (!isElement(d)) {
          return false
        } else if (s.operator === 'equals') {
          return equals((d as any).props[s.name], s.value)
        } else if (s.operator === 'contains') {
          return contains((d as any).props[s.name], s.value)
        } else {
          return false
        }
      }) as T[]
  }
  function equals(a: any, b: any) {
    return a == b
  }

  function contains(a: any, b: any) {
    return a + ''.includes(b + '')
  }
  function handleNextLevel(n: Node, s: Parsed) {

  }

  // filterDescendants<T extends Node = Node>(p: ElementPredicate<T>, o: VisitorOptions = {}): T[] {
  function filterDescendants<T extends Node = Node>(o: Options): (p: NodePredicate<T>) => T[] {
    if (!o.__filterFn) {
      o.__filterFn = true
      o.parent.filterDescendants = o.parent.filterDescendants.bind(o.parent) as any
      o.parent.findDescendant = o.parent.findDescendant.bind(o.parent) as any
    }
    return o.all ? p => o.parent.filterDescendants(p, o.visitorOptions) : p => [o.parent.findDescendant(p)].filter(notUndefined, o.visitorOptions)
  }
}

interface Parsed {
  name: string// "classes",
  value: string | number// "class1",
  operator: 'contains' | 'equals'
  type: 'class' | 'id' | 'name' | 'prop'
  prevSibling?: Parsed[]
  nextSibling?: []
  parentAggregation?: 'and' | 'or'
  descendants?: Parsed[]
  children?: Parsed
  ancestor?: Parsed
}
