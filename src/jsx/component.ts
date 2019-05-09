import { ProgramElement } from '..'

export interface ExtraProps {
  children?: JSX.FlorJsxNode
}

/**
 * Simple abstract Component class (like React.Component) but without life cycle methods.
 *
 * Has a dummy state property that subclasses could implement some behavior for, right now it does nothing.
 */
export abstract class Component<UP = {}, S = {}, P = UP & ExtraProps> {

  constructor(protected props: P, protected state: S) {}

  /**
   * Called from `Flor.render` when [[element]] was just created. Take into account that its attributes and
   * children are not yet initialized. For that use [[elementReady]].
   *
   * @internal
   */
  elementCreated() {}

  /**
   * Called from `Flor.render` when [[element]] was is ready, this is with its attributes and children
   * initialized and rendered. Take into account that perhaps the element is not yet attached to any document.
   *
   * @internal
   */
  elementReady() {
    this.element && this.element._childrenReady()
  }

  element: ProgramElement | undefined

  abstract render(): JSX.FlorJsxNode


  protected get program() {
    return this.element && this.element.ownerDocument.program
  }

}

export function isComponent(c: any): c is Component {
  return (
    c &&
    !!c.render && !!c.elementCreated
  )
}
