import { FlorDocument } from '../src'
export function defaultTestSetup(l: (flor?: FlorDocument) => FlorDocument) {
  beforeEach(() => {
    const flor = new FlorDocument()
    process.on('uncaughtException', function(err) {
      flor.destroy()
      console.log('Caught exception: ' + err, err, err.stack)
      process.exit(1)
    })
    l(flor)
  })
  afterEach(() => {
    l().destroy()
  })
}
