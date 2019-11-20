import { color, float, item } from '../../spec/data';
import { BorderStyle, borderStyles, debug, FlorDocument, Input, Layout } from '../../src';
import { Button } from '../../src/component/button';
import { Flor } from '../../src/jsx/createElement';

async function test() {

  try {
    const flor = new FlorDocument({ browser: true, browserTermCols: 255, browserTermRows: 65 })
    // await flor.ready

    const app = <el width={.99} height={.999} bg="gray" fg="green" border={{ type: BorderStyle.round }} layout={{ layout: Layout['topDown'], neverResizeContainer: true }}>

      <el height={.19} width={.99} left={0} padding={{ bottom: 1, top: 1, left: 1, right: 1 }} border={{ type: BorderStyle.round }} bg="red" layout={{ layout: Layout['leftRight'], neverResizeContainer: true }}
      >
        <el width={.49} height={.99} border={{ type: BorderStyle.double }} bg="blue" textWrap={true}>
          Do ad sunt est cillum. Laboris esse fugiat proident excepteur sit minim elit eiusmod et et aliquip consectetur ullamco. Adipisicing pariatur ad aute ipsum nulla consectetur. Aliquip sunt enim qui laboris ex labore ea eu consequat velit eiusmod reprehenderit et. Qui do nulla sit voluptate proident tempor. Non commodo incididunt ipsum pariatur excepteur.
      </el>
        <Button width={.5} height={3}> click me3</Button>
        <el width={.49} height={.99} border={{ type: BorderStyle.double }} fg="black" textWrap={true}>Duis commodo sit excepteur excepteur. Est officia commodo in aliqua sunt magna est ipsum exercitation.
      </el>
      </el>

      <el height={0.33} width={.99} bg={'yellow'} fg="black" border={{ type: BorderStyle.triangleCorners }} padding={{ top: 2, left: 1, right: 1, bottom: 2 }} layout={{ layout: Layout['topDown'], neverResizeContainer: true }} textWrap={true}>
        <el width={.99} height={0.2} textWrap={true}> Laboris commodo id proident minim est ad proident fugiat do non id velit. Esse ullamco sit elit magna et esse excepteur exercitation ut eiusmod sint sit irure enim.</el>

        <Button width={.5} height={3}> click me</Button>
        <Input width={.5} height={3} border={{ type: BorderStyle.heavy }} bg="blue" onChange={e => { }}></Input>
        <Button width={.5} height={3}> click me2</Button>

        <el width={.99} height={0.2} textWrap={true}>

          Amet sunt magna cillum cupidatat magna adipisicing enim sint. Deserunt cillum aute non aliquip voluptate sunt tempor aliqua irure consequat et eiusmod amet ullamco. Id mollit reprehenderit quis ullamco aute dolore cupidatat. Adipisicing reprehenderit sit consequat nulla.</el>
      </el>

      <Button width={.5} height={3}> click me 4</Button>

      <el height={0.46} width={.99} bg="white" fg="black" layout={{
        layout: Layout['justifiedLayout'],
        justifiedLayout: {
        }
      }}
      >
        <el height={float(.3, .7)} width={float(.33, .5)} fg={color()} border={{ type: item(borderStyles) as any }} textWrap={true}>Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} border={{ type: item(borderStyles) as any }} fg={color()} textWrap={true}>Consequat ullamco nulla nisi ex.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} textWrap={true} border={{ type: item(borderStyles) as any }} >Nisi elit quis deserunt culpa.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} textWrap={true} border={{ type: item(borderStyles) as any }} >Est aliqua sit Lorem sit occaecat excepteur sint.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} textWrap={true} border={{ type: item(borderStyles) as any }} >Cupidatat elit do ad qui in anim amet sint.</el>

        <Input width={.5} height={3} border={{ type: BorderStyle.heavy }} bg="blue" onChange={e => { }}></Input>
        <Button width={.5} height={3}> click me2</Button>0

      <el height={float(.3, .7)} width={float(.33, .5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Est aliqua sit Lorem sit occaecat excepteur sint.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Cupidatat elit do ad qui in anim amet sint.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</el>

        <el height={float(.3, .7)} width={float(.33, .5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Consequat ullamco nulla nisi ex.</el>
        <el height={float(.3, .7)} width={float(.33, .5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Nisi elit quis deserunt culpa.</el>

      </el>
    </el>
    flor.focus.installDefaultChangeFocusKeys()
    const le = flor.create(app)
    flor.render()
  } catch (error) {
    debug(error)
  }
}

test()
