import { ProgramElement } from '../programDom/programElement'
import { Deferred } from '../util/misc'
import { ComponentProps } from './types'
import { unique } from 'misc-utils-of-mine-generic';

/**
 * Simple abstract Component class (like React.Component) but without life cycle methods.
 *
 * Has a dummy state property that subclasses could implement some behavior for, right now it does nothing.
 */
export abstract class Component<P = {}, S = {}> {
  readonly internalId: string;

  constructor(protected props: P & ComponentProps, protected state: S) {
    this.elementReady = new Deferred<ProgramElement>()
    this.internalId = unique('component_')
  }

  protected elementReady: Deferred<ProgramElement>

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
    this.elementReady.resolve(this.element!)
  }

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

  renderElement(e: ProgramElement | undefined = this.element) {
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
