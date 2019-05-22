import { BorderStyle, FlorDocument } from '../src'
import { defaultTestSetup } from './testUtil'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999

describe('props', () => {

  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('data should return only plain old objects without artificial values', async done => {
    const div1 = flor.create({ 
      border: { type: BorderStyle.round, fg: 'blue' }, 
      focus: { fg: 'yellow', border: { type: BorderStyle.double, fg: 'red' } }, 
      fg: 'green' 
    })
    expect(JSON.stringify(div1.props.data)).toContain(
      `{"border":{"type":"round","fg":"blue"},"fg":"green","focus":{"border":{"type":"double","fg":"red"},"fg":"yellow"}}`)
    done()
  })

})
