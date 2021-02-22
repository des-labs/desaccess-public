import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import { config } from '../des-config.js';

class DESHome extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
      database: {type: String},
      preferences: {type: Object},
      alphaWelcomeDialog: {type: Object}
    };
  }
  constructor() {
    super();
    this.accessPages = [];
    this.database = '';
    this.preferences = {};
    this.alphaWelcomeDialog = {};
    this.welcomeMessageShown = false;
  }

  render() {
    return html`
      <section>
        <div class="horizontal layout around justified">
          ${this.accessPages.includes('db-access') ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="db-access" tabindex="-1">
              <des-home-card heading="DB ACCESS" image="images/home-query.png" alt="Query" desc="Oracle DB web client" name="query" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('tables') ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="tables" tabindex="-1">
              <des-home-card heading="DES TABLES" image="images/home-tables-tobias-fischer-on-unsplash.jpg" alt="DB Tables" desc="DB Table Explorer" name="tables" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('tilefinder') && this.database !== 'desoper' ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="tilefinder" tabindex="-1">
              <des-home-card heading="DES TILEFINDER" image="images/home-footprint.png" alt="TileFinder" desc="Tile Search and File Finder" name="tilefinder" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('cutout') && this.database !== 'desoper' ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="cutout" tabindex="-1">
              <des-home-card heading="CUTOUT SERVICE" image="images/home-coadd.png" alt="Bulk Cutout Service" desc="Generate cutout images" name="cutout" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('status') ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="status" tabindex="-1">
              <des-home-card heading="JOB STATUS" image="images/home-jobs.png" alt="Job Status" desc="List of submitted jobs" name="status" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('jupyter') ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="jupyter" tabindex="-1">
              <des-home-card heading="JUPYTER LAB" image="images/home-jupyter.jpg" alt="JupyterLab" desc="Personal Jupyter server" name="status" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('ticket') ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="ticket" tabindex="-1">
              <des-home-card heading="DES TICKET" image="images/decam.jpg" alt="DES Ticket" desc="DES database account management" name="ticket" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('users') ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="users" tabindex="-1">
              <des-home-card heading="DES USERS" image="images/users_app_art.png" alt="User Management" desc="DES user management" name="users" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('notifications') ? html`
            <a style="text-decoration: none; text-transform: none; color:black;" href="notifications" tabindex="-1">
              <des-home-card heading="DES NOTIFICATIONS" image="images/notifications_app_art.png" alt="Notifications Management" desc="DES notifications" name="notifications" ></des-home-card>
            </a>
          ` : html``}
          <a style="text-decoration: none; text-transform: none; color:black;" href="help" tabindex="-1">
            <des-home-card heading="HELP" image="images/home-help.jpg" alt="Help" desc="View documentation and seek help" name="help" ></des-home-card>
          </a>
        </div>
      </section>
      <vaadin-dialog></vaadin-dialog>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
    this.database = state.app.db;
    this.preferences = state.app.preferences;
  }

  firstUpdated() {
    this.dismissWelcomeMessage = this._dismissWelcomeMessage.bind(this); // need this to invoke class methods in renderers
    this.alphaWelcomeDialog = this.shadowRoot.querySelector('vaadin-dialog');
    this.alphaWelcomeDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <style>
          </style>
          <div style="max-width: 1000px; width: 85vw; max-height: 80vh;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h2>Welcome to the new <i>DESaccess !</i></h2>
            <div style="max-height: 70vh; overflow: auto; padding-left: 1rem; padding-right: 3rem; padding-bottom: 2rem;">
              <p>Welcome to the updated Dark Energy Survey data access service. We have revamped this website as well as the <a href="${config.frontEndUrl}docs" target="_blank">DESaccess API</a> to both enhance
              the service and ensure its long term sustainability.</p>
              <p>If you encounter problems, first take a look at the available documentation by pressing the red Help button
                <iron-icon icon="vaadin:question-circle-o" style="color: red;"></iron-icon>
              in the upper right corner of the page. If you think you have discovered a bug, or if you simply have suggestions
              for how to make DESaccess better, please <a href="${config.frontEndUrl}help/form" @click="${(e) => {dialog.opened = false;}}">contact us using the Help Request form</a>.</p>
              <p>As we continue to make improvements and roll out new features, we will inform you of the changes
              via this site using the new notification system. A notification icon <iron-icon icon="vaadin:bell" style="color: auto;"></iron-icon> in the toolbar will signal when you have new messages. 
              Occasionally we may also send important announcements by email.</p>
              <p>Sincerely,<br><b>DES Labs Team</b></p>
              
              <div style="position: absolute; right: 50px;bottom: 25px;">
                <a title="Do not show this message again" href="#" onclick="return false;" style="color: inherit;font-size: 1rem;text-decoration: none;" @click="${this.dismissWelcomeMessage}">
                  <iron-icon style="margin-right: 0.2rem;width: 1rem;" icon="vaadin:envelope-open-o"></iron-icon>
                  Do not show this message again
                </a>
              </div>
            </div>
          </div>
        `,
        container
      );
    }
    // if (this.alphaWelcomeDialog && !this.welcomeMessageShown && this.preferences != null && !this.preferences.preferencesNotYetFetched && this.preferences.hideWelcomeMessage != true) { 
    
    // var welcomeDialogIntervalId = window.setInterval(() => {
    //   console.log(this.preferences);
    //   if (this.alphaWelcomeDialog && !this.welcomeMessageShown && this.preferences != null && !this.preferences.preferencesNotYetFetched && this.preferences.hideWelcomeMessage != true) { 
    //     this.alphaWelcomeDialog.opened = true;
    //     this.welcomeMessageShown = true;
    //     window.clearInterval(welcomeDialogIntervalId);
    //   }
    // }, 300);
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'preferences':
          if (this.alphaWelcomeDialog && !this.welcomeMessageShown && this.preferences != null && !this.preferences.preferencesNotYetFetched && this.preferences.hideWelcomeMessage != true) { 
            this.alphaWelcomeDialog.opened = true;
            this.welcomeMessageShown = true;
          }
          break;
        default:
      }
    });
  }

  _dismissWelcomeMessage(event) {
    // Close the welcome dialog
    this.alphaWelcomeDialog.opened = false;

    // Update the user preference value
    const Url=config.backEndUrl + "user/preference"
    let body = {
      'pref': 'hideWelcomeMessage',
      'value': true
    };
    const param = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(body)
    };
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        // console.log(JSON.stringify(data.users, null, 2));
        return;
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }
}

window.customElements.define('des-home',DESHome);
