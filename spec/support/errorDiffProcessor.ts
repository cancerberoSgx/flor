import { DisplayProcessor } from 'jasmine-spec-reporter'
import { removeEmptyLines } from 'misc-utils-of-mine-generic';
import { CustomReporterResult } from 'jasmine-spec-reporter/built/spec-reporter';
import { createPatch } from 'diff';
import { ansi } from 'cli-driver';
import { debug } from '../../src';
import { notUndefined } from 'misc-utils-of-mine-typescript';

export class CustomProcessor extends DisplayProcessor {
  displayFailedSpec(spec: CustomReporterResult, log: string): string {
    return `
  ${log}
  
  ${spec.description}
  
  ${spec.failedExpectations && spec.failedExpectations.map(e=>e.stack).filter(notUndefined).join('\n\n')}
  `
    // return JSON.stringify(spec)
    // const colored: string[] = []
    // debug(spec, log)
    // if (spec.failedExpectations && spec.failedExpectations.length) {
    //   spec.failedExpectations.forEach(s => {
    //     const p = createPatch(s.message||'', s.actual||'', s.expected||'')
    //     const c = (p||'')
    //       .split('\n')
    //       .map(l => (l.startsWith('-') ? ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']) : l))
    //       .join('\n')
    //     colored.push(removeEmptyLines(c))
    //   })
    // }
    // return colored.join('\n\n\n')
  }
  displaySpecErrorMessages(spec: CustomReporterResult, log: string): string {
    // debug(log, spec)
    return removeEmptyLines(`${log}

    ${spec.failedExpectations && spec.failedExpectations.map(e=>e.stack).filter(notUndefined).join('\n\n')}`)
    }
  displaySummaryErrorMessages(spec: CustomReporterResult, log: string) {
    return removeEmptyLines(`${log}

    ${spec.failedExpectations && spec.failedExpectations.map(e=>e.stack).filter(notUndefined).join('\n\n')}`)
    }
  
}
