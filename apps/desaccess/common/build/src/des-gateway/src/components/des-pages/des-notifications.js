import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { config } from '../des-config.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-checkbox/paper-checkbox.js';

class DESNotifications extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
      grid: {type: Object},
      newMessageTitle: {type: String},
      sendEmail: {type: Boolean},
      newMessageBody: {type: String}
    };
  }

  constructor(){
    super();
    this.accessPages = [];
    this.newMessageTitle = '';
    this.newMessageBody = '';
    this.newMessageRoles = '';
    this.sendEmail = false;
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DESaccess Notifications
          <paper-spinner class="big"></paper-spinner>
        </div>
        <div>
          <p>Send notifications to DESaccess users based on their role.</p>
        </div>
        <paper-button @click="${(e) => {this.newMessageDialog.opened = true; }}" class="des-button" raised 
          style="font-size: 1rem; margin: 1rem; height: 2.2rem; width: auto;">
          <iron-icon icon="vaadin:pencil" style="height: 2rem; margin-right: 1rem;"></iron-icon>
          Compose New Message
        </paper-button>
        <vaadin-grid .multiSort="${true}" style="height: 70vh; max-width: 85vw;">
          <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
          <vaadin-grid-column auto-width flex-grow="0" .renderer="${this._rendererTableIndex}" header="#"></vaadin-grid-column>
          <vaadin-grid-sort-column auto-width flex-grow="0" path="msg.id" header="ID" direction="desc"></vaadin-grid-sort-column>
          <vaadin-grid-filter-column path="msg.title" header="Title"></vaadin-grid-filter-column>
          <vaadin-grid-column path="msg.message" header="Message"></vaadin-grid-column>
          <vaadin-grid-sort-column auto-width flex-grow="0" path="msg.roles" header="Roles"></vaadin-grid-sort-column>
          <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererAction}" .headerRenderer="${this._headerRendererAction}"></vaadin-grid-column>
        </vaadin-grid>
      </section>
      <vaadin-dialog id="delete-msg-dialog"></vaadin-dialog>
      <vaadin-dialog id="new-msg-dialog"></vaadin-dialog>
      <vaadin-dialog id="edit-msg-dialog"></vaadin-dialog>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
  }

  firstUpdated() {
    this.grid = this.shadowRoot.querySelector('vaadin-grid');
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers


    this.deleteMessageDialog = this.shadowRoot.getElementById('delete-msg-dialog');
    this.deleteMessageDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (container) {
        root.removeChild(root.childNodes[0]);
      }
      container = root.appendChild(document.createElement('div'));
      render(
        html`
        <style>
          paper-button {
            width: auto;
            text-transform: none;
            --paper-button-raised-keyboard-focus: {
              background-color: var(--paper-indigo-a250) !important;
              color: white !important;
            };
          }
          paper-button.indigo {
            background-color: var(--paper-indigo-500);
            color: white;
            width: auto;
            text-transform: none;
            --paper-button-raised-keyboard-focus: {
              background-color: var(--paper-indigo-a250) !important;
              color: white !important;
            };
          }
          paper-button.des-button {
              background-color: white;
              color: black;
              width: auto;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: white !important;
                color: black !important;
              };
          }

        </style>
        <div>
          <p style="text-align: center;font-size: 1.2rem;">Delete message?</p>
          <paper-button @click="${(e) => {dialog.opened = false; this._deleteMessage(this.messageToDelete);}}" class="des-button" raised>Yes</paper-button>
          <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
        </div>
        `,
        container
      );
    }

    this.newMessageDialog = this.shadowRoot.getElementById('new-msg-dialog');
    this.newMessageDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <style>
            paper-button {
              width: auto;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.indigo {
              background-color: var(--paper-indigo-500);
              color: white;
              width: auto;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.des-button {
                background-color: white;
                color: black;
                width: auto;
                text-transform: none;
                --paper-button-raised-keyboard-focus: {
                  background-color: white !important;
                  color: black !important;
                };
            }
          </style>
          <div style="width: 50vw">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3>Compose message</h3>
            <p>Specifying no roles will apply the <b>default</b> role to the notification (everyone will see it).</p>
            <paper-input id="new-msg-roles" always-float-label label="Roles" placeholder="collaborator, admin" @change="${(e) => this.newMessageRoles = e.target.value}"></paper-input>
            <paper-input id="new-msg-title" always-float-label label="Title" placeholder="" @change="${(e) => this.newMessageTitle = e.target.value}"></paper-input>
            <div>
              <p><b>Notification message</b></p>
              <iron-autogrow-textarea id="new-msg-body" name="question" rows="6"
                style="width:90%; padding: 1rem;" 
                placeholder="">
              </iron-autogrow-textarea>
            </div>
            <paper-button @click="${(e) => {dialog.newMessageBody = document.querySelector('#new-msg-body').value; dialog.opened = false; this._createMessage();}}" class="des-button" raised>Create Message</paper-button>
            <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
            <paper-checkbox @change="${(e) => {this.sendEmail = e.target.checked;}}" ?checked="${this.sendEmail}">Send email also?</paper-checkbox>
          </div>
        `,
        container
      );
    }
    this.editMessageDialog = this.shadowRoot.getElementById('edit-msg-dialog');
    this.editMessageDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <style>
            paper-button {
              width: auto;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.indigo {
              background-color: var(--paper-indigo-500);
              color: white;
              width: auto;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.des-button {
                background-color: white;
                color: black;
                width: auto;
                text-transform: none;
                --paper-button-raised-keyboard-focus: {
                  background-color: white !important;
                  color: black !important;
                };
            }
          </style>
          <div style="width: 50vw">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3>Edit message</h3>
            <p>Specifying no roles will apply the <b>default</b> role to the notification (everyone will see it).</p>
            <paper-input id="edit-msg-roles" always-float-label label="Roles" placeholder="collaborator, admin" value="${this.editMessageRoles}" @change="${(e) => this.editMessageRoles = e.target.value}"></paper-input>
            <paper-input id="edit-msg-title" always-float-label label="Title" placeholder="" value="${this.editMessageTitle}" @change="${(e) => this.editMessageTitle = e.target.value}"></paper-input>
            <div>
              <p><b>Notification message</b></p>
              <textarea id="edit-msg-body" name="question" rows="6"
                style="width:90%; padding: 1rem;" 
                placeholder="">${this.editMessageBody}</textarea>
            </div>
            <paper-button @click="${(e) => {dialog.editMessageBody = document.querySelector('#edit-msg-body').value; dialog.opened = false; this._editMessage();}}" class="des-button" raised>Edit Message</paper-button>
            <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
            <paper-checkbox @change="${(e) => {this.sendEmail = e.target.checked;}}" ?checked="${this.sendEmail}">Send email also?</paper-checkbox>
          </div>
        `,
        container
      );
    }

    this._fetchAllMessages();
  }

  _createMessage() {
    // Validate message body
    this.newMessageBody = this.newMessageDialog.newMessageBody;
    if (this.newMessageBody === '') {
      console.log('Empty message ignored.');
      return;
    }
    // TODO: Refactor this common role-string-to-role-array code into a common utility function
    // Validate roles
    let roles = [];
    // Convert input CSV string to array, trimming surrounding whitespace and replacing remaining whitespace with underscores
    let msgRoles = this.newMessageRoles.split(',');
    for (let i in msgRoles) {
      let newRole = msgRoles[i].trim().replace(/\s/g, "_");
      if (newRole !== '') {
        roles.push(newRole);
      }
    }
    msgRoles = roles;
    const Url=config.backEndUrl + "notifications/create"
    let body = {
      'title': this.newMessageTitle,
      'body': this.newMessageBody,
      'roles': msgRoles,
      'email': this.sendEmail
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
        this._fetchAllMessages();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });

  }

  _deleteMessage(messageId) {
    console.log('Deleting message...');
    const Url=config.backEndUrl + "notifications/delete"
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
        // console.log(JSON.stringify(data.users, null, 2));
        this._fetchAllMessages();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _editMessage() {
    // Validate message body
    this.editMessageBody = this.editMessageDialog.editMessageBody;
    if (this.editMessageBody === '') {
      console.log('Empty message ignored.');
      return;
    }
    // TODO: Refactor this common role-string-to-role-array code into a common utility function
    // Validate roles
    let roles = [];
    // Convert input CSV string to array, trimming surrounding whitespace and replacing remaining whitespace with underscores
    let msgRoles = this.editMessageRoles.split(',');
    for (let i in msgRoles) {
      let editRole = msgRoles[i].trim().replace(/\s/g, "_");
      if (editRole !== '') {
        roles.push(editRole);
      }
    }
    msgRoles = roles;
    const Url=config.backEndUrl + "notifications/edit"
    let body = {
      'id': this.messageToEdit.id,
      'title': this.editMessageTitle,
      'body': this.editMessageBody,
      'roles': msgRoles,
      'email': this.sendEmail
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
        // console.log(JSON.stringify(data.users, null, 2));
        this._fetchAllMessages();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _rendererTableIndex(root, column, rowData) {
    root.textContent = rowData.index;
  }

  _headerRendererAction(root) {
    render(
      html`
        <a title="Actions"><iron-icon icon="vaadin:cogs"></iron-icon></a>
      `,
      root
    );
  }

  _rendererAction(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    render(
      html`
        <a title="Delete message ${rowData.item.msg.id}" href="#" onclick="return false;"><iron-icon @click="${(e) => { this.messageToDelete = rowData.item.msg.id; this.deleteMessageDialog.opened = true;}}" icon="vaadin:trash" style="color: red;"></iron-icon></a>
        <a title="Edit roles ${rowData.item.msg.id}" href="#" onclick="return false;"><iron-icon @click="${(e) => {this.messageToEdit = rowData.item.msg; this.editMessageBody = rowData.item.msg.message; this.editMessageRoles = rowData.item.msg.roles.join(','); this.editMessageTitle = rowData.item.msg.title; this.editMessageDialog.opened = true;}}" icon="vaadin:pencil" style="color: inherit;"></iron-icon></a>
      `,
      container
    );
  }

  _fetchAllMessages() {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "notifications/fetch"
    let body = {
      'message': 'all'
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
      this.shadowRoot.querySelector('paper-spinner').active = false;
      if (data.status === "ok") {
        // console.log(JSON.stringify(data.users, null, 2));
        this.notifications = data.messages;
        this._updateTable(this.notifications);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _updateTable(userRoles) {
    let grid = this.grid;
    let gridItems = [];
    // If there are no jobs in the returned list, allow an empty table
    if (this.notifications.length === 0) {
      grid.items = gridItems;
      return;
    }
    let ctr = 0;
    this.notifications.forEach((item, index, array) => {
      let msg = {};
      msg.id = item.id;
      msg.title = item.title;
      msg.message = item.body;
      msg.time = item.time;
      msg.roles = item.roles;
      gridItems.push({msg: msg});
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        // console.log(JSON.stringify(gridItems, null, 2));
        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.msg.id}).indexOf(grid.selectedItems[i].msg.id) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.msg.id}).indexOf(grid.items[i].msg.id) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        grid.recalculateColumnWidths();
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
    })
  }

}

window.customElements.define('des-notifications', DESNotifications);
