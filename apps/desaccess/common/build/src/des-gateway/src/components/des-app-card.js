import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './des-update-info.js';
import './des-update-pwd.js';
import { menuIcon } from './des-icons.js';
import {config} from './des-config.js';
import { store } from '../store.js';

class DESAppCard extends  connect(store)(LitElement) {

  static get properties() {
    return {
      name: { type: String },
      image: {type: String},
      alt: {type: String},
      heading: {type: String},
      desc: {type: String}
    }
  }

  static get styles() {
    return [
      css`
        paper-card {
            width: 30%;
            height: 5rem;
            margin: 0 15px 15px 0;
            border-bottom: 1px solid var(--paper-blue-200);
            --paper-card-header-color: var(--paper-red-500);
            --paper-card-background-color: var(--paper-grey-100);
        }
        paper-card:hover{
            box-shadow: 3px 3px 3px 3px #ccc;
        }
        iron-image {
            pointer-events: none;
            @apply --paper-card-header-image;
        }
        .card-header {
            @apply --paper-font-headline;
        }
        .card-light {
            color: var(--paper-grey-600);
        }
        .card-explore {
            color: var(--google-blue-500);
        }
      `
    ];
  }

  constructor(){
    super();
    this.name = 'default';
    this.image = 'default';
    this.alt = 'default';
    this.heading = 'default';
    this.desc = 'default';
  }

  render() {
    return html`
      <paper-card id="des-app-card-${this.name}" on-click="change">
      <iron-image
      src="${this.image}"
      alt="${this.alt}"
      style="width:100%; height:100%;"
      sizing="cover"></iron-image>

      <div class="card-content" id="des-app-card-${this.name}" on-click="change" >
      <div class="card-header" id="des-app-card-${this.name}" on-click="change">${this.heading}
      </div>
      <p class="card-light" id="des-app-card-${this.name}" on-click="change">${this.desc}</p>
      </div>
      </paper-card>
    `;
  }
}

window.customElements.define('des-app-card', DESAppCard);
