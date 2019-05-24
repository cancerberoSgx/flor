import { inBrowser } from 'misc-utils-of-mine-generic'
import { Program, ProgramOptions } from '../declarations/program'
import { debug } from '../util'
import { createProgram, defaultProgramOptions } from './programUtil'

let browser
declare var window: any, document: any
type HTMLElement = any

export interface ProgramBrowserOptions extends ProgramOptions {
  browserTermCols?: number
  browserTermRows?: number
  containerElement?: HTMLElement
}

/**
 * IMPORTANT: Make sure the document is fully loaded (window.onload).
 */
export function createProgramForBrowser(options: ProgramBrowserOptions) {
  if (!inBrowser()) {
    const s = 'createProgramForBrowser invoked but not in a browser!'
    debug(s)
    console.warn(s)
    return createProgram(options)
  }

  // HEADS UP: load term.js from here so it's not a hard dependency
  let termJs = require('term.js')

  let term = new termJs.Terminal({
    cols: options.browserTermCols || 80,
    rows: options.browserTermRows || 24,
    useStyle: true,
    screenKeys: true,
    dontEmitKeyPress: true
  })
  term.open(options.containerElement || document.body)
  term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n')

  // glue to make blessed work in browserify
  term.columns = term.cols
  term.isTTY = true

  require('readline').emitKeypressEvents = function() { } // Can I side-affect a module this way? Apparently.
  process.listeners = function fakelisteners() { return [] }
  term.resize(options.browserTermCols || 100, options.browserTermRows || 36)

  const program = new Program({
    ...defaultProgramOptions,
    ...options,
    input: term,
    output: term,
    tput: false
  })
  return program
}
