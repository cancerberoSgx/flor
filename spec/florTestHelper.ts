import { FlorDocument } from '../src';

class FlorTest {
  constructor(protected flor: FlorDocument){   
  } 
  toContain(s: string){
    expect(this.flor.printBuffer(true)).toContain(s)
  }
  notToContain(s: string){
    expect(this.flor.printBuffer(true)).not.toContain(s)
  }
}

export class FlorDocumentTesting extends FlorDocument {
  expect = new FlorTest(this)
}