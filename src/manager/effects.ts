import { FocusEvent, ProgramDocument, ElementProps, StyleProps, ProgramElement } from '../programDom'
import { YogaElement } from '../yogaDom'
import { FocusManager } from './focusManager'
import { debug } from '../util';

interface State {
  // notFocusedUndefinedStyle?:string[]
  dirty: boolean
  notFocusedStyle?: Partial<StyleProps>
}

interface Options<T extends ProgramElement = ProgramElement> {
  focusManager: FocusManager<T>
  document: ProgramDocument
  // getFocusedExtraStyle?(el: T): Partial<T>
}


export class StyleEffectsManager<T extends ProgramElement = ProgramElement> {

  private _state: State[] = []
  protected previous: T | undefined

  constructor(protected options: Options<T>) {
    this.onFocus = this.onFocus.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.options.focusManager.addFocusListener({ listener: this.onFocus })
  }


  onFocus(e: FocusEvent<T>) {
    const previous = e.previous || this.previous
    const focused = e.currentTarget
    if (focused === previous) {
      return
    }
    this.setNotFocusedStyle(previous)
    this.setFocusedStyle(focused)
    this.previous = focused
  }

  protected get(e?: T): State | undefined {
    if (!e || !e.props.focus) {
      return
    }
    let s = this._state[e.internalId]
    if (!s) {
      s = {
        dirty: !!e.props.focus
      }
      this._state[e.internalId] = s
    }
    return s
  }

  protected setFocusedStyle(focused?: T) {
    const s = this.get(focused)
    if (!focused || !s || !s.dirty || !focused.props.focus|| !focused.props.focus.data) {
      return
    }
    const focusStyle = focused.props.focus.data
    //TODO: if default style changes after this moment, we will loose the changes. Perhaps we need to remove the if()
    if(!s.notFocusedStyle){
      const focusedKeys =  Object.keys(focusStyle)
      s.notFocusedStyle = {}  
      //  s.notFocusedUndefinedStyle = []
      focusedKeys.forEach(k=>{
        // if(typeof focused.props.data[k]==='undefined'){
        //   (s.notFocusedUndefinedStyle as any).push(k)
        // }
        // else {
          (s.notFocusedStyle as any)[k]  = focused.props.data[k]
        // }
      })
    }
    focused.props.assign(focusStyle)
    focused.render()
  }

  protected setNotFocusedStyle(previous: T | undefined) {
    const s = this.get(previous)
    if (!previous||!s||!s.dirty||!s.notFocusedStyle) {
      return
    }
    // debug('setNotFocusedStyle', s)
    previous.props.assign(s.notFocusedStyle);
    // (s.notFocusedUndefinedStyle||[]).forEach(s=>{
    //   (previous.props as any)[s] = undefined
    // })
    // previous.props.bg = undefined
    previous.render()

  }
  // onBlur(e: BlurEvent) {
  //   throw new Error('Method not implemented.');
  // }
  
}