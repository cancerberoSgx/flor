import { tryTo } from 'misc-utils-of-mine-generic';
import { FullProps, ProgramDocument, ProgramDocumentRenderer } from '..';
import { Program, ProgramOptions } from '../declarations/program';
import { Flor } from '../jsx/createElement';

/**
 * Destroy given program and exits the process with given status.
 */
export function destroyProgramAndExit(program: Program, status = 0) {
  destroyProgram(program)
  process.exit(status)
}

export const defaultProgramOptions = {
  buffer: true
}

/**
 * Destroys given program.
 */
export function destroyProgram(program: Program) {
  // if (!program.isAlt) return
  program.put && program.put.keypad_local()
  if (program.scrollTop !== 0
    || program.rows - 1) {
    program.csr(0, program.rows - 1)
  }
  tryTo(() => program.disableMouse())
  // XXX For some reason if alloc/clear() is before this line, it doesn't work on linux console.
  program.showCursor()
  tryTo(() => program.disableMouse())
  program.normalBuffer()
  tryTo(() => {
    program.cursorReset()
    program.resetCursor()
  })
  // program.showCursor() program.disableMouse()
  program.normalBuffer()
  program.tput && program.tput.sgr0()
  program.reset()
  program.clear()
  program.flush()
  if (process.platform === 'win32') {
    tryTo(() => require('child_process').execSync('cls', { stdio: 'ignore', timeout: 1000 }))
  }
  program.destroy()  // this causes windows terminal to hang
  program.flush()
}

/**
 * Install default exit keys ['q', 'escape', 'C-c'] in the program (when those keys are pressed the program is
 * destroyed and the process exits)
 */
export function installExitKeys(program: Program, exitKeys = ['q', 'escape', 'C-c']) {
  program.key(exitKeys, function() {
    destroyProgramAndExit(program)
  })
}

/**
 * frees unlock keyboard and mouse resources. Don't destroy de program or event listeners but the terminal is
 * reset ready to be used by other program or screen. To use it again, use [[enterProgram]]
 */
export function leaveProgram(program: Program) {
  if (!program.isAlt) {
    return
  }
  program.put && program.put.keypad_local()
  if (program.scrollTop !== 0
    || program.scrollBottom !== program.rows - 1) {
    program.csr(0, program.rows - 1)
  }
  // XXX For some reason if alloc/clear() is before this line, it doesn't work on linux console.
  program.showCursor()
  program.disableMouse()
  program.normalBuffer()
  program.resetCursor()
  program.flush()
  if (process.platform === 'win32') {
    try {
      require('child_process').execSync('cls', { stdio: 'ignore', timeout: 1000 })
    } catch (e) {

    }
  }
}

/**
 * enters again in the reset program by  [[leaveProgram]]. installing internal configuration and enabling
 * mouse, and keys.
 */
export function enterProgram(program: Program): any {
  if (program.isAlt) {
    return
  }
  if (process.platform === 'win32') {
    try {
      require('child_process').execSync('cls', { stdio: 'ignore', timeout: 1000 })
    } catch (e) {

    }
  }
  program.alternateBuffer()
  program.put && program.put.keypad_xmit()
  program.csr(0, program.rows - 1)
  program.hideCursor()
  program.cup(0, 0)
  // We need this for tmux now:
  if (program.tput && program.tput.strings.ena_acs) {
    program._write(program.tput.enacs())
  }
}

/**
 * Creates a new program with a renderer and a document.
 */
export function createProgramRendererDocument(programOptions: ProgramOptions = defaultProgramOptions) {
  const document = new ProgramDocument()
  Flor.setDocument(document)
  const program = createProgram(programOptions)
  const renderer = new ProgramDocumentRenderer({ program })
  return { renderer, document, program }
}

/**
 * Creates a new program.
 */
export function createProgram(programOptions: ProgramOptions & {
  installDefaultExitKeys?: boolean;
} = { ...defaultProgramOptions, installDefaultExitKeys: true }) {
  const p = new Program(programOptions)
  programOptions.installDefaultExitKeys && installExitKeys(p)
  return p
}

/**
 * Creates a new program, a new renderer, a new document with a new element inside.
 */
export function createProgramRendererDocumentAndElement(programOptions: ProgramOptions = defaultProgramOptions, props?: FullProps) {
  const document = new ProgramDocument()
  Flor.setDocument(document)
  const program = new Program(programOptions)
  installExitKeys(program)
  const renderer = new ProgramDocumentRenderer({ program })
  const el = document.create({ top: 0, left: 0, width: program.cols - 1, height: program.rows - 1, fg: 'black', bg: 'green', border: {}, ...props || {} })
  return { renderer, document, program, el }
}
