import { Flor } from '../../src/jsx/createElement';
import { createProgramRendererDocument } from '../../src/manager/programUtil';
import { animate, easing } from '../../src/util/anim';

const p = <el width={10} height={3} bg="red" fg="black" top={4} left={0} ch="_">
</el>
const { renderer } = createProgramRendererDocument()
const e = Flor.render(p)
renderer.renderElement(e)

animate({
  duration: 2000,
  timing: easing.bounceEasyOut(),
  draw: t => {
    renderer.eraseElement(e)
    const x = Math.round((renderer.program.cols - e.props.width) * t)
    // console.log(x)
    e.props.left = x
    renderer.renderElement(e)
  },
  lapse: 0
})
