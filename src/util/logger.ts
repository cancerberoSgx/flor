import { appendFileSync } from 'fs'
import { inBrowser } from 'misc-utils-of-mine-generic'
import { inspect } from 'util'

export function addLogger(l: Logger) {
  loggers.push(l)
}

export function removeLogger(l: Logger) {
const i = loggers.findIndex(o=>o===l)
if(i!==-1){
  loggers.splice(i, 1)
}
}

const loggers: Logger[] = []

export interface Logger {
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