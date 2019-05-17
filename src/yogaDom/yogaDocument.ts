import { notUndefined } from 'misc-utils-of-mine-typescript'
import * as yoga from 'yoga-layout'
import { ProgramDocument } from '../programDom/programDocument'
import { debug } from '../util'
import { YogaElement } from './yogaElement'

export class YogaDocument extends ProgramDocument<YogaElement> {
  body: YogaElement
  constructor() {
    super()
    this.empty()
    /**
     * array which indexes are element's internal ids. Could have holes!
     */
    this._allNodes = []
    this.body = this.createElement('body')
    this.appendChild(this.body)
    this._allNodes.push(this.body)
  }
  private _allNodes: (undefined | YogaElement)[]
  // constructor() {
  //   super()
  //   // if(this.body){
  //     this.empty()
  //   // }
  //   this.body = new YogaElement('body', this)
  //   this.appendChild(this.body)
  //   this._allNodes = this._allNodes ||[]
  //     this._allNodes.push(this.body)
  // }
  // // protected _body: YogaElement= null as any
  // // get body() {
  // //   if (!this._body) {
  // //     this._body = this.createElement('body')
  // //     this.appendChild(this._body)
  // //   }
  // //   return this._body
  // // }
  createElement(tagName: string): YogaElement {
    const el = new YogaElement(tagName, this)
    // const el= new YogaElement(tagName, this)
    // // this._allNodes = this._allNodes|| [] // I need to do this - seems to be a bug in typescrpt or js classes - says this._allNodes.push is undefined no matter if i initialize it everywhere... is called from subclass constructor this.ndy = this.createElement...
    // // if(this._allNodes.find(n=>n!==el){
    this._allNodes = this._allNodes || []
    this._allNodes[el.internalId] = el
    // // })
    return el
  }
  destroy() {
    // super.destroy()
    // debug('before', this._allNodes.length, yoga.getInstanceCount())
    this.body.destroy()
    // this.body.__getYogaNode()!&&this.body.__getYogaNode()!.freeRecursive()
    // if(yoga.getInstanceCount()!==0){
    // this._allNodes
    // .filter(n=>!findAncestor(n, a=>a===this.body))
    // .forEach(e=>{
    //   // e.destroy()
    //   e.__getYogaNode()&&e.__getYogaNode()!.free()
    // })
    debug('after', this._allNodes.filter(notUndefined).length, yoga.getInstanceCount())
    // }
    // this._allNodes=[]
    // nextTick(()=>    debug('after', this._allNodes.length, yoga.getInstanceCount()))
    // setTimeout(() => {
    // debug('super after', this._allNodes.length, yoga.getInstanceCount())
    // }, 600);
    // equal(yoga.getInstanceCount(), 0)
  }
  _unregister(e: YogaElement) {
    this._allNodes[e.internalId] = undefined// = this._allNodes.filter(n => n !== e)
    // const i = this._allNodes.findIndex(n=>n===e)
    // notEqual(i, -1)
    //  this._allNodes.splice(i,1)
    debug('_unregister', this._allNodes.filter(notUndefined).length, yoga.getInstanceCount())
  }

  // static is(d: any): d is YogaDocument {
  //   return !!(d && d.body && (d as YogaDocument).createElement && (d as YogaDocument).create && (d as YogaDocument)._unregister && d instanceof YogaDocument)
  // }
}
