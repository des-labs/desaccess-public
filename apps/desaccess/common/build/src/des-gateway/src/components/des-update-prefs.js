import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { SharedStyles } from './styles/shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import {config} from './des-config.js';

// These are the actions needed by this element.
import {
  updateUserPreferences
} from '../actions/app.js';

class DESUpdatePrefs extends connect(store)(LitElement) {
  static get properties() {
    return {
      prefs: { type: Object },
      msg: { type: String },
    }
  }

  static get styles() {
    return [
    SharedStyles,
      css`
      paper-card.des-card {
        width: 100%;
      }
      `
    ];
  }

  constructor() {
    super();
    this.prefs = {};
    this.msg = '';
    // TODO: This default preference specification should be obtained from the backend
    this.defaultPrefs = {
      'hideWelcomeMessage': false,
      'sendRenewalEmails': true
    }
  }

  stateChanged(state) {
    this.prefs = state.app.preferences;
    // console.log(`stateChanged: prefs: ${JSON.stringify(this.prefs)}`)
  }
  
  firstUpdated() {
    this._fetchCurrentPreferences();
    // First apply the default values since the user preferences object is not guaranteed to include all settings
    for (let pref in this.defaultPrefs) {
      // console.log(`firstUpdated: defaultPrefs "${pref}": ${JSON.stringify(this.defaultPrefs[pref])}`);
      if (typeof(this.defaultPrefs[pref]) === 'boolean') {
        this.shadowRoot.querySelector(`paper-checkbox[name="${pref}"]`).checked = this.defaultPrefs[pref];
      }
    }
  }

  _ClickHandler(e) {
    this.dispatchEvent(new CustomEvent('dialogClickCancel'));
  }

  _submit() {
    this.shadowRoot.getElementById("UpdateAcceptButton").disabled=true;
    this.shadowRoot.getElementById("spinner").active=true;
    var token=localStorage.getItem("token");
    const Url=config.backEndUrl + "user/preference"
    let body = {
      'pref': 'all',
      'value': this.prefs
    }
    const param = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(body)
    };
    fetch(Url, param)
    .then(response => {return response.json();})
    .then(data => {
      this.msg = data.message;
      const status = data.status;
      this.shadowRoot.getElementById("UpdateAcceptButton").disabled=false;
      this.shadowRoot.getElementById("spinner").active=false;
      if (status == "ok") {
        store.dispatch(updateUserPreferences(this.prefs));
        this.msg = "Preferences updated!"
        setTimeout((e) => {this._ClickHandler(e);}, 1500);
      } else {
        this.msg = "Error updating preferences. Try again in a few moments."
      }
    })
    .catch((error) => {console.log(error);});
  }

  _fetchCurrentPreferences() {
    this.shadowRoot.getElementById("spinner").active=true;
    this.shadowRoot.querySelector('.card-content').style.display = 'none';
    var token=localStorage.getItem("token");
    const Url=config.backEndUrl + "user/preference"
    let body = {
      'pref': 'all'
    }
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(body)
    };
    fetch(Url, param)
    .then(response => {return response.json();})
    .then(data => {
      this.shadowRoot.getElementById("spinner").active=false;
      this.shadowRoot.querySelector('.card-content').style.display = 'block';
      if (data.status == "ok") {
        this.prefs = data.pref;
        store.dispatch(updateUserPreferences(this.prefs));
        // Overwrite these values with the user's custom preferences
        for (let pref in this.prefs) {
          // console.log(`pref "${pref}": ${JSON.stringify(this.prefs[pref])}`);
          if (typeof(this.prefs[pref]) === 'boolean') {
            this.shadowRoot.querySelector(`paper-checkbox[name="${pref}"]`).checked = this.prefs[pref];
          }
        }
        // console.log(JSON.stringify(data, null, 2));
      } else {
        this.msg = "Error fetching preferences. Refresh page.";
        console.log(JSON.stringify(data, null, 2));
      }
    })
    .catch((error) => {console.log(error);});
  }

  render() {
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    viewportHeight = viewportHeight === 0 ? 1000 : viewportHeight;
    return html`
      <paper-card style="overflow-y: auto; overflow-x: auto; height: ${0.8*viewportHeight}px;" class="des-card" heading="Preferences" elevation="0">
        <div class="card-content">
          <paper-checkbox name="sendRenewalEmails" value="enabled" @change="${(e) => {this.prefs[e.target.name] = e.target.checked;}}">Send job file storage renewal emails<br />(one per job per renewal period)</paper-checkbox>
          <br>
          <paper-checkbox name="hideWelcomeMessage" value="enabled" @change="${(e) => {this.prefs[e.target.name] = e.target.checked;}}">Hide the initial login welcome message</paper-checkbox>
          <div class="card-actions" style="margin-top: 2rem;">
            <paper-button id="UpdateAcceptButton" class="des-button" raised @click="${this._submit}">Save Changes</paper-button>
            <paper-button class="des-button" raised dialog-dismiss @click="${(e) => {this._ClickHandler(e)}}">Cancel</paper-button>
            
          </div>
          <div class="errormessage"> <b>${this.msg}</b></div>
        </div>
        <paper-spinner id=spinner></paper-spinner>
      </paper-card>
    `;
  }

}

window.customElements.define('des-update-prefs', DESUpdatePrefs);
