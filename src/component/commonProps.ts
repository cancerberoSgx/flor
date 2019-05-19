import { BorderStyle } from '../util'
import { YogaElementProps } from '../yogaDom'

export const baseProps: () => Partial<YogaElementProps> = () => ({
  bg: '#1e1e1e',
  fg: 'lightgray'
})

export const containerProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps(),
  bg: 'gray',
  border: { ...baseProps(), type: BorderStyle.round },
})

export const focusableProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps(),
  border: { ...baseProps(), type: BorderStyle.round },
  focusable: true,
  focus: {
    border: {type: BorderStyle.heavier, fg: 'red', bold: true},
    bold: true,
    fg: 'black',
    bg: 'lightgray'
  }
})
