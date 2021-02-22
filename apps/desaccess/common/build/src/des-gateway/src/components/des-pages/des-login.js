import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import { render } from 'lit-html';
import '../des-register-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@cwmr/paper-password-input/paper-password-input.js'
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import { loginUser,
         logoutUser,
         navigate,
         updateDrawerPersist,
         updateDrawerState,
         getAccessPages } from '../../actions/app.js';
import {config, rbac_bindings} from '../des-config.js';
import '@polymer/paper-toast/paper-toast.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js'
import '@polymer/iron-image/iron-image.js';
import { validateEmailAddress } from '../utils.js';


class DESLogin extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      username: {type: String},
      _passwd: {type: String},
      database: {type: String},
      msg: {type: String}
    };
  }
  static get styles() {
    return [
      SharedStyles,
      css`
      :host {
        height: 300px;
      }
        .loginBox {
          border: 1px solid gray;
          padding: 15px;
          width: 520px;
          min-height: 400px;
        }

        .box-watermark-logo {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          opacity: 0.05;
          background: url('images/DESDM_logo.png');
          background-size: cover;
        }
        .card-content {
          padding-top: 0px;
          padding-bottom: 0px;
        }
      `
    ];
  }

  constructor() {
    super();
    this.database='desdr';
    this.username='';
    this._passwd='';
    this.requestThrottleId = 0;
  }

  render() {
    return html`
      <section>
        <paper-card class="loginBox">
          <div style="cursor:default;" class="box-watermark-logo"></div>
          <h2>DESaccess Login</h2>
          <div class="card-content">
            <p>
              <b>DES<i>access</i></b> is an open source set of tools created at <a href="http://deslabs.ncsa.illinois.edu/" target="_blank">NCSA</a>, used as a primary research tool by scientists around the globe, to access and analyze astronomical data from the <a href="https://www.darkenergysurvey.org/" target="_blank">Dark Energy Survey</a>. The most popular tools include querying the Oracle DB hosting the DES data and generating cutouts from astronomical images.
            </p>
            <p>
              To learn more, <a href="${config.frontEndUrl}docs/apps.html" target="_blank">explore the app docs</a> and <a href="https://des.ncsa.illinois.edu/releases/dr2" target="_blank">read the latest data release documentation</a>.
            </p>
            <hr>
          </div>
          <div class="card-content">
            ${config.desaccessInterface === 'private' ? html`` : html`
              <p>If you do not have an account, 
                <a href="#" onclick="return false;" @click="${(e) => {this.registerFormDialog.opened = true; }}">
                  click here to complete a registration form.
                </a>
              </p>
            `}
            <form id="login-form" name="login-form" onsubmit="${this._checkAndSubmit}">

            <custom-style>
              <style is="custom-style">
                input.my-input {
                  @apply --paper-input-container-shared-input-style;
                }
              </style>
            </custom-style>
            ${config.desaccessInterface !== 'private' ? html`` : html`
              <div>
                <label id="db-choice" style="font-weight: bold;">Choose database:</label>
                <div>
                  <paper-radio-group id="database-selection" selected="dessci" aria-labelledby="data-release-tag">
                    <paper-radio-button @change="${e => this.database = e.target.name}" name="dessci">dessci</paper-radio-button>
                    <paper-radio-button @change="${e => this.database = e.target.name}" name="desoper">desoper</paper-radio-button>
                  </paper-radio-group>
                </div>
              </div>
            `}
            <paper-input-container always-float-label>
              <label slot="label">Username or Email</label>
              <iron-input slot="input">
                <input class="my-input" type="text" autocomplete="username" name="username" @input="${e => this.username = e.target.value}"></input>
              </iron-input>
            </paper-input-container>
            <paper-input-container always-float-label>
              <label slot="label">Password</label>
              <iron-input slot="input">
                <input class="my-input" type="password" autocomplete="current-password" name="password" @input="${e => this._passwd = e.target.value}"></input>
              </iron-input>
            </paper-input-container>

              <br>
              <div class="container">
                <input type="submit" id="hidden-submit" @click="${this._checkAndSubmit}" value="Dummy submit button" style="display: none;"></input>
                <paper-button class="des-button" id="loginButton" raised @click="${this._checkAndSubmit}" type="submit" disabled>Login</paper-button>
                <paper-spinner id="loginSpinner"></paper-spinner>
              </div>
            </form>
            <div class="errormessage"> <b>${this.msg}</b></div>
          </div>
          <div class="card-content">
            <p>Forgot your password? 
              <a href="#" onclick="return false;" @click="${this._requestPasswordReset}">
                Click here
              </a> to request a password reset link by email.
            </p>
            <p>Need help? Contact us using the <a href="${config.frontEndUrl}help/form" target="_blank">help form</a> (login required). 
            If you are unable to login, use the help form <a href="https://des.ncsa.illinois.edu/" target="_blank">here instead</a>.
            </p> 
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 4fr; position: relative; justify-items: center;">
            <div>
            </div>
            <div>
              <a href="https://www.nsf.gov/" target="_blank" alt="NSF Logo" title="National Science Foundation">
                <iron-image src="images/NSF_4-Color_bitmap_Logo_100px.png" sizing="contain" style="width: 60px; height: 100px;"></iron-image>
              </a>
            </div>
            <div>
                <a href="http://www.ncsa.illinois.edu/" target="_blank" alt="NCSA Logo" title="National Center for Supercomputing Applications">
                <iron-image src="images/NCSA_FullColor_RGB.png" sizing="contain" style="width: 180px; height: 100px;"></iron-image>
                </a>
              </div>
            </div>
          </div>
          </paper-card>
      </section>
      <vaadin-dialog id="register-form-dialog"></vaadin-dialog>
      <paper-toast name="register" class="toast-position toast-success" text="Your registration form was received. Check your email for an activation link." duration="600000"></paper-toast>
      <paper-toast name="reset" class="toast-position toast-success" text="Password reset request received. Check your email." duration="20000"></paper-toast>
      <paper-toast name="reset-fail-username" class="toast-position toast-error" text="Please provide your username or email." duration="20000"></paper-toast>
      <paper-toast name="reset-fail-response" class="toast-position toast-error" text="There was an error processing your request. Try again later." duration="10000"></paper-toast>
      <paper-toast name="reset-in-progress-response" class="toast-position toast-error" text="Please wait to make another request." duration="5000"></paper-toast>
    `;
  }

  _checkAndSubmit(e) {
    if (this.username !== '' && this._passwd !== '') {
      this._submit();
    }
    return false;
  }

  _submit(){
    this.shadowRoot.getElementById("loginButton").disabled=true;
    this.shadowRoot.getElementById("loginSpinner").active=true;
    this.database = this.shadowRoot.getElementById('database-selection') ? this.shadowRoot.getElementById('database-selection').selected : this.database;
    const Url=config.backEndUrl + "login"
    const formData = new FormData();
    // If an email address was entered instead of username, log in with the email address
    if (validateEmailAddress(this.username)) {
      this.email = this.username;
      formData.append('email', this.email);
    } else {
      formData.append('username', this.username);
    }
    formData.append('password', this._passwd);
    formData.append('database', this.database);
    const data = new URLSearchParams(formData);
    const param = {body: data, method: "POST"};
    fetch(Url, param)
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.shadowRoot.getElementById("loginButton").disabled=false;
      this.shadowRoot.getElementById("loginSpinner").active=false;
      if (data.status == 'ok'){
        localStorage.setItem("token", data.token);
        console.log(data);
        store.dispatch(loginUser({
          "name": data.name, 
          "username": data.username,
          "lastname": data.lastname, 
          "email":data.email, 
          "session": true, 
          "db": data.db, 
          "roles": data.roles, 
          "preferences": data.preferences
        }));
        store.dispatch(navigate(decodeURIComponent(window.location.pathname),true, getAccessPages(data.roles), true));
      }
      else {
        localStorage.clear();
        store.dispatch(logoutUser());
        this.msg = data.message;

      }
    })
    .catch((error) => {
      console.log(error);
      this.msg = error;
      this.shadowRoot.getElementById("loginButton").disabled=false;
      this.shadowRoot.getElementById("loginSpinner").active=false;
    });
    return false;
  }

  _requestPasswordReset(e) {
    // Do not allow request if one was recently submitted
    if (this.requestThrottleId > 0) {
      console.log('Reset request already in progess.');
      this.shadowRoot.querySelector('paper-toast[name="reset-in-progress-response"]').show();
      return;
    }
    this.shadowRoot.querySelector('paper-spinner').active = true;
    // Submit form to backend API endpoint
    const Url=config.backEndUrl + "user/reset/request"
    if (this.username.length === 0) {
      this.shadowRoot.querySelector('paper-toast[name="reset-fail-username"]').show();
      this.shadowRoot.querySelector('paper-spinner').active = false;
      return;
    }
    let body = {};
    // If an email address was entered instead of username, request a password reset using the email address
    if (validateEmailAddress(this.username)) {
      this.email = this.username;
      body.email = this.email;
    } else {
      body.username = this.username;
    }
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
      // Stop spinner to inform that the server has responded
      this.shadowRoot.querySelector('paper-spinner').active = false;
      if (data.status === "ok") {
        this.shadowRoot.querySelector('paper-toast[name="reset"]').show();
        // Limit time between reset requests to 20 seconds to prevent accidental redundant requests
        this.requestThrottleId = window.setTimeout(() => {
          this.requestThrottleId = 0;
        }, 20000);
        // console.log(JSON.stringify(data.users, null, 2));
      } else {
        this.shadowRoot.querySelector('paper-toast[name="reset-fail-response"]').show();
        console.log(JSON.stringify(data, null, 2));
      }
    })
    .catch(error => {
      // Stop spinner to inform that the server has responded
      this.shadowRoot.querySelector('paper-spinner').active = false;
      this.shadowRoot.querySelector('paper-toast[name="reset-fail-response"]').show();
    });
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'username':
        case '_passwd':
          this.shadowRoot.getElementById('loginButton').disabled = this.username === '' || this._passwd === '';
          break;
        default:
      }
    });
  }

  firstUpdated() {
    this.shadowRoot.getElementById('login-form').onkeydown = (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        this._checkAndSubmit(e) ;
      }
    };
    this.registerFormDialog = this.shadowRoot.getElementById('register-form-dialog');
    this.registerFormDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <div style="width: 85vw; max-width: 700px; height: 85vh; max-height: 850px;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <des-register-form
              @closeRegisterDialog="${(e) => {dialog.opened = false;}}"
              @showRegisterSuccessMessage="${(e) => {this.shadowRoot.querySelector('paper-toast[name="register"]').show();}}">
            </des-register-form>
          </div>
        `,
        container
      );
    }
  }
}

window.customElements.define('des-login',DESLogin);
