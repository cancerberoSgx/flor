import { FlorDocument, Flor } from '../src'
import { defaultTestSetup, toContain } from './testUtil'
import { YogaDocument } from '../src/programDom/yogaElement';

describe('yogaElement', () => {
  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('by default overflow visible', async done => {
   const flor = new FlorDocument({
     documentImplementation () {return new YogaDocument()}
   })
  const el = flor.create(<box>
    <box top={2} left={3} height={3} width={12} bg="red">hello</box>
  </box>)
  flor.render()
  await toContain(flor.renderer, 'hello')
  flor.destroy()
  done()
  })
})
