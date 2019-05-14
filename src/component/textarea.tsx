// import { keys } from '../declarations/keys'
// import { Component, Flor } from '../jsx'
// import { KeyEvent, KeyPredicate } from '../manager'
// import { ElementProps, ProgramDocument, ProgramElement } from '../programDom'
// import { ConcreteInputProps } from './input';

// interface TextAreaProps extends Partial<ElementProps>, ConcreteTextAreaProps {

// }
// interface ConcreteTextAreaProps extends ConcreteInputProps{
  
// }

// /**
//  * Extends Input to support multiline editor
//  */
// export class Input extends Component<InputProps, {}> {

//   protected defaultProps: Required<ConcreteInputProps> = {
//     onInput(e) { },
//     onChange(e) { },
//     changeKeys: e => !e.ctrl && e.name === 'enter',
//     changeOnBlur: true,
//     blurOnChange: true,
//     value: '',
//     enableInputKeys: e => !e.ctrl && e.name === 'enter',
//     disableInputKeys: e => !e.ctrl && e.name === 'escape'
//   }

//   protected p: Required<ConcreteInputProps>

//   constructor(p: InputProps, s: {}) {
//     super(p, s)
//     this.p = { ...this.defaultProps, ...this.props }
//     this.onKeyPressed = this.onKeyPressed.bind(this)
//   }

//   get value() {
//     return this.props.value || ''
//   }
//   /**
//    * Setting this property will cause the element to loose focus
//    */
//   set value(i: string) {
//     if (i !== this.props.value) {
//       this.props.value = i
//       this.handleChangeValue()
//     }
//   }

//   get input() {
//     return this.element && this.element.props.input || ''
//   }
//   /**
//    * Setting this property will change the input text in the screen and call  `this.props.onInput` if any.
//    */
//   set input(s: string) {
//     if (this.element) {
//       this.element.props.input = s
//       this.element.childNodes.item(0)!.textContent = this.element.props.input || ''
//       this.props.onInput && this.props.onInput({ currentTarget: this.element, input: (this.element.props.input || '') })
//       this.renderElement()
//     }
//   }

//   private handleChangeValue() {
//     if (this.element) {
//       this.element.props.value = this.element.props.input || ''
//       this.props.onChange && this.props.onChange({ currentTarget: this.element, value: (this.element.props.input || '') })
//       this.disableInput()
//     }
//   }

//   protected onKeyPressed(e: KeyEvent) {
//     if (!this.element || !this.element.props.focused) {
//       return
//     }
//     if (this.p.changeKeys(e)) {
//       this.handleChangeValue()
//     } else if (e.name === keys.backspace) {
//       this.input = this.input.substring(0, this.input.length - 1)
//     } else if (e.name === keys.left) {
//       this.cursor && this.cursor.left(1)
//     } else if (e.name === keys.right) {
//       this.cursor && this.cursor.right(1)
//     } else if (e.ch || e.sequence) {
//       this.input = this.input + (e.ch || e.sequence)
//     }
//     if (this.props.onKeyPressed) {
//       this.props.onKeyPressed(e)
//     }
//   }

//   render() {
//     return <box focusable={true} {...{ ...this.props, onChange: undefined, onInput: undefined, value: undefined }}
//       onFocus={e => {
//         this.inputEnable()
//         if (this.props.onFocus) {
//           this.props.onFocus(e)
//         }
//       }}
//       onBlur={e => {
//         if (this.props.changeOnBlur) {
//           this.handleChangeValue()
//         }
//         if (this.props.onBlur) {
//           this.props.onBlur(e)
//         }
//       }}
//       onKeyPressed={this.onKeyPressed}
//     >
//       {this.props.value || this.input || ''}
//     </box>
//   }

//   /**
//    * Makes the element to show the cursor and let the user input text. The element must be focused.
//    */
//   inputEnable() {
//     this.element && this.element.props.focused && this.cursor && this.cursor.show({
//       name: 'Input',
//       top: this.element.absoluteContentTop,
//       left: this.element.absoluteContentLeft + (this.element.props.input || '').length
//     })
//   }

//   /**
//    * Will hide the cursor forbidding the user to keep writing input text. If this.props.blurOnChange (true by default) then it will also remove focus from the element.
//    */
//   disableInput() {
//     this.element && this.props.blurOnChange && this.element.props.focused && this.element.blur()
//     this.cursor && this.cursor.hide({ name: 'Input' })
//     this.renderElement()
//   }

// }

// export function input(props: InputProps & { document: ProgramDocument }) {
//   return Flor.render(<Input {...props} />, { document: props.document })
// }
