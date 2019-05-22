import { RemoveProperties } from 'misc-utils-of-mine-generic'
import { BorderStyle } from '../util'
import { YogaElementProps } from '../yogaDom'

export const baseProps: () => RemoveProperties<Partial<YogaElementProps>, 'children'> = () => ({
  bg: '#1e1e1e',
  fg: 'green',
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
    border: { ...baseProps(), type: BorderStyle.double, fg: 'red' },
    bold: true,
    fg: '#112277',
    bg: '#ffeeaa'
  }
})
