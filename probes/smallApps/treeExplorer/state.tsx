import { TODO } from 'misc-utils-of-mine-typescript'
export interface State {
  examples: TODO[]
  currentEditor: Editor
  input: AstNode
  output: AstNode[],
  settings: Settings
}
interface AstNode extends TODO {

}
interface Editor {
  value: string
}
export interface Settings {
  speed: number
}

export const state: State = {
  examples: [],
  settings: {
    speed: 0
  },
  currentEditor: {
    value: ''
  },
  input: {

  },
  output: [{}]
}
