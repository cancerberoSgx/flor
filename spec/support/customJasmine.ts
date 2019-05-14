
import { appendFileSync } from 'fs'
import { SpecReporter } from 'jasmine-spec-reporter'
import { rm } from 'shelljs'
import { format, inspect } from 'util'
import { CustomProcessor } from './errorDiffProcessor'

const argv = process.argv.slice(2)
const configFile = argv.shift()

// rm('-rf', 'test_output.txt')

let Jasmine = require('jasmine')

// @ts-ignore
let j = new Jasmine()

j.loadConfigFile(configFile || 'spec/support/jasmine.json')

j.configureDefaultReporter({
  print: function(...args: any[]) {
    appendFileSync(
      'test_output.txt',
      'print: ' +
      args
        .map(a => {
          if (a instanceof Error) {
            return `${a}\n${a && a.stack && (a.stack || '').split('\n').join('\n')}`
          } else {
            return inspect(a)
          }
        })
        .join(', ')
    )
    process.stdout.write(format.apply(this, arguments as any))
  }
})

j.onComplete(function(passed: boolean) {
  console.log('RESULT FILE WAS WRITTEN TO test_output.txt', arguments)
  if (passed) {
    console.log('All specs have passed')
    process.exit(0)
  } else {
    console.log('At least one spec has failed')
    process.exit(1)
  }
})

jasmine.getEnv().clearReporters()
jasmine.getEnv().addReporter(new SpecReporter({
  customProcessors: [CustomProcessor]
}))

j.execute()
