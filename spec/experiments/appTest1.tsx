import { BorderStyle, borderStyles, debug, FlorDocument, Input, Layout } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { color, float, item } from '../data'

try {
  const flor = new FlorDocument()
  flor.renderer.program.enableMouse()
  flor.body.props.assign({ top: 0, left: 0, width: flor.program.cols, height: flor.program.rows })
  flor.render()
  const app = <box width={.99} height={.999} bg="gray" fg="green" border={{ type: BorderStyle.round }} layout={{ layout: Layout['top-down'], neverResizeContainer: true }}>

    <box height={.19}  width={.99} left={0} padding={{ bottom: 1, top: 1, left: 1, right: 1 }} border={{ type: BorderStyle.round }} bg="red" layout={{ layout: Layout['left-right'], neverResizeContainer: true }}
    >
    <box width={.49} height={.99} border={{ type: BorderStyle.double }} bg="blue" textWrap={true}>
       Do ad sunt est cillum. Laboris esse fugiat proident excepteur sit minim elit eiusmod et et aliquip consectetur ullamco. Adipisicing pariatur ad aute ipsum nulla consectetur. Aliquip sunt enim qui laboris ex labore ea eu consequat velit eiusmod reprehenderit et. Qui do nulla sit voluptate proident tempor. Non commodo incididunt ipsum pariatur excepteur.
      </box>
      <box width={.49} height={.99}   border={{ type: BorderStyle.double }} fg="black"   textWrap={true}>Duis commodo sit excepteur excepteur. Est officia commodo in aliqua sunt magna est ipsum exercitation. Fugiat nulla dolore deserunt est anim labore et duis anim reprehenderit ex non proident tempor. Culpa aute ex ad eu. Elit ut excepteur veniam nostrud cillum minim aliqua ullamco id. Nulla qui velit officia dolor sint. Nulla sint quis eu id mollit adipisicing.
      </box>
</box>

    <box height={0.33} width={.99} bg={'yellow'} fg="black" border={{ type: BorderStyle.triangleCorners }} padding={{ top: 2, left: 1, right: 1, bottom: 2 }} layout={{ layout: Layout['top-down'], neverResizeContainer: true }} textWrap={true}>
   <box width={.99}  height={0.2} textWrap={true}> Laboris commodo id proident minim est ad proident fugiat do non id velit. Esse ullamco sit elit magna et esse excepteur exercitation ut eiusmod sint sit irure enim. Proident excepteur quis elit incididunt eiusmod excepteur veniam eiusmod duis adipisicing velit qui tempor mollit. Elit qui non labore laborum do eu nulla adipisicing fugiat aliqua nisi voluptate. Ex Lorem sit laboris veniam id id cillum fugiat ad aliquip consequat cupidatat in duis. Est et duis pariatur sit aute id consequat velit velit tempor reprehenderit.</box>
    <Input width={.5} height={3} border={{ type: BorderStyle.heavy }} bg="blue" onChange={e => flor.debug(e.value)}></Input>
    <box width={.99}  height={0.2} textWrap={true}>     Amet sunt magna cillum cupidatat magna adipisicing enim sint. Deserunt cillum aute non aliquip voluptate sunt tempor aliqua irure consequat et eiusmod amet ullamco. Id mollit reprehenderit quis ullamco aute dolore cupidatat. Adipisicing reprehenderit sit consequat nulla.</box>
      </box>

    <box height={0.46} width={.99}  bg="white" fg="black" layout={{ layout: Layout['justified-layout'] ,
      justifiedLayout: {
      // boxSpacing: {horizontal: 1, vertical: 1},
    // targetRowHeight: 10, targetRowHeightTolerance: 0
      }
    }}
    >
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} border={{ type: item(borderStyles) as any }} textWrap={true}>Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</box>
      <box height={float(.3,.7)} width={float(.33,.5)}  border={{ type: item(borderStyles) as any }} fg={color()}textWrap={true}>Consequat ullamco nulla nisi ex.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} textWrap={true} border={{ type: item(borderStyles) as any }} >Nisi elit quis deserunt culpa.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} textWrap={true} border={{ type: item(borderStyles) as any }} >Est aliqua sit Lorem sit occaecat excepteur sint.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} textWrap={true} border={{ type: item(borderStyles) as any }} >Cupidatat elit do ad qui in anim amet sint.</box>

      <box height={float(.3,.7)} width={float(.33,.5)}  fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} bg={''} >Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</box>
      <box height={float(.3,.7)} width={float(.33,.5)}  fg={color()}textWrap={true} border={{ type: item(borderStyles) as any }} >Consequat ullamco nulla nisi ex.</box>
      <box height={float(.3,.7)} width={float(.33,.5)}  fg={color()}textWrap={true} border={{ type: item(borderStyles) as any }} >Nisi elit quis deserunt culpa.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Est aliqua sit Lorem sit occaecat excepteur sint.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Cupidatat elit do ad qui in anim amet sint.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()}  textWrap={true} border={{ type: item(borderStyles) as any }} >Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</box>
      {/* <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Consequat ullamco nulla nisi ex.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Nisi elit quis deserunt culpa.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Est aliqua sit Lorem sit occaecat excepteur sint.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Cupidatat elit do ad qui in anim amet sint.</box> */}

      <box height={float(.3,.7)} width={float(.33,.5)}  fg={color()} textWrap={true} border={{ type: item(borderStyles) as any }} >Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</box>
      <box height={float(.3,.7)} width={float(.33,.5)}  fg={color()}textWrap={true} border={{ type: item(borderStyles) as any }} >Consequat ullamco nulla nisi ex.</box>
      <box height={float(.3,.7)} width={float(.33,.5)}  fg={color()}textWrap={true} border={{ type: item(borderStyles) as any }} >Nisi elit quis deserunt culpa.</box>
      {/* <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Est aliqua sit Lorem sit occaecat excepteur sint.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Cupidatat elit do ad qui in anim amet sint.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()}  textWrap={true} border={{ type: item(borderStyles) as any}} >Sunt ea ex dolor qui nulla ipsum cillum eiusmod nulla ea occaecat velit.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Consequat ullamco nulla nisi ex.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Nisi elit quis deserunt culpa.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Est aliqua sit Lorem sit occaecat excepteur sint.</box>
      <box height={float(.3,.7)} width={float(.33,.5)} fg={color()} textWrap={true} border={{ type: item(borderStyles) as any}} >Cupidatat elit do ad qui in anim amet sint.</box> */}

      </box>
  </box>
  flor.program.hideCursor()
  const le = flor.create(app)
  flor.render()
} catch (error) {
  debug(error)
}
