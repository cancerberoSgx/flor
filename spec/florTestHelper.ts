import { waitForPredicate } from 'misc-utils-of-mine-generic'
import { notFalsy } from 'misc-utils-of-mine-typescript'
import { borderStyles, FlorDocument, ProgramElement } from '../src'
import { YogaElement } from '../src/yogaDom/yogaElement'
import { color, int, item } from './data'

interface Options { trimAndRemoveEmptyLines?: boolean }

const defaultOptions = { trimAndRemoveEmptyLines: false }

class FlorTest<E extends ProgramElement = ProgramElement> {
  constructor(protected flor: FlorDocument<E>) {
  }
  toContain(s: string, o: Options = defaultOptions) {
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
  notToContain(s: string, o: Options = defaultOptions) {
    const b = this._textExtractor(o)
    expect(b).not.toContain(s)
  }
  async willContain(s: string, o: Options = defaultOptions) {
    await waitForPredicate(() => this._textExtractor(o).includes(s))
  }
  async wontContain(s: string, o: Options = defaultOptions) {
    await waitForPredicate(() => !this._textExtractor(o).includes(s))
  }

  randomBounds() {
    return {
      top: int(5, this.flor.program.rows / 4), left: int(5, this.flor.program.cols / 4), width: int(5, this.flor.program.cols / 4),  height: int(5, this.flor.program.rows / 4), border: { border: item(borderStyles) }, bg: color(), fg: color()
    }
  }

}

export class FlorDocumentTesting<E extends ProgramElement = ProgramElement> extends FlorDocument<E> {
  test = new FlorTest(this)
}
