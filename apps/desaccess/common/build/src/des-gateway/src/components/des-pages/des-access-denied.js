import { html } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

class DESAccessDenied extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
    };
  }

  render() {
    return html`
      <section style="text-align: center;">
        <h2>Access Denied</h2>
        <p>
          Your account has not been granted access to DESaccess. Contact the <a href="https://deslabs.ncsa.illinois.edu/">DES Labs team</a> for assistance.
        </p>
      </section>
    `
  }

}

window.customElements.define('des-access-denied', DESAccessDenied);
