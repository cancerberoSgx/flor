import { array, repeat } from 'misc-utils-of-mine-generic'
import { Box, Button, Component, debug, ElementOfComponent, ElementProps, Flor, FlorDocument, KeyEvent, KeyPredicate, Layout, ProgramElement, InputEventTarget } from '../../../src'
import { focusableProps } from '../../../src/component/commonProps'

interface ListKeys<T extends ProgramElement = ProgramElement> {
  normalNextKeys?: KeyPredicate<T>
  normalPreviousKeys?: KeyPredicate<T>
  largeNextKeys?: KeyPredicate<T>
  largePreviousKeys?: KeyPredicate<T>
  startKeys?: KeyPredicate<T>
  endKeys?: KeyPredicate<T>
}
interface ConcreteListProps< T extends ProgramElement = ProgramElement> extends ListKeys<T> {
  // onActive?: ListActiveEventListener
  // onSelect?: ListSelectEventListener
}
interface ListProps<T extends ProgramElement = ProgramElement> extends ConcreteListProps<T>, JSX.PropsWithRef<Partial<ElementProps>> {
  // children?: ListItem[] // TODO: something is wrong with JSX typings - it doesnt allow to declare mandatory children

}
interface ListSelectEvent<T extends ProgramElement = ProgramElement> {
  selected: List[]
  previous: List[]
}

// type ListSelectEventListener = (e: ListSelectEvent) => void

// interface ListActiveEvent {
//   active: List
//   previous?: List
// }

// type ListActiveEventListener = (e: ListActiveEvent) => void

// interface ListItemSelectEvent {
//   selected: ListItem[]
//   previous: ListItem[]
// }

// type ListItemSelectEventListener = (e: ListItemSelectEvent) => void
// interface ListItemActiveEvent {
//   active: ListItem
//   previous?: ListItem
// }

// type ListItemActiveEventListener = (e: ListItemActiveEvent) => void

interface ListItemProps extends Partial<ElementProps> {
  // parent: List

  active?: boolean
  selected?: boolean
  // onActive?: ListItemActiveEventListener
  // onSelect?: ListItemSelectEventListener
}

// const  defaultProps: Required<ConcreteListProps> = {
// normalNextKeys,
// normalPreviousKeys?: KeyPredicate,
// largeNextKeys?: KeyPredicate,
// largePreviousKeys?: KeyPredicate,
// startKeys?: KeyPredicate,
// endKeys?: KeyPredicate,
// }
class ListItem extends Component<ListItemProps> {
  render() {
    return <box {...this.props} visible={false} classes={[...this.props.classes || [], 'flor.listItem']} width={.99} height={4} bg="yellow">
      {this.props.children}</box>
  }
}

class List extends Component<ListProps> {
  activeIndex = 0
  render() {
    return <box {...focusableProps()} width={12} height={6} bg="green" {...this.props} layout={{ layout: Layout.topDown }}
      focusable={true}
      onFocus={e => {
        this.updateItems({showAll: true})
      }}
      onBlur={e => {
        this.updateItems({hideAll: true})
      }}
      onKeyPressed={e => this.onKey(e)}>
      {this.props.children}
    </box>
  }
  private onKey(e: KeyEvent): boolean | void {
    if (!this.focused) {
      return
    }
    const itemElements = this.getItemListElements()
    if (e.name === 'up') {
      this.setActiveItem(this.activeIndex > 0 ? this.activeIndex - 1 : itemElements.length - 1)
    } else if (e.name === 'down') {
      this.setActiveItem(this.activeIndex < itemElements.length - 1 ? this.activeIndex + 1 : 0)
    }
  }
  private setActiveItem(index: number) {
    this.activeIndex = index
    this.updateItems()
    //TODO: props.onActive or oninput
  }

  private updateItems(o: {showAll?: boolean, hideAll?: boolean}={}) {
    const items = this.getItemListElements()
    debug(this.activeIndex, items.map(i => i.outerHTML))
    this.getItemListElements().forEach((c, i) => {
      if (o.showAll || i === this.activeIndex) {
        c.props.visible = true
      } else if(!o.hideAll) {
        c.props.visible = false
      }
    })
    this.renderElement()
  }
  // private setVisibleItems( visible =true) {
  //   this.getItemListElements().forEach((c, i) => {
  //     c.props.visible = visible;
  //   });
  // }

  private getItemListElements() {
    return this.element!.filterChildrenWithClass<ProgramElement>('flor.listItem') as ElementOfComponent<ListItem>[]
  }
}

function test() {
  let f: FlorDocument
  try {
    f = new FlorDocument({ installDefaultChangeFocusKeys: true, installLoggers: true })

    const a = f.create(
      <Box layout={{ layout: Layout.topDown, neverResizeContainer: true }} >
        <Button top={15} left={5} width={12} height={6} >button1</Button>
        <Button >button2</Button>
        <Button  >button3</Button>
        <List
        focusable={true}
        >
          {array(7).map(i => <ListItem>{repeat(10, i + '')}</ListItem>)}
        </List>
      </Box>)
    const l = f.render(a)
    f.render()
  } catch (error) {
    f!  .destroy()
    debug(JSON.stringify(error, null, 2))
  }
} 
test()
