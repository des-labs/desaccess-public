import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import {config} from '../des-config.js';
import '@polymer/paper-spinner/paper-spinner.js';

class DESActivate extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      activationToken: {type: String},
      activated: {type: Boolean},
      activation_checked: {type: Boolean},
    };
  }
  static get styles() {
    return [
      SharedStyles,
      css`
      `
    ];
  }

  constructor() {
    super();
    this.activationToken = '';
    this.activated = false;
    this.activation_checked = false;
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DESaccess Account Activation
          <paper-spinner class="big"></paper-spinner>
        </div>
        ${this.activation_checked ? html`
          ${this.activated ? html`
            <p>Your account has been activated. You may proceed to the <a href="${config.frontEndUrl + "login"}">login page</a>.</p>
            ` : html`
            <p>Invalid or expired activation token.</p>
            `
          }
          ` : html`
            <p>Your activation token is being validated. Please wait...</p>
          `
        }
      </section>
    `;
  }

  stateChanged(state) {
    this.activationToken = state.app.activationToken;
  }

  firstUpdated() {
    this._activateAccount()
  }


  _activateAccount() {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "user/activate"
    let body = {
      'token': this.activationToken
    };
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      this.activation_checked = true;
      this.shadowRoot.querySelector('paper-spinner').active = false;
      if (data.status === "ok" && data.activated === true) {
        // console.log(JSON.stringify(data.users, null, 2));
        this.activated = true;
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }
}

window.customElements.define('des-activate',DESActivate);
