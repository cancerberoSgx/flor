import { ElementProps, ProgramDocument, ProgramElement } from '..'
import { YogaElementProps } from "../yogaDom/types";
import { Component } from './component'
import { YogaElement, YogaDocument, YogaElementPropsImpl } from '../yogaDom';
import { ElementPropsImpl } from '../programDom';

declare global {

  export namespace JSX {
    export interface IntrinsicElements {
      el: OptionsProps<ElementProps>
      box: OptionsProps<YogaElementProps>
    }

    /**
     * Adds extra props to Blessed options, like refs. TODO: we could add children here too ? and perhaps
     * unify the rest in one place (onClick, etc)
     */
    type OptionsProps<T> = PropsWithRef<Partial<T>>

    type PropsWithRef<P> = P & {
      children?: FlorJsxNode ,
      ref?: P extends { ref?: infer R } ? R : RefObject<ProgramElement>
    }

    export interface Element<P extends { children?: FlorJsxNode } = {}> {
      type: ElementType
      props: P
      children?: FlorJsxNode
    }

    export type ElementType<P extends { children?: FlorJsxNode } = {}> =
      | undefined
      | string
      | Component<PropsWithRef<P>, {}>
      | FunctionComponent<PropsWithRef<P>>

    export interface FunctionComponent<P extends { children?: FlorJsxNode } = {}> {
      (props: P & { children?: FlorJsxNode }, context?: any): Element<any> | null
    }

    type BlessedJsxText = string | number

    type BlessedJsxChild<P extends { children?: FlorJsxNode } = {}>  = Element<P>  | BlessedJsxText

    export interface ReactNodeArray extends Array<FlorJsxNode> {}

    export type BlessedJsxFragment = {} | ReactNodeArray

    export type FlorJsxNode<P extends { children?: FlorJsxNode } = {}>  =
      | BlessedJsxChild<P>
      | BlessedJsxFragment
      | boolean
      | null
  }
}

/**
 * Type of the `React` object as in `React.createElement`.
 *
 * Note: it could have another name than React, but if so tsconfig needs to be configured (JSXFactory) so for
 * simplicity we name the instance `React`
 */
export interface FlorJsx<E extends ProgramElement = ProgramElement> {
  /**
   * JSX.Element to blessed node factory method. i.e. `<box>foo</box>` will be translated to
   * `React.createElement('box', {}, ['foo'])`.
   *
   * This method should never be called directly by users, although is called internally when users call
   * [[React.createEkenebt]]
   */
  createElement(tag: JSX.ElementType, attrs: BlessedJsxAttrs, ...children: any[]): JSX.FlorJsxNode

  /**
   * Creates a blessed.element from given JSX expression. Will append it to given parent in options or in none to current document's body.
   */
  render<E extends ProgramElement = ProgramElement>(e: JSX.Element, options?: RenderOptions): E

  /**
   * In order to create Elements, this JSX factory needs a Document instance (on which to call document.createElement).
   */
  setDocument<E extends ProgramElement = ProgramElement>(doc: ProgramDocument<E>): void

  /**
   * Creates reference object that will be associated with a [[ProgramElement]] or with a [[Component]] instance at render-time.
   * Similar to https://reactjs.org/docs/refs-and-the-dom.html.
   */
  createRef<T extends E | Component = E>(callback?: (current: T | undefined) => void): RefObject<T>

}

interface RenderOptions {
  document: ProgramDocument
}

/** @internal */
export type BlessedJsxAttrs = { [a: string]: any } | undefined

export interface RefObject<T = any> {
  /*
   * When the RefObject is resolved and [[current]] attribute is set, this callback is called if provided.
   */
  callback?(current: T | undefined): any
  current: T | undefined
}


export interface CommonElementImpl extends YogaElement, ProgramElement {
props: CommonElementProps
ownerDocument: CommonDocumentImpl
}
export interface CommonDocumentImpl extends YogaDocument, ProgramDocument, YogaDocument {
createElement(s:string): CommonElementImpl
body:CommonElementImpl
}


export interface CommonElementProps extends YogaElementPropsImpl, ElementPropsImpl{

}