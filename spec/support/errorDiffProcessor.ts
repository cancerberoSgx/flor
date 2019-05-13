import { ansi } from 'cli-driver'
import { createPatch } from 'diff'
import { DisplayProcessor } from 'jasmine-spec-reporter'
import { CustomReporterResult } from 'jasmine-spec-reporter/built/spec-reporter'
import { removeEmptyLines } from 'misc-utils-of-mine-generic'

export class CustomProcessor extends DisplayProcessor {
  displayFailedSpec(spec: CustomReporterResult, log: string): string {
    const colored: string[] = []
    if (spec.failedExpectations && spec.failedExpectations.length) {
      spec.failedExpectations.forEach(s => {
        const p = createPatch(s.message, s.actual, s.expected)
        const c = p
          .split('\n')
          .map(l => (l.startsWith('-') ? ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']) : l))
          .join('\n')
        colored.push(removeEmptyLines(c))
      })
    }
    return colored.join('\n\n\n')
  }
  displaySpecErrorMessages(spec: CustomReporterResult, log: string): string {
    return removeEmptyLines(log)
  }
  displaySummaryErrorMessages(spec: CustomReporterResult, log: string) {
    return removeEmptyLines(log)
  }
}
