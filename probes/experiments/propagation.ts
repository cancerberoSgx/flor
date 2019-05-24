// import { FlorDocument } from '../../src/manager/florDocument';
// import { ObjectStringKeyUnion, TODO } from 'misc-utils-of-mine-typescript';
// import { Attrs, StyleProps, ElementPropsImpl, ProgramElement, ElementProps } from '../../src/programDom';
// import { YogaElementProps } from '../../src/yogaDom';
// import { Element } from '../../src/dom';

// /*

// A dedicated manager responsible of propeperty declarations:

//  * maintain a set of rectanglePlusOffsets, that are flexible allowing real-time actions dynamic (fuctions) change on the current render state flags like     preventSiblingCascade: true, preventChildrenCascade: false

//  * maintains the state of theseflags (preventSiblingCascade, children, etc) in the current Flor.render() process

//   * allows listeners that add custom behavior for existing setFlagsFromString.

//  * future : listeners could declare new flags

//  # intro

//  right now the the logic of these flags are all implemented and declared in the renderer. Is possible to turn on off each flag dinamically bit not to declare custom rules:

//  For example, property 'border' could make sense to prevent childrenPropagation while, while 'fg' would want to keep it enabled.

// Also there should be an API for declaring things like: "if current element prop X value is Y then enable hese rules (a1, a2, a3) and deable these other rules (b1, b2, b3)"

// # FUTURE: generalize to other kind of flags and conditions, not just props propagation on render

// ## This is currently possilbe to do using a custom element that subscribe to beforeRender/childs, text etc hooks and manage the renderer .

// We want to centralize the API here. Also we need to define changes per property. Each element can change the state (so we have per element), but since there is no property iteration custom flags per property type is not possible.
//    * make an extensible API so is easy to declare behavior for new properties.

// # this could be very powerful if we are genric we can attack lots of interaction problems, like focus

//    the trigger could happen not only at render, but at any time, for example, on a user event.
//    the flags could be other things, not just cascadePropagation. Could be :
//      * prevent scrolling here
//      * prevent focus there
//      * prevent key events there

//    Perhaps they can be all represented with properties ?

//   Example of generic rules:

//   * when element $1 is visible prevent elements $2 to receive events or focus
//     * never show elements $1 if X condition (path is /home)
//     * wh
//  */

// interface Base<O extends BaseOptions = BaseOptions> {
//   name?: string
//   description?: string
//   // constructor: (o:O)=>Base<O>//{prototype: Base<O>}
// }
// interface BaseConstructor<O extends BaseOptions = BaseOptions> {
//   // prototype: {

//     // (options: O)=>Base<O>
//   // }
//   // new (options: O):Base<O>
// }
// interface BaseOptions {}

//  interface FlorStateManager<O extends RulerOptions = RulerOptions> extends Base<O> {
//   registerRuler(r:StateRuler<FlorStateMoments, O> ):void
//  }
//  interface RulerOptions extends BaseOptions{

//  }
//  interface StateRuler<M extends FlorStateMoments=FlorStateMoments, O extends RulerOptions = RulerOptions, P extends Parameters<WhenPredicates[M]> = Parameters<WhenPredicates[M]>> extends Base<O> {
//   priority?: number
//   moment: Moment<M>
//   dispatch(state: State, ...args: P):void|boolean
// }
// interface State extends FlorDocument{

// }
// interface Moment<M extends FlorStateMoments=FlorStateMoments> {
//   name: M
//   when: MomentWhen
// whenPredicate?: WhenPredicates[M]
// }
// type WhenPredicatePropertyChange<E extends ProgramElement =ProgramElement> = (el: E, propertyName: PropertyNames)=>boolean
// type MomentWhen = 'before'|'after'
//  /**
//   * for each of these moments, listeners can subscribe for 'before' and 'after' they happen. In the case of 'before0 they can stop the event by calling e.stopPropagation.
//   *
//   * FUTURE: remove the enum and make them objects so new moments can be registered dunamically . For now is easier to have the enum.
//   */
//  enum FlorStateMoments {
//    /**When Flor.render() method is call */
//    florRender='florRender',
//    'renderElement'= 'renderElement', 'renderChild'= 'renderChild',
//    'elementGetsDirty'= 'elementGetsDirty',
//    /** before or after renderer.write method is call to write a line of charsr in the screen. Much lighweight than 'renderElement'= 'renderElement, etc since only passes the attrs and line to be written. */
//    'writeAttrs'= 'writeAttrs',
//    /** when an element's property is changed */
//    'propertyChange'= 'propertyChange',
//    'domStructureChange'= 'domStructureChange',
//    'mouseEvent'= 'mouseEvent', 'keyEvent'= 'keyEvent', 'focus'='focus'
//  }

//  interface WhenPredicates {
//   [FlorStateMoments.propertyChange]: WhenPredicatePropertyChange
//   [FlorStateMoments.florRender]: TODO
// [FlorStateMoments.renderElement]: TODO
// [FlorStateMoments.renderChild]: TODO
// [FlorStateMoments.elementGetsDirty]: TODO
// [FlorStateMoments.renderElement]: TODO
// [FlorStateMoments.writeAttrs]: TODO
// [FlorStateMoments.domStructureChange]: TODO
// [FlorStateMoments.mouseEvent]: TODO
// [FlorStateMoments.keyEvent]: TODO
// [FlorStateMoments.focus]: TODO
// }

// abstract class AbstractFlorStateManager<O extends RulerOptions = RulerOptions > implements FlorStateManager<O>{
//   constructor(protected options:O){
// }
// name?: string
//   description?: string | undefined;
//   protected  rulers: StateRuler[] = []
//   registerRuler(r:StateRuler){
//     this.rulers.push(r)
//   }
//   removeRuler(r:StateRuler){
//     this.rulers = this.rulers.filter(u=>u!==r)
//   }
// }
// abstract class AbstractFlorStateRuler<M extends FlorStateMoments, O extends RulerOptions = RulerOptions> implements StateRuler<M, O> {
//   priority?: number | undefined;
//   abstract moment: Moment<M>;
//   abstract dispatch(state: State, ...args: Parameters<WhenPredicates[M]>): boolean | void
//   name?: string | undefined;
//   description?: string | undefined;
//   constructor(protected options:O){
//   }
// }

// // interface Property extends Base {
// //   type: Type,
// // }
// // interface Type extends Base{
// //  name :'string' |'boolean'|'number'
// // }

// /**
//  * Each property can declare if it propagates to children or to siblings, individually. For example, 'fg' and 'bg' propagates to children. 'border', 'focus', 'onClick' never propagates.
//  *
//  * An example for nextSiblings could be a property like 'display: inpline': It propagates to next sibling if and only if the next sibling doesn't have' display: block'.
//  */
// enum PropsCascadeRuleNames {
//   propagateToChildren='propagateToChildren',
//   propagateToNextSiblings='propagateToNextSiblings'
// }
// type PropertyNames = ObjectStringKeyUnion<Attrs> |ObjectStringKeyUnion<StyleProps>|ObjectStringKeyUnion<ElementPropsImpl>|ObjectStringKeyUnion<YogaElementProps>

// type PropsCacadeRule = {[k in PropertyNames]: boolean}
// type PropsCascadeRules = {[k in PropsCascadeRuleNames]: Partial<PropsCacadeRule>}
// interface PropsCascadeOptions extends RulerOptions {
// defaultValues?: DefaultValues
// }
// // interface PropsCascadeRuler extends StateRuler<PropsCascadeOptions> {

// // }

// class PropsCascadeRuler<O extends BaseOptions = PropsCascadeOptions> extends  AbstractFlorStateRuler<FlorStateMoments.renderChild, O>   {
//    moment:  Moment<FlorStateMoments.renderChild>= {
//      name: FlorStateMoments.renderChild,
//      when: 'after'
//     }
//    rules: PropsCascadeRules = {
//     [PropsCascadeRuleNames.propagateToChildren]: {
//       // false
//       bg: true, fg: true, bold: true, underline: true, invisible: true, ch: true, margin: true, padding: true,

//       // false
//       border: false, top: false, left: false, width: false,height: false,
//     },
//     [PropsCascadeRuleNames.propagateToNextSiblings]: {

//     }
//    }
//    /**
//     * If the property is not defined in [[rules]] then these values will be set if any. If not defined even here, then the value is maintained (inherits)
//     */
//    defaultValues: DefaultValues = {
//     [PropsCascadeRuleNames.propagateToChildren]: undefined, [PropsCascadeRuleNames.propagateToNextSiblings]: false,
//    }
//    dynamicRules: DynamicRule[] = [
//      {
//        dispatch: // example of a custom dynamic rule. Notice that this could eb archived with a custom element or component, but in this case it will be installed globally without needing to declare any element whatsoever.
//       options=>{
//         // the combination of colors yellow-black cannot be present on sibling nodes because if of Peñarol Futbol Club, or rival team, if we found it, we re-paint it with the colors of our team, Nacional Futbol Club, red and blue.
//        if(options.previousSibling){
//          if(options.previousSibling.props.bg==='yellow' && options.element.props.bg==='black'||options.previousSibling.props.bg==='black' && options.element.props.bg==='yellow') {
//            options.previousSibling.props.bg = 'red'
//            options.element.props.bg='blue'
//          }
//        }
//       }
//     }
//    ]

//    dispatch(state: State){

//    }
// }
// type DefaultValues = {[k in PropsCascadeRuleNames]?: boolean}
// type DynamicRule = {dispatch: (dro: DynamicRuleOptions)=>void}
// interface DynamicRuleOptions<E extends ProgramElement = ProgramElement> {
//   element: E
//   child?: E
//   previousSibling?:E
// }

// // an example of a custom ruler

// class FixLowContrastColors<O extends BaseOptions = PropsCascadeOptions> extends  AbstractFlorStateRuler<FlorStateMoments.propertyChange, O>   {
//   moment: Moment<FlorStateMoments.propertyChange> = {
//     name: FlorStateMoments.propertyChange,
//     when: 'after',
//     whenPredicate(el, p){
//       return p==='bg'||p==='fg'

//     }
//   }
//   // dispatch()
//   dispatch(state:State, el: ProgramElement, p: string){
//     this.ensureContrast({el, bg: el.props.bg, fg: el.props.fg, state})
//   }
//   ensureContrast(arg0: { el: ProgramElement; bg: string | undefined; fg: string | undefined; state: State; }): any {
//     throw new Error('Method not implemented.');
//   }
// }

// //   // dispatch(state, args){
// //   //   //   ensureContrast({el, bg: el.props.bg, fg: el.props.fg})

// //   //   // if(state.e){
// //   //   //   if(state.previousSibling.props.bg==='yellow' && state.element.props.bg==='black'||state.previousSibling.props.bg==='black' && state.element.props.bg==='yellow') {
// //   //   //     state.previousSibling.props.bg = 'red'
// //   //   //     state.element.props.bg='blue'
// //   //   //   }
// //   // }

// //   // moments: Moment[]= [
// // // ]
// //   // rules: PropsCascadeRules = {
// //   //  [PropsCascadeRuleNames.propagateToChildren]: {
// //   //    // false
// //   //    bg: true, fg: true, bold: true, underline: true, invisible: true, ch: true, margin: true, padding: true,

// //   //    // false
// //   //    border: false, top: false, left: false, width: false,height: false,
// //   //  },
// //   //  [PropsCascadeRuleNames.propagateToNextSiblings]: {

// //   //  }
// //   // }
// //   // /**
// //   //  * If the property is not defined in [[rules]] then these values will be set if any. If not defined even here, then the value is maintained (inherits)
// //   //  */
// //   // defaultValues: DefaultValues = {
// //   //  [PropsCascadeRuleNames.propagateToChildren]: undefined, [PropsCascadeRuleNames.propagateToNextSiblings]: false,
// //   // }
// //   // dynamicRules: DynamicRule[] = [
// //   //   {
// //   //     dispatch: // example of a custom dynamic rule. Notice that this could eb archived with a custom element or component, but in this case it will be installed globally without needing to declare any element whatsoever.
// //   //    options=>{
// //   //      // the combination of colors yellow-black cannot be present on sibling nodes because if of Peñarol Futbol Club, or rival team, if we found it, we re-paint it with the colors of our team, Nacional Futbol Club, red and blue.
// //   //     if(options.previousSibling){
// //   //       if(options.previousSibling.props.bg==='yellow' && options.element.props.bg==='black'||options.previousSibling.props.bg==='black' && options.element.props.bg==='yellow') {
// //   //         options.previousSibling.props.bg = 'red'
// //   //         options.element.props.bg='blue'
// //   //       }
// //   //     }
// //   //    }
// //   //  }
// //   // ]

// // }
