// // // import { TPut, sprintf } from '../../../../src'
// // // import { array } from 'misc-utils-of-mine-generic';

// // // const tput = new TPut({
// // //   terminal: process.env.TERM,
// // //   termcap: !!process.env.USE_TERMCAP,
// // //   extended: true
// // // })
// // // var j = 0
// // // for (let i = 0; i <256; i++) {
// // //   j = 256-i
// // //   var l = array(5).map(i=>i+','+j)
// // //   process.stdout.write(`${tput.set_a_background (i)} ${tput.set_a_foreground(j)} ${i+','+j}`)
// // // }
// var ESC='\x1b'**>bghhhh
// console.log(`
// ${ESC}Pq
// #0;2;0;0;0#1;2;100;100;0#2;2;0;100;0
// #1~~@@vv@@~~@@~~$
// #2??}}GG}}??}}??-
// #1!14@
// ${ESC}\\`)

// // // // var ESC='\x1b'
// // // // // ESC [   Pn  ;   Pn  s
// // // // console.log(`${ESC}[4;15s`)r

// // // // // t
// // // // console.log(tput.set_left_margin_parm(15));

// // // // console.log(`adasd asdsad lfjksd lkfjlsdkj flskdj flskdj f asd asd as`)
// // // // console.log(`adasd asd asd asd as`)
// // // // console.log(`adasd asd asd asd as`)

// // echo -e "\x1b[?80h"

// // clear

// // echo "test different widths"
// // sixels='~ ~~ ~~~ ~~~~ ~~~~~ ~~~~~~ ~~~~~~~ ~~~~~~~~ ~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~~~ ~~~~~~~~~~~~~'
// // for sixel in $sixels
// // do
// // echo -ne "###\x1bPq#2$sixel\x1b\\xxx"
// // read
// // done

// // clear

// // echo "test different heights - full sixel block"
// // echo -ne "###\x1bPq#2~~~~~~\x1b\\xxx"
// // read
// // echo -ne "###\x1bPq#2~~~~~~-~~~~~~\x1b\\xxx"
// // read
// // echo -ne "###\x1bPq#2~~~~~~-~~~~~~-~~~~~~\x1b\\xxx"
// // read
// // echo -ne "###\x1bPq#2~~~~~~-~~~~~~-~~~~~~-~~~~~~\x1b\\xxx"
// // read
// // echo -ne "###\x1bPq#2~~~~~~-~~~~~~-~~~~~~-~~~~~~-~~~~~~\x1b\\xxx"
// // read

// // clear
