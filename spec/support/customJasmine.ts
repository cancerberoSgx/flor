import { appendFileSync } from 'fs'
import { rm } from 'shelljs'
import { format, inspect } from 'util'
import { ansi } from 'cli-driver'
import { createPatch } from 'diff'

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

import {DisplayProcessor, SpecReporter} from "jasmine-spec-reporter";
// import SuiteInfo = jasmine.SuiteInfo;
import { CustomReporterResult } from 'jasmine-spec-reporter/built/spec-reporter';
// import { NamedNodeMap } from '../../src';

class CustomProcessor extends DisplayProcessor {
    // public displayJasmineStarted(info: SuiteInfo, log: string): string {
    //     return ``;
    // }
    // displaySuite(suite: CustomReporterResult, log: string): string{return ''}
    // displaySpecStarted(spec: CustomReporterResult, log: string): string{return ''}
    // displaySuccessfulSpec(specC: CustomReporterResult, log: string): string;
    displayFailedSpec(spec: CustomReporterResult, log: string): string{
      if(spec.failedExpectations && spec.failedExpectations.length){
        spec.failedExpectations.forEach(s=>{
          // debugger
          const p = createPatch(s.message, s.actual, s.expected)//, '', '', {context: 20, newlineIsToken: true})
          showDiff({name: '', diff: p})
        })
      }
      //  && 
      return log

// return 'displayFailedSpec'
    }
    displaySpecErrorMessages(spec: CustomReporterResult, log: string): string{
    //     // console.log(spec, log);
    //     // spec.failedExpectations && spec.failedExpectations.forEach(s=>{
    //     //   debugger
    //     //   const p = createPatch('name', s.actual, s.expected, '', '', {context: 20, newlineIsToken: true})
    //     //   showDiff({name: '', diff: p})
    //     // })
    //     // createPatch('name', spec.failedExpectations[0]., spec.c.file.oldText, file.newText)
    //     return log
    //     // return 'displaySpecErrorMessages'
return ''
    }
    // displaySummaryErrorMessages(spec: CustomReporterResult, log: string): string{
    //   return ''
    // }
    // displayPendingSpec(spec: CustomReporterResult, log: string): string;
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    customProcessors: [CustomProcessor],
}));

j.execute()


function showDiff(f: { name: string; diff: string }) {
  const colorized = f.diff
    .split('\n')
    .map(l => (l.startsWith('-') ? ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']) : l))
    .join('\n')
  console.log(`${colorized}`)
}
