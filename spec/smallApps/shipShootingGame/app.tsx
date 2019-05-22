import { BorderStyle, Component, Flor, FlorDocument } from '../../../src'
import { nextTick } from '../../../src/util/misc'
import { int } from '../../data'
import { Settings, Status } from './panel'
import { ShipC } from './ship'
import { Direction, Object, State, state } from './state'
let app
interface AppProps {
  state: State
  flor: FlorDocument
}
export class App extends Component<AppProps> {
  constructor(p: AppProps, s: {}) {
    super(p, s)
    this.loop = this.loop.bind(this)
  }
  loop() {
    const state = this.props.state
    if (state.gameOver) {
      this.props.flor.debug(state.gameOver)
      setTimeout(() => {
        this.props.flor.destroy()
      }, 2000)
      return
    }
    state.bullets.forEach(b => {
      const hit = state.enemyShips.find(s => s.intersects(b))
      if (hit) {
        b.hit = true
        hit.impact()
      }
      move(b)
    })
    state.enemyShips.forEach(s => {
      if (s.intersects(state.ship)) {
        s.impact()
        state.ship.impact()
      }
      const d = int(1, 4)
      s.direction = d === 1 ? Direction.up : d === 2 ? Direction.right : d === 3 ? Direction.down : d === 4 ? Direction.left : s.direction
      s.el && s.el.getComponent().move(s.direction)
    })
    nextTick(() => {
      state.bullets = state.bullets.filter(b => !b.hit)
      state.enemyShips = state.enemyShips.filter(s => {
        if (s.health <= 0) {
          s.el!.erase()
          s.el!.remove()
          // explosion
          return false
        }
        return true
      })
      if (state.ship.health <= 0) {
        state.gameOver = 'GAME OVER - You loose'
      }
      if (state.enemyShips.length === 0) {
        state.gameOver = 'GAME OVER - You win'
      }
    })
    setTimeout(this.loop, this.props.state.settings.speed)
  }
  render() {
    return <el width={.99} height={.99} onceRendered={this.loop}>
      <el name="c1" border={{ type: BorderStyle.round }} width={.7} height={.99}>
        <BoardC state={state} />
      </el>

      <el name="c2" left={.7} width={.3} height={.99}>
        <el name="c21" border={{ type: BorderStyle.round }} width={.99} height={.6}>
          <Settings state={state} />
        </el>
        <el name="c22" border={{ type: BorderStyle.round }} width={.99} top={.6} height={.4}>
          <Status state={state} />
        </el>
      </el>
    </el>
  }
}

export function move(b: Object) {
  if (!b.el) {
    return
  }
  b.el.erase()
  if (b.direction === Direction.up) {
    b.y--
  } if (b.direction === Direction.right) {
    b.x++
  } if (b.direction === Direction.down) {
    b.y++
  } if (b.direction === Direction.left) {
    b.x--
  }
  b.el.top = b.y
  b.el.left = b.x
  b.el.render()
}

export class BoardC extends Component<{ state: State }> {
  render() {
    const board = this.props.state.board
    return <el height={.99} width={.99} top={board.y} left={board.x} onceRendered={() => {
      this.props.state.board.width = this.element!.width
      this.props.state.board.height = this.element!.height
      this.renderElement()
    }}>
      <ShipC {...this.props} ship={this.props.state.ship} />
      {this.props.state.enemyShips.map(s => <ShipC {...this.props} ship={s} />)}
    </el>
  }
}
