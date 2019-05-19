export const arr = (a: number = int(10, 20), b = a) => new Array(Math.trunc(int(a, b) || 1)).fill(0)

export const string = (length: number = int(10, 20)) =>
  arr(length / 5 + 1)
    .map(i =>
      Math.random()
        .toString(36)
        .substr(2, 5)
    )
    .reduce((a, b) => a.concat(b))

export const char = () => String.fromCharCode(int('a'.charCodeAt(0), 'a'.charCodeAt(0) + 25))

export const words = (
  wordCount = int(10, 20),
  wordLength = int(5, 10),
  wordCountB = wordCount,
  wordLengthB = wordLength
) => arr(wordCount, wordCountB).map(i => string(int(wordLength, wordLengthB)))

export const int = (a = 10, b = a) => Math.floor(Math.random() * b) + (a === b ? 0 : a)

export const float = (a = 10, b = a) => Math.random() * b + (a === b ? 0 : a)

export function color() {
  const colors = ['red', 'blue', 'cyan', 'green', 'magenta', 'yellow']
  return colors[int(0, colors.length - 1)]
}

export function item<T= any>(a: T[]): T {
  return a[int(0, a.length - 1)]
}
