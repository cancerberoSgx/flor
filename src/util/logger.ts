import { appendFileSync } from 'fs'
import { inspect } from 'util'
import { inBrowser } from './misc'

export function debug(...args: any[]) {
  if (inBrowser()) {
    console.log(...args)
  } else {
    appendFileSync(
      'log2.txt',
      '\n' + args.map(a => typeof a === 'string' ? a : inspect(a, { compact: true, breakLength: 200, maxArrayLength: 5 })).join(' |||||||||| ')
    )
  }
}

