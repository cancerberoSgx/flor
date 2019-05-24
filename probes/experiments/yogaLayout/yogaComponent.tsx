// import { Animation,  Component,  easing , Flor,  KeyPredicate, MouseEvent, ProgramDocumentRenderer, isElement, ProgramDocument, ProgramElement, Rectangle, rectangleIntersects, rectanglePlusOffsets, ElementProps} from '../../../src'

// interface ScrollEvent {

// }

// export interface ScrollHandlerProps {

// }
// interface ConcreteYogaNodeProps extends ScrollHandlerProps {
// }

// export interface YogaNodeProps extends ConcreteYogaNodeProps, Partial<ElementProps> {

// }

// export const defaultScrollHandleProps: () => Required<ScrollHandlerProps> = () => ({
// })

// export const defaultYogaNodeProps: () => Required<ConcreteYogaNodeProps> = () => ({
// })

// /**
//  */
// export class YogaNode extends Component<YogaNodeProps, {}> {
//   protected p: Required<ConcreteYogaNodeProps>

//   constructor(p: YogaNodeProps, s: {}) {
//     super(p, s)
//     this.p = { ...defaultYogaNodeProps(), ...p }
//   }

//   render(){
//     return <box></box>
//   }

// }

// /**
//  * Create a new [[YogaNode]].
//  */
// export function cogaNode(props: YogaNodeProps & { document: ProgramDocument }) {
//   return Flor.render(<YogaNode {...props} />, { document: props.document })
// }
