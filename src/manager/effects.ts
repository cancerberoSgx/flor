import { FocusEvent, ProgramElement, StyleProps, StylePropsImpl, ElementProps, ElementPropsImpl } from '../programDom'
import { FocusManager } from './focusManager'
import { objectKeys, clone, objectFilter } from 'misc-utils-of-mine-generic';
import { debug } from '../util';

interface State {
  dirty: boolean
  normalProps?: Partial<StyleProps>
  focusProps?: Partial<StyleProps>
}

interface Options<T extends ProgramElement = ProgramElement> {
  focusManager: FocusManager<T>
  focusedExtraStyles?: Partial<StyleProps>
  normalExtraStyles?: Partial<StyleProps>
}

export class StyleEffectsManager<T extends ProgramElement = ProgramElement> {

  private _state: State[] = []
  // protected previous: T | undefined

  constructor(protected options: Options<T>) {
    this.onFocus = this.onFocus.bind(this)
    this.options.focusManager.addFocusListener({ listener: this.onFocus })
  }

  onFocus(e: FocusEvent<T>) {
    const previous = e.previous// || this.previous
    const focused = e.currentTarget
    // if (focused === previous) {
    //   return
    // }
    this.setNotFocusedStyle(previous)
    this.setFocusedStyle(focused)
    // this.previous = focused
  }
  
  static getFocusValidProps(props: StylePropsImpl){
    return {...props.attrs, ...objectFilter(props.data, k=>typeof k === 'string'&&['padding', 'border', 'layout'].includes(k))}
  }
  protected get(e?: T): State | undefined {
    if (!e || !e.props.focus) {
      return
    }
    let s = this._state[e.internalId]
    if (!s) {
      const focusProps:Partial<StyleProps> = {
        ...this.options.focusedExtraStyles,
        ...StyleEffectsManager.getFocusValidProps(e.props),
        ...StyleEffectsManager.getFocusValidProps((e.props.focus as StylePropsImpl))
        // ...e.props. data.attrs,
        // ... objectFilter(e.props.focus.data||{}, (k,v)=>typeof v!=='function'  ),
        // ...objectFilter(e.props.focus.data||{}, (k,v)=>k==='fg')
        // ...(e.props.focus as StylePropsImpl).attrs
        // ...e.props.focus.data
      }
      const normalProps = { 
        ...this.options.normalExtraStyles, 
        // ...(e.props.focus as StylePropsImpl).attrs,
        // ...objectFilter(e.props.data||{}, (k,v)=>k==='fg')
        // ...e.props.data
        
        ...StyleEffectsManager.getFocusValidProps(e.props)
        // ... objectFilter(e.props.data||{}, (k,v)=>typeof v!=='function')
      }
      // objectKeys(focusStyle).forEach(k => {
        //   notFocusedStyle[k] = focused.resolvePropValue(k )
        // })
        s = {
          dirty: !!e.props.focus,
          focusProps ,
          normalProps
        }
        // debug(e.internalId)
        this._state[e.internalId] = s
      }
      // debug(e.internalId, s)
    return s
  }

  protected setFocusedStyle(el?: T) {
    const s = this.get(el)
    if (!el || !s  ) {
      return
    }
   
    // TODO: if default style changes after this moment, we will loose the changes. Perhaps we need to remove the if()
    // el.props.assign(s.focusProps||{})
    
    // focused.props.data = clone(s.focusProps)
    el.props.assign(clone(s.focusProps))
    el.ownerDocument.body.render()
    // this.
    // el.render({preventSiblingCascade: true })//{preventSiblingCascade: true, preventChildrenCascade: true})
  }

  protected setNotFocusedStyle(el: T | undefined) {
    const s = this.get(el)
    if ( !s ||!el ) {
      return
    }
    // console.log(s.notFocusedStyle);
    
    // previous.props.assign(clone(s.normalProps))
    // el.props.assign(s.normalProps||{})
    el.props.assign(clone(s.normalProps||{}))
    el.ownerDocument.body.render()
    // el.ownerDocument.renderer!.renderElement(el.ownerDocument.body);//.render({preventSiblingCascade: true })
  }

  setNormalExtraStyles(styles: Partial<StyleProps>) {
    this.options.normalExtraStyles = { ...this.options.normalExtraStyles || {}, ...styles }
  }

  setFocusedExtraStyles(styles: Partial<StyleProps>) {
    this.options.focusedExtraStyles = { ...this.options.focusedExtraStyles || {}, ...styles }
  }
}
