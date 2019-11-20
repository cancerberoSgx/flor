import { ProgramDocument } from '../programDom/programDocument';
import { YogaElement } from './yogaElement';

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

  createElement(tagName: string): YogaElement {
    const el = new YogaElement(tagName, this)
    this._allNodes = this._allNodes || []
    this._allNodes[el.internalId] = el
    return el
  }
  destroy() {
    this.body.destroy()
    // debug('after', this._allNodes.filter(notUndefined).length, yoga.getInstanceCount())
  }
  _unregister(e: YogaElement) {
    this._allNodes[e.internalId] = undefined
    // debug('_unregister', this._allNodes.filter(notUndefined).length, yoga.getInstanceCount())
  }

}
