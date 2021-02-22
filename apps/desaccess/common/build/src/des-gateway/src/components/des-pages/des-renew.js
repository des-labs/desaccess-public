import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import {config} from '../des-config.js';
import { validatePassword } from '../utils.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';

class DESRenew extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      renewJobToken: {type: String},
      renewSuccess: {type: Boolean},
      renewCallComplete: {type: Boolean},
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
    this.renewJobToken = '';
    this.errorMsg = '';
    this.renewSuccess = false;
    this.renewCallComplete = false;
    this.errorMessageDisplay = 'There was an error renewing your job file storage. Reload the page to try again.';
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          <iron-icon icon="vaadin:clipboard-text" style="margin-right: 1rem;"></iron-icon>
          DESaccess Job File Storage Renewal
          <paper-spinner class="big"></paper-spinner>
        </div>
        <div id="renew-content-wrapper" style="display: none;">
            ${this.renewCallComplete ? html`
              ${this.renewSuccess ? html`
                <p>Your job file storage has been successfully renewed.</p>
                ` : html`
                <p>${this.errorMessageDisplay}</p>
                `
              }
              ` : html`
              `
            }
        </div>
      </section>
      <paper-toast name="renew-fail" class="toast-position toast-error" text="Error: ${this.errorMsg}" duration="10000"></paper-toast>
    `;
  }

  stateChanged(state) {
    this.renewJobToken = state.app.renewJobToken;
  }

  firstUpdated() {
    this._validateToken();
  }

  _validateToken() {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "job/renew/" + this.renewJobToken
    const param = {
      method: "GET"
    };
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      this.shadowRoot.querySelector('paper-spinner').active = false;
      this.shadowRoot.querySelector('#renew-content-wrapper').style.display = 'block';
      this.renewCallComplete = true;
      if (data.status === "ok") {
        if (data.valid) {
          this.renewSuccess = true;
        } else {
          this.errorMessageDisplay = 'The renewal token is invalid.';
        }
        console.log(JSON.stringify(data, null, 2));
      } else {
        this.errorMessageDisplay = data.msg;
        this.errorMsg = data.msg;
        this.shadowRoot.querySelector('paper-toast[name="renew-fail"]').show();
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

}

window.customElements.define('des-renew', DESRenew);
