import { inspect } from 'util';
import { Program } from '../../../src';

// import { words } from '../../../data';
// import { debug } from '../../../../src';
// const Program = require('../../../../src/blessed/program')
const program = new Program({
})
program.key(['q', 'escape', 'C-c'], function() {
  program.showCursor()
  program.disableMouse()
  program.normalBuffer()
  program.reset()
  process.exit(0)
})

let ESC = '\x1b'
let a = `${ESC}[?7h`

program._write(`?1035`)
program.on('keypress', (ch, e) => {
  program._write(inspect(e))
})

program._write(`${ESC}[?10c`)

// HORIZONTAL MARGINS
// ESC [   Pn  ;   Pn  s
//   033 133 *** 073 *** 163
//   Set left and right margins to the values given

// , (err, d)=>{
//   debug(err, d)
// })

// process.stdout.write(a + words(100))

// ESC [   0   "   z
// 033 133 060 042 172
// Set quality select mode to default (draft mode).
// Quality select
// ESC [   1   "   z
