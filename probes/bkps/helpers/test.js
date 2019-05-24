// @ts-nocheck
const args = process.argv.slice(2)

const context = args.map(s=>s.match(/--diff-context=(\d+)/)).map(s=>s && s[1]).find(s=>!!s)
const newlineIsToken = args.map(s=>s.match(/--diff-newline-is-token/)).map(s=>!!s).find(s=>s)

console.log(context, newlineIsToken, require('jasmine').ConsoleReporter);
process.exit(0)

// const {format} = require('ansi-escape-sequences')
var toStr = Object.prototype.toString
function getTypeScript(type) {
  return toStr.call(type)
}
function isObject(obj) {
  return typeof obj === 'object' && getTypeScript(obj) === '[object Object]'
}
const isArray = Array.isArray
const { diffLines, diffJson, diffArrays } = require('diff')

function record(a, b, formatter) {
  // const texts = getTextForDiff(a, b)
  // let changes
  if (typeof a === 'string' && typeof b === 'string') {
    let changes = diffLines(a, b, { newlineIsToken  })
    const output = []

    changes.forEach(function (part) {
      // const s = part.added ? format(part.value)
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
      // process.stdout.write(part.value[color]);
      // console.log();
      output.push(part.value[color])
    });
    return output.join('\n')
  }
  if (isObject(a) && isObject(b)) {
    let changes = diffJson(a, b, { newlineIsToken: true })
  }
  if (isArray(a) && isArray(b)) {
    let changes = diffArrays(a, b)
  }
  else {
    return lastRecordFn && lastRecordFn(a, b, formatter)
  }
}
let lastRecordFn
const original = jasmine.DiffBuilder
jasmine.DiffBuilder = () => {
  const result = original.apply(this, arguments)
  lastRecordFn = result.record || lastRecordFn
  result.record = record
  // result.record(a, b, formatter){
  //   if(a)
  // } = record(a, b, formatter){
  //   if(a)
  // }
  // results.push(result)
  // debugger
  return result
  // console.log('ressss', result );
  // debugger 
}