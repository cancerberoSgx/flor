#!/usr/bin/env node

const argv = process.argv.slice(2)
const cmd = argv.shift();
const TPut = require('..').TPut
const tput = new TPut({
  terminal: process.env.TERM,
  termcap: !!process.env.USE_TERMCAP,
  extended: true
})

if (tput[cmd]) {
  process.stdout.write(tput[cmd].apply(tput, argv));
}
  