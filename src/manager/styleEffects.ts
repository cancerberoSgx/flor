import { YogaElement } from '../yogaDom';
import { ProgramElement } from '../programDom';

export class StyleEffectsManager<T extends YogaElement = YogaElement> {
  constructor(protected options: Options){

  }
}
interface Options<T extends ProgramElement = YogaElement> {
  getElementFocusStyle?(el:T ): Partial <YogaElement>
}