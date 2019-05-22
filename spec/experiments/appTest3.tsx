import { RemoveProperties } from 'misc-utils-of-mine-generic'
import { BorderProps, BorderStyle, Component, debug, ElementOfComponent, ElementProps, FlorDocument, KeyEvent, ProgramElement } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { nextTick } from '../../src/util/misc'
import { int } from '../data'

async function test() {

  try {

    type Data<T extends any> = RemoveProperties<T, 'intersects' | 'impact'>
    interface Point {
      x: number, y: number
    }
    interface Rect extends Point {
      width: number, height: number
    }
    interface Object<E extends ProgramElement = ProgramElement> extends Rect {
      direction: Direction
      el?: E
      intersects(r: Rect): boolean
    }
    class ObjectImpl<E extends ProgramElement = ProgramElement> implements Object<E> {
      direction: Direction = null as any
      width: number = null as any
      height: number = null as any
      x: number = null as any
      y: number = null as any
      el?: E = null as any
      intersects(r: Rect): boolean {
        return !!this.el && this.el.intersects({ xi: r.x, yi: r.y, xl: r.x + r.width, yl: r.y + r.height })
      }
      constructor(s: Data<Object>) {
        Object.assign(this, s)
      }
    }
    interface Ship extends Object<ElementOfComponent<ShipC>> {
      health: 1 | 2 | 3
      shields: 1 | 2 | 3
      ammo: number
      isEnemy: boolean
      impact(): void
    }
    enum Direction {
      up, upRight, right, rightDown, down, downLeft, left, leftUp
    }
    interface State {
      gameOver: string | false
      interval: number
      ship: Ship
      board: Board
      enemyShips: Ship[]
      bullets: Bullet[]
    }
    interface Bullet extends Object {
      hit: boolean
    }
    class BulletImpl extends ObjectImpl implements Bullet {
      hit: boolean = false
      constructor(b: Data<Bullet>) {
        super(b)
        Object.assign(this, b)
      }
    }
    interface Board extends Rect {
      width: number, height: number
    }

    class ShipImpl extends ObjectImpl<ElementOfComponent<ShipC>> implements Ship {
      health: 1 | 2 | 3 = null as any
      shields: 1 | 2 | 3 = null as any
      ammo: number = null as any
      isEnemy: boolean = null as any

      constructor(s: Data<Ship>) {
        super(s)
        Object.assign(this, s)
      }

      impact() {
        if (this.shields > 0) {
          this.shields--
        } else {
          this.health--
        }
      }

    }
    const state: State = {
      gameOver: false,
      interval: 200,
      ship:
        new ShipImpl({ x: 10, y: 10, width: 3, height: 3, direction: Direction.up, health: 3, shields: 3, ammo: 100, isEnemy: false })
      ,
      enemyShips: [
        new ShipImpl({ x: 1, y: 1, width: 3, height: 3, direction: Direction.up, health: 3, shields: 3, ammo: 100, isEnemy: true }),
        new ShipImpl({ x: 31, y: 21, width: 3, height: 6, direction: Direction.up, health: 3, shields: 3, ammo: 100, isEnemy: true }),
        new ShipImpl({ x: 51, y: 31, width: 2, height: 1, direction: Direction.up, health: 3, shields: 3, ammo: 100, isEnemy: true })
      ],
      board: {
        width: 20, height: 20, x: 0, y: 0
      },
      bullets: []
    }

    class BoardC extends Component<{ state: State }> {
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
    class ShipC extends Component<{ state: State, ship: Ship } & Partial<ElementProps>> {

      onKeyPressed(e: KeyEvent) {
        this.move(e.name === 'up' ? Direction.up : e.name === 'down' ? Direction.down : e.name === 'right' ? Direction.right : e.name === 'left' ? Direction.left : undefined)
        if (e.name === 'space') {
          fire(this.props.ship)
        }
      }

      move(d?: Direction) {
        this.element!.erase()
        if (d === Direction.left) {
          this.moveLeft()
        } else if (d === Direction.right) {
          this.moveRight()
        } else if (d === Direction.up) {
          this.moveUp()
        } else if (d === Direction.down) {
          this.moveDown()
        }
        this.element!.render()
        return this
      }

      moveLeft() {
        this.props.ship.direction = Direction.left
        if (this.props.ship.x > 0) {
          this.props.ship.x--
          this.element!.left = this.props.ship.x
          this.element!.height = 2 // ship.height*2
          this.element!.width = 7
        }
      }

      moveRight() {
        this.props.ship.direction = Direction.right
        if (this.props.ship.x < this.props.state.board.width - 1) {
          this.props.ship.x++
          this.element!.left = this.props.ship.x
          this.element!.height = 2 // ship.height*2
          this.element!.width = 7
        }
      }

      moveDown() {
        this.props.ship.direction = Direction.down
        if (this.props.ship.y < this.props.state.board.height - 1) {
          this.props.ship.y++
          this.element!.top = this.props.ship.y
          this.element!.height = 4 // ship.width
          this.element!.width = 3
        }
      }

      moveUp() {
        this.props.ship.direction = Direction.up
        if (this.props.ship.y > 0) {
          this.props.ship.y--
          this.element!.top = this.props.ship.y
          this.element!.height = 4 // ship.width
          this.element!.width = 3
        }
      }

      render() {
        const ship = this.props.ship
        return <el fg={ship.isEnemy ? 'black' : 'white'} blink={ship.isEnemy ? true : false} bg={this.getBg()} border={this.getBorder()} height={ship.height} width={ship.height * 2} top={ship.y} left={ship.x} focusable={true} focused={true} onKeyPressed={ship.isEnemy ? undefined : e => this.onKeyPressed(e)} onceRendered={el => {
          // debug(s, !!el);
          (this.props.ship as ShipImpl).el = el as any
        }
        }>
        </el>
      }
      getBg(): string {
        return this.props.ship.health === 3 ? 'green' : this.props.ship.health === 2 ? 'yellow' : this.props.ship.health === 1 ? 'red' : 'grey'
      }
      getBorder(): Partial<BorderProps> | undefined {
        return this.props.ship.shields === 3 ? { type: BorderStyle.double } : this.props.ship.shields === 2 ? { type: BorderStyle.light } : this.props.ship.shields === 1 ? undefined : undefined
      }
    }

    function fire(ship: Ship) {
      if (ship.ammo <= 0) {
        flor.program.bell()
        return
      }
      ship.ammo--
      const b = new BulletImpl({
        ...ship as any, hit: false
      })
      b.el = Flor.render(<el left={ship.x} top={ship.y} width={1} height={1} ch="*" />)
      state.bullets.push(b)
    }

    function move(b: Object) {
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

    class Status extends Component<{ state: State }> {
      render() {
        return null
      }
    }

    class Settings extends Component<{ state: State }> {
      render() {
        return null
      }
    }

    interface P { state: State }
    class App extends Component<P>  {
      constructor(p: P, s: {}) {
        super(p, s)
        this.loop = this.loop.bind(this)
      }

      loop() {
        const state = this.props.state
        if (state.gameOver) {
          flor.debug(state.gameOver)
          setTimeout(() => {
            flor.destroy()
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
        setTimeout(this.loop, this.props.state.interval)
      }

      render() {

        return <el width={.99} height={.99} onceRendered={this.loop}
        >
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

    const flor = new FlorDocument()
    flor.focus.installDefaultChangeFocusKeys()
    const le = flor.create(<App state={state} />)
    flor.render()

  } catch (error) {
    debug(error)
  }
}

test()
