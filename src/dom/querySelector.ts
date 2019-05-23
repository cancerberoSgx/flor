import { ElementSimplePredicate, ElementKindPredicate, VisitorOptions, ElementPredicate } from './nodeUtil';
import { Node } from './node';
import { isElement, ElementProps, ElementPropsImpl } from '../programDom';
import { objectKeys } from 'misc-utils-of-mine-generic';

export interface Selector<T extends Node = Node , PropValue extends any = any > {
  prop?: {prop: StringPredicate, value:  string|number|boolean|undefined|Predicate<PropValue>}
  predicate?:ElementPredicate<T>
  // TODO: on other things than descendants, like in siblings or in ascendants:
  // target?: TargetType[]
}

// type TargetType = 'children'|'descendants'|'ascendants'|'siblings'|'sibling-descendants'|'sibling-ascendants'
type Predicate<T> = T|((s:T, name?: string)=>boolean)
type StringPredicate = string|((s:string)=>boolean)

export function querySelector<T extends Node = Node  >(n: Node, selector: Selector<T>, options: VisitorOptions): T|undefined{
  let predicate = buildPredicate<T>(selector)
  return n.findDescendant<T>(predicate)
}

export function querySelectorAll<T extends Node = Node  >(n: Node, selector: Selector<T>, options: VisitorOptions): T[] {
  let predicate = buildPredicate<T>(selector)
  return n.filterDescendants<T>(predicate)
}

// TODO: MEMOIZE 
function buildPredicate<T extends Node = Node  >(selector: Selector<T>):ElementPredicate<T> {
  return n=>{
    if(selector.predicate && !selector.predicate(n)){
      return false
    }
    else if(selector.prop){
      if(!isElement(n)){
        return false
      }
      else {
        const prop  =( typeof selector.prop.prop === 'string' ? typeof selector.prop.prop : objectKeys(n).find(selector.prop.prop) )as keyof ElementPropsImpl
        if(!prop){
          return false
        }
        else {
          let value = n.props[prop]
          return typeof selector.prop.value==='function' ? selector.prop.value(value, prop) : value===selector.prop.value
        }
      }
    }
    else {
      throw new Error('Invalid predicate without prop or predicate function')
    }

  }
}

const {parse}= require('./selectorSyntax')
export function parseSelector(s: string){
  return parse(s)
}