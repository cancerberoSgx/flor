
import { appendFileSync } from 'fs'
import { rm } from 'shelljs'
import { format, inspect } from 'util'

rm('-rf', 'test_output.txt')

let Jasmine = require('jasmine')

// @ts-ignore
let j = new Jasmine()

j.loadConfigFile('spec/support/jasmine.json')

j.configureDefaultReporter({
  print: function(...args: any[]) {
    appendFileSync(
      'test_output.txt',
      'print: ' +
        args
          .map(a => {
            if (a instanceof Error) {
              return `${a}\n${a && a.stack && a.stack.split('\n').join('\n')}`
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
  console.log('RESULT FILE WAS WRITTEN TO test_output.txt')
  if (passed) {
    console.log('All specs have passed')
    process.exit(0)
  } else {
    console.log('At least one spec has failed')
    process.exit(1)
  }
})

import { ansi } from 'cli-driver'
import { createPatch } from 'diff'
import { DisplayProcessor, SpecReporter } from 'jasmine-spec-reporter'
import { CustomReporterResult } from 'jasmine-spec-reporter/built/spec-reporter'

class CustomProcessor extends DisplayProcessor {
  displayFailedSpec(spec: CustomReporterResult, log: string): string {
    const colored: string[] = []
      if (spec.failedExpectations && spec.failedExpectations.length) {
        spec.failedExpectations.forEach(s => {
          const p = createPatch(s.message, s.actual, s.expected)
          const c = p
          .split('\n')
          .map(l => (l.startsWith('-') ? ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']) : l))
          .join('\n')
          colored.push(c)
        })
      }
      return colored.join('\n\n\n')
    }
  // displaySpecErrorMessages(spec: CustomReporterResult, log: string): string {
  //     return ''
  //   }
  //   displaySummaryErrorMessages(){return ''}
}

jasmine.getEnv().clearReporters()
jasmine.getEnv().addReporter(new SpecReporter({
  customProcessors: [CustomProcessor]
}))

j.execute()
