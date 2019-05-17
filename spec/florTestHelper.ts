import { notFalsy } from 'misc-utils-of-mine-typescript'
import { FlorDocument } from '../src'
import { YogaElement } from '../src/programDom/yogaElement'
import { waitForPredicate } from 'misc-utils-of-mine-generic';
interface Options {trimAndRemoveEmptyLines?: boolean}
const defaultOptions =  { trimAndRemoveEmptyLines: false }
class FlorTest {
  constructor(protected flor: FlorDocument) {
  }
  toContain(s: string, o: Options =defaultOptions) {
   const b = this._textExtractor(o)
    expect(b).toContain(s)
  }
  private _textExtractor(o: Options) {
    let b = this.flor.printBuffer()
    if (o.trimAndRemoveEmptyLines) {
      b = '\n' + b.split('\n').map(l => l.trim()).filter(notFalsy).join('\n') + '\n'
    }
    return b
  }
  notToContain(s: string,  o: Options =defaultOptions) {
    const b = this._textExtractor(o)
    expect(b).not.toContain(s)
  }
  async willContain(s: string, o: Options =defaultOptions) {
    await waitForPredicate(()=>this._textExtractor(o).includes(s))
  }
  async wontContain(s: string, o: Options =defaultOptions) {
    await waitForPredicate(()=>!this._textExtractor(o).includes(s))
  }
}

export class FlorDocumentTesting extends FlorDocument<YogaElement> {
  expect = new FlorTest(this)
}
