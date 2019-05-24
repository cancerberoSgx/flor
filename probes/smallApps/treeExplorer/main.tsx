import { debug, Flor, FlorDocument } from '../../../src'
import { App } from './app'
import { state } from './state'

try {
  const flor = new FlorDocument()
  flor.focus.installDefaultChangeFocusKeys()
  const le = flor.create(<App state={state} flor={flor} />)
  flor.render()
} catch (error) {
  debug(error)
}
