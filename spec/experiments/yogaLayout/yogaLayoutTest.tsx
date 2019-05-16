import { array } from 'misc-utils-of-mine-generic'
import * as yoga from 'yoga-layout'
import { Node } from 'yoga-layout'
import { debug, Flor, FlorDocument } from '../../../src'
import { color } from '../../data'

// yogaFlorTest()

function yogaFlorTest() {
  const flor = new FlorDocument()
  const { root, node1, node2 } = yogatest1(flor.program.rows, flor.program.cols)
  const box1 = <el {...root.getComputedLayout()} bg={color()}>
    <el {...node1.getComputedLayout()} bg={color()}>
    </el><el {...node2.getComputedLayout()} bg={color()}>
    </el>
  </el>
  const el = flor.create(box1)
  flor.render(el)
  setTimeout(() => {

  }, 10000)

  function yogatest1(w: number, h: number) {
    const root = Node.create()
    root.setWidth(w)
    root.setHeight(h)
    root.setJustifyContent(yoga.JUSTIFY_CENTER)
    const node1 = Node.create()
    node1.setWidth(100)
    node1.setHeight(100)
    const node2 = Node.create()
    node2.setWidth(100)
    node2.setHeight(100)
    root.insertChild(node1, 0)
    root.insertChild(node2, 1)
    root.calculateLayout(w, h, yoga.DIRECTION_LTR)
    debug(root.getComputedLayout())
    debug(node1.getComputedLayout())
    debug(node2.getComputedLayout())
    return { root, node1, node2 }
  }
}

yogaFlorText()
function yogaFlorText() {
  const flor = new FlorDocument()
  setTimeout(() => {

  }, 10000)
  const h = flor.program.rows
  const w = flor.program.cols
  const root = Node.create()
  root.setWidth(w)
  root.setHeight(h)
  root.setFlexWrap(yoga.WRAP_WRAP)
  root.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
  const text = 'Proident sunt dolor excepteur nisi enim id non anim ut minim deserunt mollit eiusmod Lorem. Irure dolore nulla eiusmod laborum do ex elit quis culpa dolore. Duis officia consequat cillum dolore et consequat est sit amet eiusmod consequat laborum. Qui anim nostrud anim consectetur. Fugiat eu sunt aliquip culpa fugiat. Quis nostrud nisi laborum voluptate esse. Sint anim laborum voluptate tempor laborum. Duis aliquip consequat adipisicing sit et anim eiusmod. Et do aliqua est nulla qui veniam eu do id. Lorem fugiat consequat laboris ipsum cupidatat qui consectetur voluptate commodo anim aliqua. Aliqua eiusmod tempor ad irure labore adipisicing aliqua. Eiusmod ut deserunt aute officia et mollit ipsum duis. Non ut magna do mollit exercitation eu consequat sit. Magna sit minim eiusmod aliquip laborum duis. Minim nulla dolore veniam velit incididunt.Tempor deserunt adipisicing ad non occaecat. Elit qui velit duis in irure aliquip tempor fugiat dolor. Labore adipisicing ea labore sunt voluptate nostrud id anim id aliqua duis voluptate nostrud. Adipisicing ipsum velit adipisicing laboris tempor in est. Eu consectetur ipsum reprehenderit ad sit laboris amet in. Voluptate nostrud ex consequat ad culpa culpa cupidatat sunt nisi nulla. Adipisicing ullamco minim nulla commodo exercitation eu nisi adipisicing duis nulla officia tempor.Proident sunt dolor excepteur nisi enim id non anim ut minim deserunt mollit eiusmod Lorem. Irure dolore nulla eiusmod laborum do ex elit quis culpa dolore. Duis officia consequat cillum dolore et consequat est sit amet eiusmod consequat laborum. Qui anim nostrud anim consectetur. Fugiat eu sunt aliquip culpa fugiat. Quis nostrud nisi laborum voluptate esse. Sint anim laborum voluptate tempor laborum. Duis aliquip consequat adipisicing sit et anim eiusmod. Et do aliqua est nulla qui veniam eu do id. Lorem fugiat consequat laboris ipsum cupidatat qui consectetur voluptate commodo anim aliqua. Aliqua eiusmod tempor ad irure labore adipisicing aliqua. Eiusmod ut deserunt aute officia et mollit ipsum duis. Non ut magna do mollit exercitation eu consequat sit. Magna sit minim eiusmod aliquip laborum duis. Minim nulla dolore veniam velit incididunt.Tempor deserunt adipisicing ad non occaecat. Elit qui velit duis in irure aliquip tempor fugiat dolor. Labore adipisicing ea labore sunt voluptate nostrud id anim id aliqua duis voluptate nostrud. Adipisicing ipsum velit adipisicing laboris tempor in est. Eu consectetur ipsum reprehenderit ad sit laboris amet in. Voluptate nostrud ex consequat ad culpa culpa cupidatat sunt nisi nulla. Adipisicing ullamco minim nulla commodo exercitation eu nisi adipisicing duis nulla officia tempor.'.split(' ')
  text.forEach((t, i) => {
    const node = Node.create()
    node.setWidth(t.length + 1)
    node.setHeight(1)
    root.insertChild(node, i)
  })
  root.calculateLayout(w, h, yoga.DIRECTION_LTR)
  array(root.getChildCount()).forEach(i => {
    const c = root.getChild(i)
    debug(c.getComputedLayout())
    const el = flor.create({ ...c.getComputedLayout(), fg: color(),   children: [text[i]] })
  })
  flor.render()
}
