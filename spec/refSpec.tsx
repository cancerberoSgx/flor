import { waitForPredicate } from 'misc-utils-of-mine-generic'
import { Component, Flor, FlorDocument, ProgramElement } from '../src'
import { defaultTestSetup, toContain } from './testUtil'

describe('ref', () => {
  let flor: FlorDocument
  defaultTestSetup(f => flor = f || flor)

  it('should reference elements', async done => {
    let r = Flor.createRef()
    const b = flor.create(<el ref={r}>hello world</el>)
    flor.render()
    await toContain(flor.renderer, 'hello world')
    expect(r.current).toBe(b)
    done()
  })

  it('should call callback', async done => {
    let b2: ProgramElement | undefined
    const b = flor.create(<el ref={Flor.createRef(c => { b2 = c })}>hello world</el>)
    flor.render()
    await waitForPredicate(() => !!b2)
    expect(b2).toBe(b)
    done()
  })

  it('should reference components', async done => {
    let b2: C | undefined
    class C extends Component {
      render() {
        return <el>hello</el>
      }
      __mark = 123
    }
    const b = flor.create(<C ref={Flor.createRef<C>(c => { b2 = c })}>hello world</C>)
    flor.render()
    await waitForPredicate(() => !!b2)
    expect(b2!.__mark).toBe(123)
    done()
  })

})
