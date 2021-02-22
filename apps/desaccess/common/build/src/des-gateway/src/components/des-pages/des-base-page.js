import { LitElement } from 'lit-element';
import { validateEmailAddress, convertToLocalTime } from '../utils.js';

export class PageViewElement extends LitElement {
  // Only render this page if it's actually visible.
  shouldUpdate() {
    return this.active;
  }

  static get properties() {
    return {
      active: { type: Boolean }
    }
  }

  constructor(){
    super();
    this.validateEmailAddress = validateEmailAddress;
    this.convertToLocalTime = convertToLocalTime;
  }


}
