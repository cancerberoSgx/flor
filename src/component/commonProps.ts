import { BorderStyle } from '../util'
import { YogaElementProps } from '../yogaDom'

export const baseProps: () => Partial<YogaElementProps> = () => ({
  bg: '#1e1e1e',
  fg: 'lightgray',
  width: .4,
  height: 3,
  bold: false
})

export const containerProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps(),
  bg: 'gray'
})

export const focusableProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps(),
  border: { ...baseProps(), type: BorderStyle.round , fg: 'blue' },
  focusable: true,
  focus: {
    border: { fg: 'red' },
    bold: true,
    fg: 'white',
    bg: 'gray'
  }
})
