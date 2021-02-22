import { html } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import {config} from '../des-config.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

class DES404 extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      lastValidPage: {type: String}
    };
  }

  render() {
    return html`
      <section style="text-align: center;">
        <h2>Page not found!</h2>
        <p>
          <a href="${config.frontEndUrl}${this.lastValidPage}">Go back to the previous page</a> and try again?
        </p>
      </section>
    `
  }

  stateChanged(state) {
    this.lastValidPage = state.app.lastValidPage;
  }

}

window.customElements.define('des-404', DES404);
