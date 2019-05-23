// import { Component, ElementProps, Flor, KeyPredicate, StyleProps, isElement, Col, ProgramElement, FlorDocument, Box, Layout, Button, debug } from '../../../src'
// import { type } from 'os';
// import { focusableProps } from '../../../src/component/commonProps';

// interface ListKeys {
//   normalNextKeys?: KeyPredicate
//   normalPreviousKeys?: KeyPredicate
//   largeNextKeys?: KeyPredicate
//   largePreviousKeys?: KeyPredicate
//   startKeys?: KeyPredicate
//   endKeys?: KeyPredicate
// }
// interface ListProps extends Partial<ElementProps>, ListKeys {
//   children?: ListItem[]
//   onActive?: ListActiveEventListener
//   onSelect?: ListSelectEventListener
// }
// interface ListSelectEvent {
//   selected: List[]
//   previous: List[]
// }
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
// interface ListItemProps extends Partial<ElementProps> {
//   // parent: List
//   activeProps?: StyleProps
//   active?: boolean
//   selected?: boolean
//   onActive?: ListItemActiveEventListener
//   onSelect?: ListItemSelectEventListener
// }

// class ListItem extends Component<ListItemProps> {
//   render() {
//     return <box {...this.props} visible={false} classes={[...this.props.classes||[], 'flor.listItem']} width={.99} height={4}>
//     {this.props.children}</box>
//   }
// }

// class List extends Component<ListProps> {
//   activeIndex=0
//   render() {
//     return <box {...focusableProps()} width={.5} {...this.props} layout={{layout: Layout.topDown }}
//     focusable={true} onFocus={e=>{
//       e.currentTarget!.filterChildElements<ProgramElement>(c=>
//         c.hashClass('flor.listItem')).forEach((c, i)=>
//         c.props.visible=i===this.activeIndex
//         )
//       }}>
//     {this.props.children}
//     </box>
//   }
// }

// try {

//   function test(){
//     const f = new FlorDocument({installDefaultChangeFocusKeys: true})
//     const a = f.create(<Box layout={{layout: Layout.pack, neverResizeContainer: true}} >aasdasdasd
//   <Button top={15} left={5} width={12} height={6} >button1</Button>
//   <Button top={5} left={15} width={12} height={6} >button2</Button>
//   <Button top={25} left={5} width={12} height={6} >button3</Button>
//       <List top={5} left={5} width={32} height={16} focusable={true}>
//         <ListItem>laksdjlaksd</ListItem>
//         <ListItem>sdfs111</ListItem>
//       </List>
//     </Box>)
//    const l =  f.render(a)
//    f.render()
//   }
//   test()
// } catch (error) {
//   debug(error)
// }
