import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';
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
import '@vaadin/vaadin-dialog/vaadin-dialog.js'
import './des-update-info.js';
import './des-update-pwd.js';
import './des-update-prefs.js';
import './des-app-card.js';
import './des-help-button.js';
import { menuIcon } from './des-icons.js';
import {config} from './des-config.js';
import { store } from '../store.js';

class DESToolBar extends connect(store)(LitElement) {
    static get properties() {
      return {
        name: { type: String },
        db: { type: String },
        page: { type: String },
        _profile: { type: Boolean },
        notifications: { type: Array },
      }
    }

    static get styles() {
      return [
        css`

        .toolbar-top {
          background-color: black;
          font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-weight: normal;
          font-style: normal;
          color: white;
        }

        .apps {
          width: 100px;
          left: 0px;
          position: absolute;
        }
        .apps-menu-content {

        }

        .profileItem {
          font-size: 10px;
          --paper-item-focused: {
              font-weight: normal;
          --paper-item-selected-weight: normal;
              };
        }

        .profileItem a,
        paper-listbox a {
          color: inherit;
          text-decoration: none;
        }
        paper-listbox paper-item:hover {
          background-color: lightgray;
        }

        .profile {
          width: 100px;
          right: 20px;
          position: absolute;
        }

        .profile-listbox {
          right: 80px;
          font-size: 0.8em;

        }

        .profile-icon{
          margin-left: 30px;
          --iron-icon-width: 44px;
          --iron-icon-height: 44px;
        }

        [main-wide-title] {
          display: none;
          margin-left: 256px;
        }


        .menu-btn {
          background: none;
          border: none;
          fill: white;
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        @media (min-width: 1001px) {

          .menu-btn {
            display: none;
          }

          [main-wide-title] {
            padding-right: 0px;
            display: block;
          }
          [main-narrow-title] {
            display: none;
          }
        }


        `
      ];
    }

    _ClickHandler(e) {
      this.dispatchEvent(new CustomEvent('clickMenu'));
    }

    _closeUpdateProfileDialog(event) {
      this.shadowRoot.getElementById('UpdateProfileDialog').opened = false;
      this.shadowRoot.getElementById('ChangePasswordDialog').opened = false;
      this.shadowRoot.getElementById('UpdatePrefsDialog').opened = false;
    }

    _updateProfileRenderer(root, dialog) {
      let container = root.firstElementChild;
      if (container) {
        root.removeChild(root.childNodes[0]);
      }
      container = root.appendChild(document.createElement('div'));
      render(
        html`
          <des-update-info @dialogClickCancel="${(e) => {this._closeUpdateProfileDialog(e)}}"></des-update-info>
        `,
        container
      )
    }

    _changePasswordRenderer(root, dialog) {
      let container = root.firstElementChild;
      if (container) {
        root.removeChild(root.childNodes[0]);
      }
      container = root.appendChild(document.createElement('div'));
      render(
        html`
          <des-update-pwd @dialogClickCancel="${(e) => {this._closeUpdateProfileDialog(e)}}"></des-update-pwd>
        `,
        container
      )
    }

    _updatePrefsRenderer(root, dialog) {
      let container = root.firstElementChild;
      if (container) {
        root.removeChild(root.childNodes[0]);
      }
      container = root.appendChild(document.createElement('div'));
      render(
        html`
          <des-update-prefs @dialogClickCancel="${(e) => {this._closeUpdateProfileDialog(e)}}"></des-update-prefs>
        `,
        container
      )
    }

    render() {
      return html`
        <style>

        .title-name {
          color: white;
          /* font-weight: bold; */
          font-style: italic;
        }
        .title-first-letter {
          color: white;
          font-weight: bold;
        }
        .title-other-letters {
          color: lightgray;
        }
        #message-notification-icon {
          display: inline-block;
          position: absolute;
          right: 180px;
          font-size: 1rem;
          font-weight: bold;
          color: darkgray;
        }
        #message-notification-icon > a {
          color: darkgray;
          text-decoration: none;
          transition: color 0.7s;

        }
        </style>
        <vaadin-dialog id="UpdateProfileDialog" aria-label="simple"></vaadin-dialog>
        <vaadin-dialog id="UpdatePrefsDialog" aria-label="simple"></vaadin-dialog>
        <vaadin-dialog id="ChangePasswordDialog" aria-label="simple"></vaadin-dialog>
        <vaadin-dialog id="notifications-dialog"></vaadin-dialog>

        <app-toolbar class="toolbar-top" sticky>
          <button class="menu-btn" title="Menu" @click="${this._ClickHandler}">${menuIcon}</button>
          <div main-wide-title>
            <span class="title-first-letter">DES</span><span class="title-name">access</span>
            <!-- <span class="title-first-letter">D</span><span class="title-other-letters">ARK</span> <span class="title-first-letter">E</span><span class="title-other-letters">NERGY</span> <span class="title-first-letter">S</span><span class="title-other-letters">URVEY</span> <span class="title-name">DESaccess (alpha)</span> -->
          </div>
          <div main-narrow-title>
            <span class="title-first-letter">DES</span><span class="title-name">access</span>
          </div>

          ${this._profile ? html`
            <div id="message-notification-icon" @click="${this._showNotifications}">
              <a title="View notifications" onclick="return false;" href="#">
                <iron-icon icon="vaadin:bell"></iron-icon>
              </a>
            </div>
            <div style="display: inline-block; color: white; position: absolute; right: 110px; font-size: 1rem; font-weight: bold;">
            ${this.name}
            <div style="font-size: 0.8rem; font-style: italic; text-align: center; text-transform: uppercase; font-weight: normal;">${this.db}</div>
            </div>
            <paper-menu-button class="profile">
              <iron-icon class="profile-icon" icon="account-circle" slot="dropdown-trigger"></iron-icon>
              <iron-icon style="margin-left:-5px;" icon="arrow-drop-down" slot="dropdown-trigger" alt="menu"></iron-icon>
              <paper-listbox class="profile-listbox" slot="dropdown-content">
                <a title="Update profile info" href="#" onclick="return false;"><paper-item class="profileItem" @click="${(e) => {this.shadowRoot.getElementById('UpdateProfileDialog').opened = true;}}">Update Profile</paper-item></a>
                <a title="Update preferences" href="#" onclick="return false;"><paper-item class="profileItem" @click="${(e) => {this.shadowRoot.getElementById('UpdatePrefsDialog').opened = true;}}">Update Preferences</paper-item></a>
                <a title="Change password" href="#" onclick="return false;"><paper-item class="profileItem" @click="${(e) => {this.shadowRoot.getElementById('ChangePasswordDialog').opened = true;}}">Change Password</paper-item></a>
                <a title="Logout" href="#" onclick="return false;"><paper-item class="profileItem" @click="${ (e) => {window.location.href = config.frontEndUrl + 'logout';}}">Log out</paper-item></a>
              </paper-listbox>
            </paper-menu-button>

          ` : html``}

          ${['help', 'login', 'logout'].indexOf(this.page) === -1 ? html`
            <des-help-button></des-help-button>
          ` : html``}
        </app-toolbar>
      `;
    }

    constructor() {
      super();
      this._profile = false;
      this.page = '';
      this.db = '';
      this.notifications = [];
      this._updateProfileRenderer = this._updateProfileRenderer.bind(this); // need this to invoke class methods in renderers
      this._changePasswordRenderer = this._changePasswordRenderer.bind(this); // need this to invoke class methods in renderers
      this._updatePrefsRenderer = this._updatePrefsRenderer.bind(this); // need this to invoke class methods in renderers
      this.messagesFetched = false;
      this.newMessages = false;
    }

    stateChanged(state) {
      this._profile = state.app.session;
      if (!this.messagesFetched && this._profile && localStorage.getItem("token")) {
        this.messagesFetched = true;
        this._fetchNotifications('new', () => {
          this.hideDismissButton = false;
        });
      }
      this.page = state.app.page;
      this.db = state.app.db;
    }

    firstUpdated() {
      this.shadowRoot.getElementById('UpdateProfileDialog').renderer = this._updateProfileRenderer;
      this.shadowRoot.getElementById('ChangePasswordDialog').renderer = this._changePasswordRenderer;
      this.shadowRoot.getElementById('UpdatePrefsDialog').renderer = this._updatePrefsRenderer;

      this.notificationsDialog = this.shadowRoot.querySelector('#notifications-dialog');
      this.notificationsDialog.renderer = (root, dialog) => {
        let container = root.firstElementChild;
        if (!container) {
          container = root.appendChild(document.createElement('div'));
        }
        render(
          html`
            <style>
              .change-icon {
                display: inline-block;
              }
              .change-icon > a > .toggle-icon + .toggle-icon,
              .change-icon:hover > a > .toggle-icon {
                display: none;
              }
              .change-icon:hover > a > .toggle-icon + .toggle-icon {
                display: inline-block;
              }
            </style>
            <div style="max-width: 600px; width: 85vw;">
              <a title="Close" href="#" onclick="return false;">
                <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
              </a>
              <h3><iron-icon icon="vaadin:bell" style="margin-right: 1rem;"></iron-icon> Your Notifications</h3>
              <div style="left: 8%;position: relative;width: 90%;font-size: 0.8rem;">
                <span style="margin-right: 1rem;" @click="${(e) => {this._fetchNotifications('all', () => {this.hideDismissButton = true;});}}">
                  <a title="View all notifications" href="#" onclick="return false;" style="text-decoration: none; color: inherit;">
                  <iron-icon icon="vaadin:time-backward" style="margin-right: 0.5rem;"></iron-icon>
                  View all messages
                </a></span>
                <span @click="${(e) => {this._fetchNotifications('new', () => {this.hideDismissButton = false;});}}">
                  <a title="View new notifications" href="#" onclick="return false;" style="text-decoration: none; color: inherit;">
                  <iron-icon icon="vaadin:envelopes-o" style="margin-right: 0.5rem;"></iron-icon>
                  Show new messages only
                </a></span>
              </div>
              <div style="padding: 1rem; overflow: auto; max-height: 70vh;">
                ${this.notifications.length > 0 ? html`
                  ${this.notifications.map(i => html`
                    <div id="notification-message-${i.id}" style="display: grid; grid-template-columns: 3rem 1fr; align-items: center;">
                      <div>
                        ${this.hideDismissButton ? html`
                            <iron-icon style="margin-right: 2rem; color: black;" icon="vaadin:envelope-open-o"></iron-icon>
                          ` : html`
                            <div class="change-icon">
                              <a title="Dismiss" href="#" onclick="return false;"
                                @click="${(e) => {this._dismissNotification(i.id);}}">
                                <iron-icon class="toggle-icon" style="margin-right: 2rem; color: black;" icon="vaadin:envelope-o"></iron-icon>
                                <iron-icon class="toggle-icon" style="margin-right: 2rem; color: black;" icon="vaadin:envelope-open-o"></iron-icon>
                              </a>
                            </div>
                        `}
                      </div>
                      <div style="">
                        <p style="margin: 0; font-size: 1.2rem; font-weight: bold;">${i.title}</p>
                        <p style="margin: 0; margin-bottom: 0.5rem; font-size: 0.8rem;">${i.time}</p>
                      </div>
                      <div style="grid-column: 1 / span 2;">${i.body}</div>
                    </div>
                  `)}
                ` : html`
                  <p>No new messages.</p>
                `
                }
              </div>
            </div>
          `,
          container
        );
      }
    }

    updated(changedProps) {
      changedProps.forEach((oldValue, propName) => {
        // console.log(`${propName} changed. oldValue: ${oldValue}`);
        switch (propName) {
          case 'notifications':
            if (this.shadowRoot.querySelector('#message-notification-icon')){
              if (this.notifications.length > 0) {
                this.shadowRoot.querySelector('#message-notification-icon').style.color = 'white';
              } else {
                this.shadowRoot.querySelector('#message-notification-icon').style.color = 'darkgray';
              }
              this.notificationsDialog.render();
              if (this.newMessages && !this.notificationBlinkSetIntervalId && this.notifications.length > 0) {
                this.notificationBlinkSetIntervalId = setInterval(() => {
                  if(this.shadowRoot.querySelector('#message-notification-icon a').style.color != 'red') {
                    this.shadowRoot.querySelector('#message-notification-icon a').style.color = 'red';
                  } else {
                    this.shadowRoot.querySelector('#message-notification-icon a').style.color = 'white';
                  }
                }, 1000);
              }
            }
            break;
          default:
        }
      });
    }

    _fetchNotifications(newOrAll, callback) {

      const Url=config.backEndUrl + "notifications/fetch"
      let body = {
        'message': newOrAll
      };
      const param = {
        method: "POST",
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
          // console.log(JSON.stringify(data.messages, null, 2));
          this.notifications = data.messages;
          this.notifications.sort(function(a, b) {
            let keyA = a.id;
            let keyB = b.id;
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          if (newOrAll === 'new' && this.notifications.length > 0) {
            this.newMessages = true;
          }
          callback()
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    }

    _dismissNotification(messageId) {
      const Url=config.backEndUrl + "notifications/mark"
      let body = {
        'message-id': messageId
      };
      const param = {
        method: "POST",
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
          console.log(JSON.stringify(data, null, 2));
          this._showNotifications();
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    }

    _showNotifications(event) {
      clearInterval(this.notificationBlinkSetIntervalId);
      this.shadowRoot.querySelector('#message-notification-icon a').style.color = 'darkgray';
      this._fetchNotifications('new', () => {
        this.hideDismissButton = false;
        this.notificationsDialog.opened = true;
      });

    }
  }

  window.customElements.define('des-toolbar', DESToolBar);
