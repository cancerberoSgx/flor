import { execSync } from 'child_process'

export const nextTick = global.setImmediate || process.nextTick.bind(process)

export function nowHash() {
  return Date.now().toString(36)
}

export function formatDate(d: Date) {
  return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + ':' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
}

export function nowFormat() {
  return Math.trunc(Date.now() / 1000 / 1000) + ''
}

export function getCurrentCommit() {
  return execSync('git rev-parse --short HEAD')
    .toString()
    .trim()
}

export function nonEnumerableMember(o: any, name: string) {
  Object.defineProperty(o, name, {
    enumerable: false,
    writable: true
  })
}

export function enumerableMember(o: any, name: string) {
  Object.defineProperty(o, name, {
    enumerable: true,
    writable: true
  })
}
