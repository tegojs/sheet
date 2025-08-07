import Item from './item';

export default class DropdownItem extends Item {
  dropdown() {}

  getValue(v) {
    return v;
  }

  element() {
    this.dd = this.dropdown();
    this.dd.change = (it) => this.change(this.tag, this.getValue(it));
    return super.element().child(this.dd);
  }

  setState(v) {
    if (v) {
      this.value = v;
      this.dd.setTitle(v);
    }
  }
}
