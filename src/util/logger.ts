import { appendFileSync } from 'fs'
import { inspect } from 'util'
import { inBrowser } from 'misc-utils-of-mine-generic'

export function addLogger(l: Logger) {
  loggers.push(l)
}

const loggers: Logger[] = []

interface Logger {
  log(...args: any[]): void
}

export function debug(...args: any[]) {
  loggers.forEach(l => {
    l.log(...args)
  })
}

addLogger({
  log(...args: any[]) {
    if (inBrowser()) {
      console.log(...args)
    } else {
      appendFileSync(
        'log2.txt',
        '\n' + args.map(a => typeof a === 'string' ? a : inspect(a, { compact: true, breakLength: 200, maxArrayLength: 5 })).join(' |||||||||| ')
      )
    }
  }
})
