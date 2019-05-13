import { ProgramElement } from '../programDom/programElement'

export interface ExtraProps {
  children?: JSX.FlorJsxNode
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
  elementCreated() {}

  /**
   * Called from `Flor.render` when [[element]] is ready, this is, with its attributes and children
   * initialized and rendered as [[ProgramElement]]s.
   *
   * @internal
   */
  elementReady() {
    this.element && this.element._childrenReady()
  }

  element: ProgramElement | undefined

  // /**
  //  * Shortcut for [[element]] with no undefined type. Use with care, make sure [[elementCreated]] was already called
  //  */
  // get el(): ProgramElement {
  //   return this.el!
  // }

  abstract render(): JSX.FlorJsxNode

  protected get program() {
    return this.element && this.element.ownerDocument.program
  }

  protected get renderer() {
    return this.element && this.element.ownerDocument.renderer
  }

  protected renderElement(e: ProgramElement | undefined = this.element) {
    if (e && this.renderer) {
    //   const p = this.renderer!.writeArea
    // this.renderer!.writeArea = this.element!.getBounds()
    // this.renderer!.renderElement(c)
    // this.renderer!.writeArea = p
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
