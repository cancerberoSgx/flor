import { RemoveProperties } from 'misc-utils-of-mine-generic';
import { ElementOfComponent, ProgramElement } from '../../../src';
import { ShipC } from './ship';
type Data<T extends any> = RemoveProperties<T, 'intersects' | 'impact'>
interface Point {
  x: number
  y: number
}
interface Rect extends Point {
  width: number
  height: number
}
export interface Object<E extends ProgramElement = ProgramElement> extends Rect {
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
    return !!this.el && this.el.intersectsAbsolute_LTBR({ left: r.x, top: r.y, right: r.x + r.width, bottom: r.y + r.height })
  }
  constructor(s: Data<Object>) {
    Object.assign(this, s)
  }
}
export interface Ship extends Object<ElementOfComponent<ShipC>> {
  health: 1 | 2 | 3
  shields: 1 | 2 | 3
  ammo: number
  isEnemy: boolean
  impact(): void
}
export enum Direction {
  up,
  upRight,
  right,
  rightDown,
  down,
  downLeft,
  left,
  leftUp
}
export interface State {
  settings: Settings
  gameOver: string | false
  ship: Ship
  board: Board
  enemyShips: Ship[]
  bullets: Bullet[]
}
interface Bullet extends Object {
  hit: boolean
}
export interface Settings {
  speed: number
}
export class BulletImpl extends ObjectImpl implements Bullet {
  hit: boolean = false
  constructor(b: Data<Bullet>) {
    super(b)
    Object.assign(this, b)
  }
}
interface Board extends Rect {
  width: number
  height: number
}
export class ShipImpl extends ObjectImpl<ElementOfComponent<ShipC>> implements Ship {
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
export const state: State = {
  gameOver: false,
  settings: {
    speed: 200
  },
  // interval: 200,
  ship: new ShipImpl({ x: 10, y: 10, width: 3, height: 3, direction: Direction.up, health: 3, shields: 3, ammo: 100, isEnemy: false }),
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
