//@ts-nocheck

// const Program = require('../../../../src/blessed/program') 
// const program = Program({
// })
//     program.key(['q', 'escape', 'C-c'], function () {
//       program.showCursor()
//       program.disableMouse()
//       program.normalBuffer()
//       program.reset()
//       process.exit(0)
//     })
// program.setMouse({
//   allMotion: true,
// }, true);
// program.alternateBuffer()
// program.enableMouse()
// program.setBackground('green', true)
// program.setForeground('red', true)
// program.on('mouse', function (data) {
//   program.cup(data.y, data.x);
//   program.write(' ' );
// });

// program.setMode('?5h', (error, data)=>{

// });

// program._write('\  x1b#5');
// program._write('\x1b#4');

// Cursor Line	 CSI   ?    1    i

// program._write('\x1b[?1i');

// program._write('\x1b1;1;1;0;0;2;0;0{P???owYn||~ywo??/?IRJaVNn^NVbJRI\x1b')

// program._write('!\x1b(\x1bP\x1b!')

// program._write('\x1b[2t')
// program._write('\x1b[1;2r')

// program._write('\x1b[12;4r')

// program._write('\x1b[9;19r')
// program._write('\x1b[9;19r')
// program._write('\x1b01v4C41313030\x1b/', (err, data)=>{
//   debug(err, data);
  
// })

// var ESC='\x1b'
// var a = `${ESC}[?7h`
// process.stdout.write(a)


// echo -e "\x1b[?80h"
process.stdout.write('\x1b[?80h')
const sixel = '~~~'
process.stdout.write(`###\x1bPq#2${sixel}\x1b\\xxx`)

// clear

// echo "test different widths"
// sixels='~ ~~ ~~~ ~~~~ ~~~~~ ~~~~~~ ~~~~~~~ ~~~~~~~~ ~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~~~ ~~~~~~~~~~~~~'
// for sixel in $sixels
// do
// echo -ne "###\x1bPq#2$sixel\x1b\\xxx"
// read
// done

// // program._write('\0x033P\0x120\0x061\0x166\0x064\0x103\0x064\0x061\0x063\0x061\0x063\0x060\0x063\0x060\0x033\0x134')
//   // , (err, data)=>{
//   // debug(err, data);
  
// // })

