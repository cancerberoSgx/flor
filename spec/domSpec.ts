import { removeWhites } from 'misc-utils-of-mine-generic'
import { notFalsy } from 'misc-utils-of-mine-typescript'
import { Document, isDomElement } from '../src'
import { createDomElement } from '../src/dom/nodeUtil';

describe('dom', () => {

  it('createElement, appendChild, createTextNode, innerHTML, outerHTML', async done => {
    const d = new Document()
    const div1 = d.createElement('Div')
    d.appendChild(div1)
    div1.appendChild(d.createElement('Div'))
    div1.appendChild(d.createTextNode('text'))
    expect(removeWhites(div1.innerHTML, '')).toBe('<Div></Div>text')
    expect(removeWhites(div1.outerHTML, '')).toBe('<Div><Div></Div>text</Div>')
    expect(div1.parentNode).toBe(d)
    done()
  })

  it('document should have at the body as its children', async done => {
    const d = new Document()
    expect(d.childNodes.length).toBe(1)
    expect(d.childNodes[0]).toBe(d.body)
    expect(removeWhites(d.outerHTML, '')).toContain('<document><body></body></document>')
    expect(d.filterDescendants(notFalsy).length).toBe(1)
    expect(d.findDescendant(notFalsy)).toBe(d.body)
    done()
  })

  it('findDescendant', async done => {
    const d = new Document()
    const div1 = d.createElement('Div1')
    d.body.appendChild(div1)
    div1.appendChild(d.createElement('Div11'))
    div1.appendChild(d.createTextNode('text'))
    const d2 = d.createElement('d2')
    d.body.appendChild(d2)
    d2.appendChild(d.createElement('div3'))
    div1.appendChild(d2)

    expect(d.filterDescendants(d => isDomElement(d) && d.tagName === 'Div1').length).toBe(1)
    expect(d.filterDescendants(isDomElement).length).toBe(5)
    expect(d.body.filterDescendants(isDomElement).length).toBe(4)

    done()
  })

  it('createDomElement, textContent, outerHtml', async done => {
    const doc = new Document()
    const el =createDomElement(doc, {
      children: ['hello', {textContent: 'world', children: ['bite'], tagName: 'me'} ]
    })
    expect(removeWhites(el.outerHTML)).toBe(removeWhites(`
    <box>
      hello
      <me>
        world
        bite
      </me>
    </box>`))
    done()
  })
})
