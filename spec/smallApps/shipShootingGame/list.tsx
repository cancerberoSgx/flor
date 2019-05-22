import { Component, ElementProps, StyleProps, KeyPredicate, Flor } from '../../../src';

interface ListKeys {
  normalNextKeys?: KeyPredicate;
  normalPreviousKeys?: KeyPredicate;
  largeNextKeys?: KeyPredicate;
  largePreviousKeys?: KeyPredicate;
  startKeys?: KeyPredicate;
  endKeys?: KeyPredicate;
}
interface ListProps extends Partial<ElementProps>, ListKeys {
  children: ListItem[];
  onActive?: ListActiveEventListener;
  onSelect?: ListSelectEventListener;
}
interface ListSelectEvent {
  selected: List[];
  previous: List[];
}
type ListSelectEventListener = (e: ListSelectEvent) => void;
interface ListActiveEvent {
  active: List;
  previous?: List;
}
type ListActiveEventListener = (e: ListActiveEvent) => void;
class List extends Component<ListProps> {
  render() {
    return <box {...this.props}>{this.props.children}</box>
  }
}
interface ListItemSelectEvent {
  selected: ListItem[];
  previous: ListItem[];
}
type ListItemSelectEventListener = (e: ListItemSelectEvent) => void;
interface ListItemActiveEvent {
  active: ListItem;
  previous?: ListItem;
}
type ListItemActiveEventListener = (e: ListItemActiveEvent) => void;
interface ListItemProps extends Partial<ElementProps> {
  parent: List;
  activeProps?: StyleProps;
  active?: boolean;
  selected?: boolean;
  onActive?: ListItemActiveEventListener;
  onSelect?: ListItemSelectEventListener;
}
class ListItem extends Component<ListItemProps> {
  render() {
    return <box {...this.props}></box>;
  }
}
