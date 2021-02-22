import { html,css } from 'lit-element';
import { LitElement } from 'lit-element';
import { render } from 'lit-html';
import { SharedStyles } from './styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { config } from './des-config.js';
import { validateEmailAddress, validatePassword } from './utils.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';

class DESRegisterForm extends connect(store)(LitElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      email: {type: String},
      firstname: {type: String},
      lastname: {type: String},
      username: {type: String},
      password: {type: String},
    };
  }

  constructor() {
    super();
    this.email = '';
    this.firstname = '';
    this.lastname = '';
    this.username = '';
    this.password = '';
  }

  render() {
    return html`
      <h3><iron-icon icon="vaadin:clipboard-text" style="margin-right: 1rem;"></iron-icon>New User Registration</h3>
      <p>By submitting this form you are agreeing to our 
        <a href="https://des.ncsa.illinois.edu/terms" 
        target="popup" 
        onclick="window.open('https://des.ncsa.illinois.edu/terms','popup','width=800,height=800'); return false;">
        Terms and Conditions</a>.
      </p>
      <div style="margin: 1rem; color: red; height: 2rem;">
        <span id="invalid-form-warning"></span>
      </div>
      <div style="max-height: 70vh; overflow: auto; padding: 1rem; border: 1px lightgray solid;">
        <paper-input name="firstname" label="Given name" required value="${this.firstname}" @change="${e => this.firstname = e.target.value}"></paper-input>
        <paper-input name="lastname"  label="Family name"  required value="${this.lastname}"  @change="${e => this.lastname = e.target.value}"></paper-input>
        <paper-input name="email"     label="Email" required value="${this.email}"     @change="${e => this.email = e.target.value}"></paper-input>
        <p>Username must be between 3 and 30 characters long, containing only digits and lowercase letters, starting with a letter.</p>
        <paper-input name="username"     label="Username" required value="${this.username}"     @change="${e => this.username = e.target.value}"></paper-input>
        <p>Password must be between 10 and 30 characters long, containing only digits and uppercase and lowercase letters, starting with a letter.</p>
        <paper-input name="password"  label="Password" required type="password" value=""     @change="${e => this.password = e.target.value}"></paper-input>
        <paper-input name="password-confirm"  label="Confirm password" required type="password" value=""     @change="${e => this.passwordConfirm = e.target.value}"></paper-input>
        
        <div style="text-align: center; margin: 1rem;">
          <paper-button  name="submit-button" class="indigo" @click="${(e) => {this._submitRegisterForm(e);}}" raised disabled>Submit Form</paper-button>
          <paper-spinner class="big"></paper-spinner>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    // Attach an event listener to validate the form when any input field is being updated
    // so that the Submit button is enabled as soon as the user completes their inputs
    let validateWatcher = (event) => {
      this._validateForm();
    };
    let firstnameInput = this.shadowRoot.querySelector('paper-input[name="firstname"]');
    let lastnameInput = this.shadowRoot.querySelector('paper-input[name="lastname"]');
    let emailInput = this.shadowRoot.querySelector('paper-input[name="email"]');
    let usernameInput = this.shadowRoot.querySelector('paper-input[name="username"]');
    let passwordInput = this.shadowRoot.querySelector('paper-input[name="password"]');
    let passwordConfirmInput = this.shadowRoot.querySelector('paper-input[name="password-confirm"]');
    firstnameInput.addEventListener('keyup', validateWatcher);
    lastnameInput.addEventListener('keyup', validateWatcher);
    emailInput.addEventListener('keyup', validateWatcher);
    usernameInput.addEventListener('keyup', validateWatcher);
    passwordInput.addEventListener('keyup', validateWatcher);
    passwordConfirmInput.addEventListener('keyup', validateWatcher);

  }

  stateChanged(state) {
    this.email = this.email === '' ? state.app.email : this.email;
    this.firstname = this.firstname === '' ? state.app.name : this.firstname;
    this.lastname = this.lastname === '' ? state.app.lastname : this.lastname;
  }

  _validateForm() {
    let validForm = true;
    let criterion = true;
    let el = null;
    let el2 = null;
    // Validate email address
    el = this.shadowRoot.querySelector('paper-input[name="email"]');
    criterion = validateEmailAddress(el.value);
    this.shadowRoot.querySelector('paper-input[name="email"]').invalid = !criterion;
    validForm = criterion && validForm;

    // Validate first name
    el = this.shadowRoot.querySelector('paper-input[name="firstname"]');
    criterion = el.value.length > 0;
    el.invalid = !criterion;
    validForm = criterion && validForm;

    // Validate last name
    el = this.shadowRoot.querySelector('paper-input[name="lastname"]');
    criterion = el.value.length > 0;
    el.invalid = !criterion;
    validForm = criterion && validForm;

    // Validate username
    el = this.shadowRoot.querySelector('paper-input[name="username"]');
    criterion = this._validateUsername(el.value);
    el.invalid = !criterion;
    validForm = criterion && validForm;

    // Validate password
    el = this.shadowRoot.querySelector('paper-input[name="password"]');
    el2 = this.shadowRoot.querySelector('paper-input[name="password-confirm"]');
    criterion = validatePassword(el.value);
    el.invalid = !criterion;
    validForm = criterion && validForm;
    criterion = el.value === el2.value;
    el2.invalid = !criterion;
    validForm = criterion && validForm;

    // Set invalid form warning
    let warningElement = this.shadowRoot.querySelector('#invalid-form-warning');
    let warningMessage = validForm || this.messageText === this.initMessageText ? html`` : html`
      <iron-icon icon="vaadin:exclamation-circle" style="margin-right: 1rem;"></iron-icon>
      Please correct the invalid inputs before submitting.
    `;
    render(
      warningMessage,
      warningElement
    );

    // Enable/disable submit button
    this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = !validForm;
  }

  _validatePassword(password) {
    const re = /^[a-zA-Z]+[a-zA-Z0-9]{9,29}$/;
    return re.test(password);
  }

  _validateUsername(username) {
    const re = /^[a-z]+[a-z0-9]{2,15}$/;
    return re.test(username);
  }

  _submitRegisterForm(event) {
    // Start spinner to inform that the form is being submitted
    this.shadowRoot.querySelector('paper-spinner').active = true;
    // Disable submit button to prevent redundant submissions
    this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = true;
    // Clear any displayed warning messages
    let warningElement = this.shadowRoot.querySelector('#invalid-form-warning');
    let warningMessage = html``;
    render(warningMessage, warningElement);


    // Submit form to backend API endpoint
    const Url=config.backEndUrl + "user/register"
    let body = {
      // Get username from auth token
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'password': this.password,
      'username': this.username,
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
      // Stop spinner to inform that the server has responded
      this.shadowRoot.querySelector('paper-spinner').active = false;
      if (data.status === "ok") {
        // Send custom event up to parent web component to close the dialog
        this.dispatchEvent(new CustomEvent('closeRegisterDialog'));
        this.dispatchEvent(new CustomEvent('showRegisterSuccessMessage'));

        // console.log(JSON.stringify(data.users, null, 2));
      } else {
        // Set error message
        warningMessage = html`
          <iron-icon icon="vaadin:exclamation-circle" style="margin-right: 1rem;"></iron-icon>
          Error: ${data.msg}
        `;
        render(warningMessage, warningElement);
        this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = false;
        console.log(JSON.stringify(data, null, 2));
      }
    })
    .catch(error => {
      // Stop spinner to inform that the server has responded
      this.shadowRoot.querySelector('paper-spinner').active = false;
      // Set error message
      warningMessage = html`
        <iron-icon icon="vaadin:exclamation-circle" style="margin-right: 1rem;"></iron-icon>
        Error submitting the registration form. Wait a few seconds and try again.
      `;
      render(warningMessage, warningElement);
      this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = false;
    });
  }

}

window.customElements.define('des-register-form', DESRegisterForm);
