import { RemoveProperties } from 'misc-utils-of-mine-generic'
import { BorderStyle } from '../util'
import { YogaElementProps } from '../yogaDom/types'

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
  border: { ...baseProps(), type: BorderStyle.round, fg: 'blue',  bg: '#1e1e1e', },
  focusable: true,
  focus: {
    border: { ...baseProps(), type: BorderStyle.double, fg: 'red',  bg: '#1e1e1e', },
    bold: true,
    fg: '#ffeeaa', 
    bg: '#1e1e1e',
    // bg: '#ffeeaa'
  }
})
