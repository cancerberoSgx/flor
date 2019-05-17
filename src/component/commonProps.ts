import { isElementProps, ElementProps } from '../programDom';
import { ProgramDocumentRenderer } from '../manager';
import { YogaElementProps } from '../yogaDom';
import { BorderStyle } from '../util';

export const baseProps: Partial<YogaElementProps> = {
  bg: '#1e1e1e',
  fg: 'lightgray',
}

export const focusableProps: Partial<YogaElementProps> = {
  bg: 'lightgray',
  fg: 'yellow',
  border: {type: BorderStyle.round},
  bold: true
}
