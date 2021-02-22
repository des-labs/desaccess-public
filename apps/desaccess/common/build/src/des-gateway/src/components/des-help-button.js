import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import {navigate} from '../actions/app.js';
import {config} from './des-config.js';
import './des-help-cutout.js';
import './des-help-status.js';
import './des-help-tilefinder.js';
import './des-help-jupyter.js';
import './des-help-tables.js';
import './des-help-db-access.js';
import '@polymer/iron-icon/iron-icon.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js'

class DESHelpButton extends connect(store)(LitElement) {
    static get properties() {
      return {
        page: { type: String },
        accessPages: { type: Array },
        dialog: { type: Object },
      }
    }

    static get styles() {
      return [
        css`
        .help-button:hover {
          background-color: #f82a0d;
          color: white;
        }
        .help-button {
          position: absolute;
          top: 70px;
          right: 0.5rem;
          --iron-icon-width: 2.5rem;
          --iron-icon-height: 2.5rem;
          color: #f82a0d;
          border-radius: 50%;
          -moz-border-radius: 50%;
          -webkit-border-radius: 50%;
        }
        `
      ];
    }

    _openDialog(event) {
      if (['cutout', 'db-access', 'status', 'tilefinder', 'jupyter', 'tables'].indexOf(this.page) > -1) {
        this.dialog.opened = true;
      } else {
        store.dispatch(navigate(`${config.rootPath.replace(/\/+$/, '')}/help`, true, this.accessPages, true));
      }
    }

    render() {
      return html`
        <a title="Click for help" href="#" onclick="return false;">
          <div class="help-button" @click="${this._openDialog}">
              <iron-icon icon="vaadin:question-circle-o"></iron-icon>
          </div>
        </a>
        <vaadin-dialog id="help-dialog" aria-label="simple"></vaadin-dialog>
      `;
    }

    constructor() {
      super();
      this.page = '';
      this.accessPages = [];
    }

    stateChanged(state) {
      this.page = state.app.page;
      this.accessPages = state.app.accessPages;
    }

    firstUpdated() {
      this.dialog = this.shadowRoot.getElementById('help-dialog');
      this.dialog.renderer = (root, dialog) => {
        let container = root.firstElementChild;
        if (!container) {
          container = root.appendChild(document.createElement('div'));
        }
        render(
          html`
            <style>

              .dialog-content-wrapper {
                overflow-y: auto;
                width: 85vw;
                max-width: 1000px;
                max-height: 70vh;
                padding: 1rem;
              }
              .close-dialog-button {
                color: darkgray;
                text-align: right;
                margin-bottom: 1rem;
              }
              .close-dialog-button a {
                text-decoration: none;
                color: inherit;
              }
            </style>
            <div class="close-dialog-button">
              <a title="Close" href="#" onclick="return false;">
                <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close"></iron-icon>
              </a>
            </div>
            <div class="dialog-content-wrapper">
              ${this.page === 'db-access' ? html`
                <des-help-db-access></des-help-db-access>
              ` : html``}
              ${this.page === 'tables' ? html`
                <des-help-tables></des-help-tables>
              ` : html``}
              ${this.page === 'cutout' ? html`
                <des-help-cutout></des-help-cutout>
              ` : html``}
              ${this.page === 'status' ? html`
                <des-help-status></des-help-status>
              ` : html``}
              ${this.page === 'tilefinder' ? html`
                <des-help-tilefinder></des-help-tilefinder>
              ` : html``}
              ${this.page === 'jupyter' ? html`
                <des-help-jupyter></des-help-jupyter>
              ` : html``}
              ${this.page === 'ticket' ? html`
                <h3>DES Ticket Help</h3>
                <p>DESDM team members with admin privileges can use the DES Ticket app to resolve common user problems like password resets.</p>
              ` : html``}
            </div>
          `,
          container
        );
      }
    }
  }

  window.customElements.define('des-help-button', DESHelpButton);
