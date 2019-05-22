// example of browser enabled program
// Compile:
// npx tsc && browserify dist/spec/experiments/browser.js -o dist/bundle.js
// Minify: 
// npx terser -o dist/bundle.js dist/bundle.js 

var termJs = require('term.js')
import {Program} from  '../../src'

declare var window: any, document: any

window.onload = function () {
  var term = new termJs.Terminal({
    cols: 80,
    rows: 24,
    useStyle: true,
    screenKeys: true
  });
  term.open(document.body);
  term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

  // glue to make blessed work in browserify
  term.columns = term.cols;
  term.isTTY = true;
  require('readline').emitKeypressEvents = function () { };  // Can I side-affect a module this way? Apparently.
  process.listeners = function fakelisteners() { return []; };
  term.resize(100, 36);

const program = new Program({
  input: term, 
  output: term, 
  tput: false
})
program.setMouse({
  allMotion: true,
}, true);
program.alternateBuffer()
program.enableMouse()
program.key(['q', 'escape', 'C-c'], function () {
  program.showCursor()
  program.disableMouse()
  program.normalBuffer()
  program.reset()
  program.destroy()
  // process.exit(0)
})
program.setBackground('green')
program.setForeground('red')
program.on('mouse', function (data) {
  // console.log(data)
  program.cup(data.y, data.x);
  program.write('X');
});



};