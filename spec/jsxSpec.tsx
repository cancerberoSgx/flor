import { removeWhites, trimRightLines } from 'misc-utils-of-mine-generic'
import { ComponentProps, ProgramDocument, ProgramDocumentRenderer } from '../src'
import { Component } from '../src/jsx/component'
import { Flor } from '../src/jsx/createElement'
import { createProgramRendererDocument } from '../src/manager/programUtil'
import { isElement } from '../src/programDom/elementUtil'

describe('jsx', () => {

  it('createElement', async done => {
    const p = <el>hello</el>
    expect(JSON.stringify(p)).toEqual(`{"type":"el","children":[{"type":"__text","props":{"textContent":"hello","children":[]},"children":[]}],"props":{}}`)
    done()
  })

  it('render', async done => {
    const p = <el width={10} height={7} bg="red" fg="black" top={4} left={12} ch="y">hello</el>
    const doc = new ProgramDocument()
    Flor.setDocument(doc)
    const e = Flor.render(p)
    expect(removeWhites(e.outerHTML)).toBe('<el width="10" height="7" bg="red" fg="black" top="4" left="12" ch="y"> hello </el>')
    const { renderer } = createProgramRendererDocument()
    renderer.renderElement(e)
    expect(renderer.printBuffer(true)).toContain(`


            helloyyyyy
            yyyyyyyyyy
            yyyyyyyyyy
            yyyyyyyyyy
            yyyyyyyyyy
            yyyyyyyyyy
            yyyyyyyyyy
`)

    renderer.destroy()
    done()
  })

  it('should render components', async done => {
    class C extends Component<{ name: string, colors: string[] } & ComponentProps> {
      render() {
        return <el top={7} left={4} width={23} height={17} ch="_" bg="blue">
          <el top={1}>hello {this.props.name}</el>
          Your colors:
        {this.props.colors.map((c, i) => <el width={c.length} ch="P" bg="yellow" height={4} left={1} top={i + 4}>{c}</el>)}
        </el>
      }
    }
    const app = <C name="seba" colors={['red', 'blue', 'green']} />
    const { renderer, document } = createProgramRendererDocument()
    const e = Flor.render(app)
    renderer.renderElement(e)
    expect(renderer.printBuffer(true)).toContain(`






    _______________________
    hello seba_____________
    ______Your colors:_____
    _______________________
    _red___________________
    _blue__________________
    _green_________________
    _PPPPP_________________
    _PPPPP_________________
    _PPPPP_________________
    _______________________
    _______________________
    _______________________
    _______________________
    _______________________
    _______________________
    _______________________
`)
    renderer.destroy()
    done()
  })

  it('should call  elementCreated and elementReady', async done => {
    let elementReady = false, elementCreated = false
    class C extends Component<{ name: string, colors: string[] } & ComponentProps> {
      _elementReady() {
        elementReady = true
        this.element!.childNodes.filter(isElement).forEach((c, i) => {
          c.props.top = i + 1
        })
      }
      _elementCreated() {
        elementCreated = true
      }
      render() {
        return <el><el>hello</el><el>my parent</el><el>will get me</el><el>an empty line</el></el>
      }
    }
    const { renderer } = createProgramRendererDocument()
    const e = Flor.render(<C name="seba" colors={['red', 'blue', 'green']} />)
    expect(elementReady).toBe(true)
    expect(elementCreated).toBe(true)
    renderer.renderElement(e)
    expect(renderer.printBuffer(true)).toContain(`
hello
my parent
will get me
an empty line
`)
    renderer.destroy()
    done()
  })

  describe('text', () => {

    let renderer: ProgramDocumentRenderer

    beforeEach(() => {
      renderer = createProgramRendererDocument().renderer
    })

    afterEach(() => {
      renderer.destroy()
    })

    it('children and text', async done => {
      const p = <el width={60} height={37} bg="red" fg="black" top={4} left={12} ch="_">
        hello world
      <el top={7} left={4} width={3} height={7} ch="2" bg="blue">K</el>
        more text
      <el top={8} left={16} width={17} height={4} ch="3" bg="green">INNER TEXT</el>
        and even more
      </el>
      renderer.renderElement(Flor.render(p))
      expect(renderer.printBuffer(true)).toContain(trimRightLines(`



            hello world_________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____K22_____________________________________________________
            ____more text___INNER TEXT3333333___________________________
            ____222_________and even more3333___________________________
            ____222_________33333333333333333___________________________
            ____222_________33333333333333333___________________________
            ____222_____________________________________________________
            ____222_____________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
            ____________________________________________________________
  `))
      done()
    })

    it('should not render null ', async done => {
      class C1 extends Component {
        render() {
          return null
        }
      }
      const app = <el><C1 /></el>
      const e = Flor.render(app)
      renderer.renderElement(e)
      expect(renderer.printBuffer(true).trim()).not.toContain(`null`)
      done()
    })

    it('should not render false ', async done => {
      class C2 extends Component {
        render() {
          return false
        }
      }
      const app = <el><C2 /></el>
      const e = Flor.render(app)
      renderer.renderElement(e)
      expect(renderer.printBuffer(true).trim()).not.toContain(`false`)
      done()
    })

    it('should render 0 ', async done => {
      class C2 extends Component {
        render() {
          return 0
        }
      }
      const app = <el><C2 /></el>
      const e = Flor.render(app)
      renderer.renderElement(e)
      expect(renderer.printBuffer(true).trim()).toContain(`0`)
      done()
    })

  })

})
