import { RemoveProperties } from 'misc-utils-of-mine-generic';
import { InputEventTarget } from '../programDom';
import { BorderStyle } from '../util';
import { YogaElementProps } from '../yogaDom/types';

export const inputEventTargetDefaultProps: () => Required<InputEventTarget> = () => ({
  onInput(e) { },
  onChange(e) { },
  focusOnClick: true,
  changeOnBlur: true,
  value: '',
  input: '',
  changeKeys: e => e.name === 'enter',
  activeProps: {}
})

export const baseProps: () => RemoveProperties<Partial<YogaElementProps>, 'children'> = () => ({
  bg: '#1e1e1e',
  fg: 'green',
  bold: false
})

export const containerProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps()
  // top: 0, left: 0, width: .99, height: .99
  // bg: 'gray'
})

export const focusableProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps(),
  border: { ...baseProps(), type: BorderStyle.round, fg: 'blue', bg: '#1e1e1e' },
  focusable: true,
  focus: {
    border: { ...baseProps(), type: BorderStyle.double, fg: 'red', bg: '#1e1e1e' },
    bold: true
    // fg: '#ffeeaa',
    // bg: '#1e1e1e',
    // bg: '#ffeeaa'
  }
})
