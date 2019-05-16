import { sleep, waitForPredicate } from 'misc-utils-of-mine-generic'
import { debug, FlorDocument, ProgramDocumentRenderer } from '../src'
import { execSync } from 'child_process';

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

export function nowHash() {
  return Date.now().toString(36)
}

export function formatDate(d: Date) {
  return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + ':' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
}

export function nowFormat() {
  return Math.trunc(Date.now() / 1000 / 1000) + ''
}

export function getCurrentCommit() {
  return execSync('git rev-parse --short HEAD')
    .toString()
    .trim()
}


export async function expectWillContain(renderer: ProgramDocumentRenderer, text: string) {
  await waitForPredicate(() => renderer.printBuffer(true).includes(text), {interval: 100})
  expect(renderer.printBuffer(true)).toContain(text)
}
export async function expectWontContain(renderer: ProgramDocumentRenderer, text: string) {
  await waitForPredicate(() => !renderer.printBuffer(true).includes(text))
  expect(renderer.printBuffer(true)).not.toContain(text)
}
export function getPerformanceFileName(label: string) {
  return nowFormat().replace(/:/g, '_') + '_' + getCurrentCommit() + '_' + label + '.json'
}
