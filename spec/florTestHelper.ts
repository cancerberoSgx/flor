import { FlorDocument } from '../src';

class FlorTest {
  constructor(protected flor: FlorDocument){   
  } 
  toContain(s: string){
    expect('\n'+this.flor.printBuffer()).toContain(s)
  }
  notToContain(s: string){
    expect(this.flor.printBuffer()).not.toContain(s)
  }
}

export class FlorDocumentTesting extends FlorDocument {
  expect = new FlorTest(this)
}