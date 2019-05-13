import { FlorDocument, debug } from '../src'
import { sleep } from 'misc-utils-of-mine-generic';
export function defaultTestSetup(l: (flor?: FlorDocument) => FlorDocument) {
  beforeEach(() => {
    const flor = new FlorDocument()
    process.on('uncaughtException', async err => {
      debug(err)
      flor.destroy()
      await sleep(300)
      console.log('Caught exception: ' + err, err, err.stack)
      process.exit(1)
    })
    l(flor)
  })
  afterEach(() => {
    l().destroy()
  })
}
