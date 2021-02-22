import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles, HelpStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';
import '../des-help-cutout.js';
import '../des-help-jupyter.js';
import '../des-help-tilefinder.js';
import '../des-help-tables.js';
import '../des-help-status.js';
import '../des-help-db-access.js';
import '../des-help-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import { triggerHelpForm } from '../../actions/app.js';
import { config } from '../des-config.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-toast/paper-toast.js';
import { scrollToElement } from '../utils.js';

class DESHelp extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles,
      HelpStyles,
      css`
        a {
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        .red-links a {
          color: darkred;
        }
        paper-button:hover {
          background-color: darkred;
          color: white;
        }
      `
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
      database: {type: String},
      email: {type: String},
      firstname: {type: String},
      lastname: {type: String},
      submit_disabled: {type: Boolean},
      formTopicOther: {type: Boolean},
      triggerHelpForm: {type: Boolean},
    };
  }
  constructor(){
    super();
    this.accessPages = [];
    this.database = '';
    this.email = '';
    this.firstname = '';
    this.lastname = '';
    this.formTopicOther = false;
    this.submit_disabled = true;
    this.triggerHelpForm = false;
  }

  render() {
    return html`
      <style>
        ul > li > a {
          text-decoration: none; 
          color: inherit;
        }
      </style>

      <section>
        <div style="font-size: 2rem; font-weight: bold;">DESaccess Help</div>
        <div class="horizontal layout around justified">
          <section>
            <p class="red-links">DESaccess is a collection of apps and services from the <a href="https://deslabs.ncsa.illinois.edu/" target="_blank">DES Labs</a>
            team at the <a href="http://www.ncsa.illinois.edu/" target="_blank">National Center for Supercomputing Applications</a> that
            provides multiple tools you can use to access data from
            the <a href="https://www.darkenergysurvey.org/" target="_blank">Dark Energy Survey</a>.
            </p>
            <p class="red-links">Visit the <a href="${config.frontEndUrl}docs/" target="_blank">DESaccess Documentation</a> to learn more, and contact us using the button below if you need more assistance.
            </p>
            <div style="text-align: center;">
              <paper-button @click="${(e) => {this.helpFormDialog.opened = true; }}" raised style="font-size: 1rem; margin: 1rem; padding-left: 2rem; padding-right: 2rem;"><iron-icon icon="vaadin:comments-o" style="height: 3rem; margin-right: 1rem;"></iron-icon>Contact us for help</paper-button>
            </div>
          </section>

          <section id="api-section">
            <div>
              <h3>API Documentation</h3>
              <p>Everything you can do on this website can also be done by an external client app using the DESaccess Application Programming Interface (API). See the <a href="${config.frontEndUrl}docs/api/" target="_blank">API Documentation</a> for more details.</p>
            </div>
          </section>
        </div>
      </section>
      <vaadin-dialog id="help-form-dialog"></vaadin-dialog>
      <paper-toast class="toast-position toast-success" text="Your help request was received." duration="7000"></paper-toast>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
    this.database = state.app.db;
    this.triggerHelpForm = state.app.triggerHelpForm;
    this.email = this.email === '' ? state.app.email : this.email;
    this.firstname = this.firstname === '' ? state.app.name : this.firstname;
    this.lastname = this.lastname === '' ? state.app.lastname : this.lastname;
  }

  firstUpdated() {

    this.helpFormDialog = this.shadowRoot.getElementById('help-form-dialog');
    this.helpFormDialog.renderer = (root, dialog) => {
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
            <des-help-form
              @closeHelpDialog="${(e) => {dialog.opened = false;}}"
              @showHelpSuccessMessage="${(e) => {this.shadowRoot.querySelector('paper-toast').show();}}"
            ></des-help-form>
          </div>
        `,
        container
      );
    }
    if (this.triggerHelpForm) {
      this.helpFormDialog.opened = true;
      store.dispatch(triggerHelpForm(false));
    }
  }
}

window.customElements.define('des-help',DESHelp);
