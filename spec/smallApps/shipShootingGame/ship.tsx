import { BorderProps, BorderStyle, Component, ElementProps, KeyEvent } from '../../../src';
import { Flor } from '../../../src/jsx/createElement';
import { State, Ship, BulletImpl, state, Direction, ShipImpl } from "./state";
let ship;
export class ShipC extends Component<{
  state: State;
  ship: Ship;
} & Partial<ElementProps>> {
  fire() {
    if (this.props.ship.ammo <= 0) {
      this.program!.bell();
      return;
    }
    this.props.ship.ammo--;
    const b = new BulletImpl({
      ...this.props.ship as any, hit: false
    });
    b.el = Flor.render(<el left={this.props.ship.x} top={this.props.ship.y} width={1} height={1} ch="*" />);
    state.bullets.push(b);
  }
  onKeyPressed(e: KeyEvent) {
    this.move(e.name === 'up' ? Direction.up : e.name === 'down' ? Direction.down : e.name === 'right' ? Direction.right : e.name === 'left' ? Direction.left : undefined);
    if (e.name === 'space') {
      this.fire();
    }
  }
  move(d?: Direction) {
    this.element!.erase();
    if (d === Direction.left) {
      this.moveLeft();
    }
    else if (d === Direction.right) {
      this.moveRight();
    }
    else if (d === Direction.up) {
      this.moveUp();
    }
    else if (d === Direction.down) {
      this.moveDown();
    }
    this.element!.render();
    return this;
  }
  moveLeft() {
    this.props.ship.direction = Direction.left;
    if (this.props.ship.x > 0) {
      this.props.ship.x--;
      this.element!.left = this.props.ship.x;
      this.element!.height = 2; // ship.height*2
      this.element!.width = 7;
    }
  }
  moveRight() {
    this.props.ship.direction = Direction.right;
    if (this.props.ship.x < this.props.state.board.width - 1) {
      this.props.ship.x++;
      this.element!.left = this.props.ship.x;
      this.element!.height = 2; // ship.height*2
      this.element!.width = 7;
    }
  }
  moveDown() {
    this.props.ship.direction = Direction.down;
    if (this.props.ship.y < this.props.state.board.height - 1) {
      this.props.ship.y++;
      this.element!.top = this.props.ship.y;
      this.element!.height = 4; // ship.width
      this.element!.width = 3;
    }
  }
  moveUp() {
    this.props.ship.direction = Direction.up;
    if (this.props.ship.y > 0) {
      this.props.ship.y--;
      this.element!.top = this.props.ship.y;
      this.element!.height = 4; // ship.width
      this.element!.width = 3;
    }
  }
  render() {
    const ship = this.props.ship;
    return <el fg={ship.isEnemy ? 'black' : 'white'} blink={ship.isEnemy ? true : false} bg={this.getBg()} border={this.getBorder()} height={ship.height} width={ship.height * 2} top={ship.y} left={ship.x} focusable={true} focused={true} onKeyPressed={ship.isEnemy ? undefined : e => this.onKeyPressed(e)} onceRendered={el => {
      (this.props.ship as ShipImpl).el = el as any;
    }}>
    </el>;
  }
  getBg(): string {
    return this.props.ship.health === 3 ? 'green' : this.props.ship.health === 2 ? 'yellow' : this.props.ship.health === 1 ? 'red' : 'grey';
  }
  getBorder(): Partial<BorderProps> | undefined {
    return this.props.ship.shields === 3 ? { type: BorderStyle.double } : this.props.ship.shields === 2 ? { type: BorderStyle.light } : this.props.ship.shields === 1 ? undefined : undefined;
  }
}
