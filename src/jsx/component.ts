import { ProgramElement } from '../programDom/programElement'
import { RefObject } from './types'

export interface ExtraProps {
  children?: JSX.FlorJsxNode
  ref?: RefObject
}

/**
 * Simple abstract Component class (like React.Component) but without life cycle methods.
 *
 * Has a dummy state property that subclasses could implement some behavior for, right now it does nothing.
 */
export abstract class Component<UP = {}, S = {}, P = UP & ExtraProps> {

  constructor(protected props: P, protected state: S) {

  }

  /**
   * Called from `Flor.render` when [[element]] was just created. Take into account that its attributes and
   * children are not yet initialized. For that use [[elementReady]].
   *
   * @internal
   */
  _elementCreated() {
   
  }

  /**
   * Called from `Flor.render` when [[element]] is ready, this is, with its attributes and children
   * initialized and rendered as [[ProgramElement]]s.
   *
   * @internal
   */
  _elementReady() {   
    // this.element!.ownerDocument._onManagersReady(()=>this._managersReady())
  }
  // /**
  //  * Called when managers (like renderer, focus, events, etc) are ready in element's ownerDocument.
  //  *
  //  * @internal
  //  */
  //  _managersReady(){
  
  // }

  element: ProgramElement | undefined

  abstract render(): JSX.FlorJsxNode

  protected get program() {
    return this.element && this.element.ownerDocument.program
  }

  protected get cursor() {
    return this.element && this.element.ownerDocument.cursor
  }

  protected get focus() {
    return this.element && this.element.ownerDocument.focus
  }
  protected get renderer() {
    return this.element && this.element.ownerDocument.renderer
  }

  protected get events() {
    return this.element && this.element.ownerDocument.events
  }

  protected renderElement(e: ProgramElement | undefined = this.element) {
    if (e && this.renderer) {
      this.renderer.renderElement(e)
    }
  }
}

export function isComponent(c: any): c is Component {
  return (
    c &&
    !!c.render && !!c.elementCreated
  )
}
