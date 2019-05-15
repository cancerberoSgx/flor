import { sleep, waitForPredicate } from 'misc-utils-of-mine-generic'
import { debug, FlorDocument, ProgramDocumentRenderer } from '../src'
export function defaultTestSetup(l: (flor?: FlorDocument) => FlorDocument) {
  beforeEach(() => {
    try {
      const flor = new FlorDocument()
      process.on('uncaughtException', async err => {
        debug(err)
        flor.destroy()
        await sleep(300)
        console.log('Caught exception: ' + err, err, err.stack)
        process.exit(1)
      })
      l(flor)
    } catch (error) {
      debug(error)
    }

  })
  afterEach(() => {
    l().destroy()
  })
}


export async function expectWillContain(renderer: ProgramDocumentRenderer, text: string) {
  await waitForPredicate(() => renderer.printBuffer(true).includes(text))
  expect(renderer.printBuffer(true)).toContain(text)
}