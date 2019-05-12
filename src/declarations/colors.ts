
type ColorRgb = [number, number, number]

export type Color = number | ColorName | string
export type ColorName= 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'
interface Colors {
/**
 * Match given color in a high level form (like rgb or hex expression) with a terminal color number
 * interpolating to a similar color.
 */
  match(r1: Color | ColorRgb, g1?: number, b1?: number): number
/**
 * Convert a string color name into a color number format.
 */
  convert(color: Color): number
/**
 * Similar to blend which is based on this. Takes two attr numbers and returns a mixture of them prioritizing one or the other according to given `alpha` value between 0 and 1.
 */
  mixColors(c1: number, c2: number, alpha: number): number
/**
 * Convert given r, g, b color to a hex string compatible with blessed.
 */
  RGBToHex(r: number, g: number, b: number): string
/**
 * Convert gicen hex string into a rgb number array .
 */
  hexToRGB(hex: string): ColorRgb
/**
 * Takes two attr numbers and returns a mixture of them prioritizing one or the other according to given `alpha` value between 0 and 1.
 */
  blend(attr: number, attr2?: number, alpha?: number): number
/**
 * Seed all 256 colors. Assume xterm defaults. Ported from the xterm color generation script.
 */
  colors(): number[]
/**
 * Map higher colors to the first 8 colors. This allows translation of high colors to low colors on
 * 8-color terminals.
 */
  ccolors(): number[]

/**
* This maps color names  'black','red','green','yellow','blue','magenta','cyan','white' to color numbers or
* color numbers offsets to fast Map higher colors to the first 8 colors allowing translation of high colors
* to low colors on 8-color terminals.
* */
  ncolors: {[name in ColorName]: number | [number,number]}

  colorNames: {
    black: 0
    red: 1
    green: 2
    yellow: 3
    blue: 4
    magenta: 5
    cyan: 6
    white: 7
    // light
    lightblack: 8
    lightred: 9
    lightgreen: 10
    lightyellow: 11
    lightblue: 12
    lightmagenta: 13
    lightcyan: 14
    lightwhite: 15
    // bright
    brightblack: 8
    brightred: 9
    brightgreen: 10
    brightyellow: 11
    brightblue: 12
    brightmagenta: 13
    brightcyan: 14
    brightwhite: 15
    // alternate spellings
    grey: 8
    gray: 8
    lightgrey: 7
    lightgray: 7
    brightgrey: 7
    brightgray: 7
  }
}

export const colors: Colors = require('../blessed/colors')
