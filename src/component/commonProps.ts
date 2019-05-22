import { RemoveProperties } from 'misc-utils-of-mine-generic'
import { BorderStyle } from '../util'
import { YogaElementProps } from '../yogaDom'

export const baseProps: () => RemoveProperties<Partial<YogaElementProps>, 'children'> = () => ({
  bg: '#1e1e1e',
  fg: 'lightgray',
  width: .4,
  height: 3,
  left: 0,
  top: 0,
  bold: false
})

export const containerProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps(),
  bg: 'gray'
})

export const focusableProps: () => Partial<YogaElementProps> = () => ({
  ...baseProps(),
  border: { ...baseProps(), type: BorderStyle.round, fg: 'blue' },
  focusable: true,
  focus: {
    border: { fg: 'red' },
    bold: true,
    fg: 'white',
    bg: 'gray'
  }
})
