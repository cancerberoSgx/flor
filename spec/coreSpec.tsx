import { ProgramDocument, StylePropsImpl } from '../src';

describe('core', () => {
  it('Attr and Props should not spread private members', async done => {
    const s = new StylePropsImpl({ bg: 'red' }, null as any)
    expect(JSON.stringify(s.data)).toBe('{"bg":"red"}')
    expect({ ...s.data }).toEqual({ bg: 'red' })
    expect(Object.keys(s.data)).toEqual(['bg'])
    done()
  })

  it('Element.props should not spread private members', async done => {
    const doc = new ProgramDocument()
    const el = doc.createElement('box')
    const s = el.props.data
    expect(JSON.stringify(s)).toBe('{}')
    expect({ ...s }).toEqual({})
    expect(Object.keys(s)).toEqual([])
    el.props.bg = 'blue'
    expect(Object.keys(el.props.data)).toEqual(['bg'])
    done()
  })

})
