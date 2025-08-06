import { Element } from './element';
import { cssPrefix } from '../configs';
import { t } from '../locale/locale';

export default class Button extends Element {
  // type: primary
  constructor(title, type = '') {
    super('div', `${cssPrefix}-button ${type}`);
    this.child(t(`button.${title}`));
  }
}
