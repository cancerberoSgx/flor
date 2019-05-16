import { notFalsy } from 'misc-utils-of-mine-typescript'
import { FlorDocument, ProgramElement } from '../src'
import { YogaElement } from '../src/programDom/yogaElement';

class FlorTest {
  constructor(protected flor: FlorDocument) {
  }
  toContain(s: string, o: {trimAndRemoveEmptyLines?: boolean} = { trimAndRemoveEmptyLines: false }) {
    let b = this.flor.printBuffer()
    if (o.trimAndRemoveEmptyLines) {
      b = '\n' + b.split('\n').map(l => l.trim()).filter(notFalsy).join('\n') + '\n'
    }
    expect(b).toContain(s)
  }

  notToContain(s: string) {
    expect(this.flor.printBuffer()).not.toContain(s)
  }
}

export class FlorDocumentTesting extends FlorDocument<YogaElement> {
  expect = new FlorTest(this)
}
