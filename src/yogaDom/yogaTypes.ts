import { ProgramDocument, ProgramElement } from '../programDom'
import { ElementPropsImpl } from '../programDom/elementProps'
import { YogaElementProps } from './types'
import { YogaDocument } from './yogaDocument'
import { YogaElement } from './yogaElement'
import { YogaElementPropsImpl } from './yogaProps'

declare global {
  export namespace JSX {
    export interface IntrinsicElements {
      yoga: OptionsProps<YogaElementProps>
    }
  }
}

export interface CommonElementImpl extends YogaElement, ProgramElement {
  props: CommonElementProps
  ownerDocument: CommonDocumentImpl
}

export interface CommonDocumentImpl extends YogaDocument, ProgramDocument, YogaDocument {
  createElement(s: string): CommonElementImpl
  body: CommonElementImpl
}

export interface CommonElementProps extends YogaElementPropsImpl, ElementPropsImpl {
}
