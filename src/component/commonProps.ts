import { BorderStyle } from '../util'
import { YogaElementProps } from '../yogaDom'

export const baseProps: Partial<YogaElementProps> = {
  bg: '#1e1e1e',
  fg: 'lightgray'
}

export const focusableProps: Partial<YogaElementProps> = {
  bg: 'lightgray',
  fg: 'yellow',
  border: { type: BorderStyle.round },
  bold: true
}
