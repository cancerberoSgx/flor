import { array } from 'misc-utils-of-mine-generic'
import { TPut } from '../../src'

const tput = new TPut({
  terminal: process.env.TERM,
  termcap: !!process.env.USE_TERMCAP,
  extended: true
})
// let j = 0
// for (let i = 0; i < 256; i++) {
//   j = 256 - i
//   let l = array(5).map(i => i + ',' + j)
//   process.stdout.write(`${tput.set_a_background(i)} ${tput.set_a_foreground(j)} ${i + ',' + j}`)
// }
console.log(`
${tput.sgr0()}
Normal text
${tput.enter_underline_mode()}Underline text${tput.exit_underline_mode()}
Back to normal`)

// var ESC='\x1b'
// // ESC [   Pn  ;   Pn  s
// console.log(`${ESC}[4;15s`)

// // // // t
// console.log(tput.set_left_margin_parm(15));

// console.log(`adasd asdsad lfjksd lkfjlsdkj flskdj flskdj f asd asd as`)
// console.log(`adasd asd asd asd as`)
// console.log(`adasd asd asd asd as`)


// // var ESC='\x1b'
// console.log(`${ESC}[4;15s`)
// // process.stdout.write('\x1b[p');
// CSI Ps @  Insert Ps (Blank) Character(s) (default = 1) (ICH).

// CSI Ps SP @
//           Shift left Ps columns(s) (default = 1) (SL), ECMA-48.
// CSI Ps ; Ps ; Ps ; Ps ; Ps T
// Initiate highlight mouse tracking.  Parameters are
// [func;startx;starty;firstrow;lastrow].  See the section Mouse
// Tracking.