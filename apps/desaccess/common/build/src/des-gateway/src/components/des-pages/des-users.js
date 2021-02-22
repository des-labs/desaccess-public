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

class DESUsers extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
      allUsers: {type: Array},
      grid: {type: Object}
    };
  }

  constructor(){
    super();
    this.accessPages = [];
    this.grid = null;
    this.allUsers = [];
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DESaccess User Management
          <paper-spinner class="big"></paper-spinner>
        </div>
        <div>
          <p>Manage user roles (RBAC) and view active help requests. <b>The page must be reloaded to refresh the data.</b></p>
        </div>
        <!--
          <paper-button @click="${(e) => {this.newUserDialog.opened = true; }}" class="des-button" raised style="font-size: 1rem; margin: 1rem; height: 2rem;"><iron-icon icon="vaadin:plus" style="height: 2rem; "></iron-icon>Add user</paper-button>
        -->
        <vaadin-grid .multiSort="${true}" style="height: 70vh; max-width: 85vw;">
          <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
          <vaadin-grid-column auto-width flex-grow="0" .renderer="${this._rendererTableIndex}" header="#"></vaadin-grid-column>
          <vaadin-grid-filter-column path="user.name" header="Username"></vaadin-grid-filter-column>
          <vaadin-grid-sort-column path="user.firstname" header="First name"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="user.lastname" header="Last name" direction="asc"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="user.email" header="Email"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="user.roles" header="Roles"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="user.needs_help" header="Needs help" direction="desc"></vaadin-grid-sort-column>
          <vaadin-grid-column .renderer="${this.rendererJiraLinks}" header="Help Requests"></vaadin-grid-column>
          <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererAction}" .headerRenderer="${this._headerRendererAction}"></vaadin-grid-column>
        </vaadin-grid>
      </section>
      <vaadin-dialog id="new-user-dialog"></vaadin-dialog>
      <vaadin-dialog id="edit-user-dialog"></vaadin-dialog>
      <vaadin-dialog id="reset-user-dialog" no-close-on-esc no-close-on-outside-click></vaadin-dialog>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
  }

  firstUpdated() {
    this.grid = this.shadowRoot.querySelector('vaadin-grid');
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers
    this.rendererJiraLinks = this._rendererJiraLinks.bind(this); // need this to invoke class methods in renderers
    this.userEditDialog = this._userEditDialog.bind(this); // need this to invoke class methods in renderers

    this.newUserDialog = this.shadowRoot.getElementById('new-user-dialog');
    this.newUserDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <style>
            paper-button {
              width: 100px;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.indigo {
              background-color: var(--paper-indigo-500);
              color: white;
              width: 100px;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.des-button {
                background-color: white;
                color: black;
                width: 100px;
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
            <h3>Add user</h3>
            <paper-input id="new-username" always-float-label label="Username" placeholder="AstroBuff"></paper-input>
            <!-- <paper-button @click="${(e) => {dialog.opened = false; this._addNewUser(document.getElementById('new-username').value);}}" class="des-button" raised>Add user</paper-button> -->
            <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
          </div>
        `,
        container
      );
    }


    this.resetUserDialog = this.shadowRoot.getElementById('reset-user-dialog');
    this.resetUserDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (container) {
        root.removeChild(root.childNodes[0]);
      }
      container = root.appendChild(document.createElement('div'));
      render(
        html`
        <style>
          paper-button {
            width: 100px;
            text-transform: none;
            --paper-button-raised-keyboard-focus: {
              background-color: var(--paper-indigo-a250) !important;
              color: white !important;
            };
          }
          paper-button.indigo {
            background-color: var(--paper-indigo-500);
            color: white;
            width: 100px;
            text-transform: none;
            --paper-button-raised-keyboard-focus: {
              background-color: var(--paper-indigo-a250) !important;
              color: white !important;
            };
          }
          paper-button.des-button {
              background-color: white;
              color: black;
              width: 100px;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: white !important;
                color: black !important;
              };
          }

        </style>
        <div>
          <p style="text-align: center;font-size: 1.2rem;">Set user <b>${this.userToReset}</b><br>to the default role?</p>
          <paper-button @click="${(e) => {dialog.opened = false; this._resetUser(this.userToReset);}}" class="des-button" raised>Yes</paper-button>
          <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
        </div>
        `,
        container
      );
    }

    this._fetchAllUsers();
  }

  _rendererTableIndex(root, column, rowData) {
    root.textContent = rowData.index;
  }

  _resetUser(username) {
    if (username === '') {
      return;
    }
    const Url=config.backEndUrl + "user/role/reset"
    let body = {
      'username': username
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
        this._fetchAllUsers();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
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
    let selected = this.grid.selectedItems;
    if (selected.length === 0) {
      render(
        html`
          <a title="Reset user ${rowData.item.user.name}" href="#" onclick="return false;"><iron-icon @click="${(e) => { this.userToReset = rowData.item.user.name; this.resetUserDialog.opened = true;}}" icon="vaadin:eraser" style="color: darkgray;"></iron-icon></a>
          <a title="Edit user ${rowData.item.user.name}" href="#" onclick="return false;"><iron-icon @click="${(e) => {this.userEditDialog(rowData.item.user);}}" icon="vaadin:pencil" style="color: darkgray;"></iron-icon></a>
        `,
        container
      );
    } else {
      if (selected.map((e) => {return e.user.name}).indexOf(rowData.item.user.name) > -1) {
        render(
          html`
            <a title="Edit (${selected.length}) Selected Users" onclick="return false;"><iron-icon @click="${(e) => {this.userEditDialog(rowData.item.user);}}" icon="vaadin:pencil" style="color: red;"></iron-icon></a>
          `,
          container
        );
      } else {
        render(
          html``,
          container
        );

      }
    }
  }

  _rendererJiraLinks(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    render(
      html`
        <div class="jira-links">
        ${rowData.item.user.help_requests === null ?
          html``:
          html`
            <ul style="list-style-type: none; margin: 0; padding: 0;">
              ${rowData.item.user.help_requests.map(i => html`
                <li>
                  <a target="_blank" href="https://opensource.ncsa.illinois.edu/jira/browse/${i}">${i}</a>
                </li>
              `)}
            </ul>
          `
        }
        </div>
      `,
      container
    );
  }

  _userEditDialog(userInfo) {
    const editUserDialog = this.shadowRoot.getElementById('edit-user-dialog');
    editUserDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      // Different behavior if applying to selection of users
      let placeholderText = userInfo.roles.join(', ');
      let classList = '';
      let headerText = `Update user: ${userInfo.name}`;
      if (this.grid.selectedItems.length > 0) {
        placeholderText = 'CAUTION: Roles will apply to ALL users!!';
        classList = 'warning-text';
        headerText = `Updating ALL SELECTED user roles! [not yet supported]`;
      }
      render(
        html`
          <style>
            paper-button {
              width: 100px;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.indigo {
              background-color: var(--paper-indigo-500);
              color: white;
              width: 100px;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.des-button {
                background-color: white;
                color: black;
                width: 100px;
                text-transform: none;
                --paper-button-raised-keyboard-focus: {
                  background-color: white !important;
                  color: black !important;
                };
            }
           .warning-text {
             color: red;
           }
          </style>
          <div style="width: 50vw">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3 class="${classList}">${headerText}</h3>
            <paper-input id="roles-input" always-float-label label="Input comma-separated list of roles (e.g. collaborator, admin)" class="${classList}" value="${placeholderText}" placeholder="${placeholderText}"></paper-input>

            <paper-button @click="${(e) => {dialog.opened = false; this._setUserRoles(userInfo, document.getElementById('roles-input').value);}}" class="des-button" raised>Apply</paper-button>
            <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
          </div>
        `,
        container
      );
    }
    editUserDialog.opened = true;
  }

  _setUserRoles(userInfo, newRolesStr) {
    // TODO: Support bulk role update for multiple selected users
    if (this.grid.selectedItems.length > 0) {
      return;
    }
    let roles = [];
    // Convert input CSV string to array, trimming surrounding whitespace and replacing remaining whitespace with underscores
    let newRoles = newRolesStr.split(',');
    for (let i in newRoles) {
      let newRole = newRoles[i].trim().replace(/\s/g, "_");
      if (newRole !== '') {
        roles.push(newRole);
      }
    }
    newRoles = roles;
    if (newRoles === userInfo.roles) {
      return;
    }
    const Url=config.backEndUrl + "user/role/update"
    let body = {
      'username': userInfo.name,
      'new_roles': newRoles
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
        this._fetchAllUsers();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _fetchAllUsers() {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "user/list"
    let body = {
      'username': 'all'
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
        this.allUsers = data.users;
        this._fetchUserList()
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _fetchUserList() {
    const Url=config.backEndUrl + "user/role/list"
    let body = {};
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
        this._updateUserTable(data.users);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _updateUserTable(userRoles) {
    let grid = this.grid;
    let gridItems = [];
    // If there are no jobs in the returned list, allow an empty table
    if (this.allUsers.length === 0) {
      grid.items = gridItems;
      return;
    }
    let ctr = 0;
    this.allUsers.forEach((item, index, array) => {
      let user = {};
      user.name = item[0];
      user.firstname = item[1];
      user.lastname = item[2];
      user.email = item[3];
      user.roles = [];
      user.help_requests = [];
      for (let i in userRoles) {
        let rolesIdx = userRoles.map((e) => {return e.username}).indexOf(user.name);
        if (rolesIdx > -1) {
          user.roles = userRoles[rolesIdx].roles.sort();
          user.help_requests = userRoles[rolesIdx].help_requests.sort();
          break;
        }
      }
      user.roles = user.roles.length == 0 ? ['default'] : user.roles;
      user.needs_help = user.help_requests.length > 0 ? 'Yes' : 'No';
      gridItems.push({user: user});
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        // console.log(JSON.stringify(gridItems, null, 2));
        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.user.name}).indexOf(grid.selectedItems[i].user.name) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.user.name}).indexOf(grid.items[i].user.name) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        grid.recalculateColumnWidths();
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
    })
  }

  // _addNewUser(username) {
  //   if (username === '') {
  //     return;
  //   }
  //   if (username !== username.trim().replace(/\s/g, "_").replace(/[^a-z0-9]/g, "")) {
  //     console.log('Username may only consist of lowercase alphanumeric characters');
  //     return;
  //   }
  //   const Url=config.backEndUrl + "user/role/add"
  //   let body = {
  //     'username': username,
  //     'roles': ['default']
  //   };
  //   const param = {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + localStorage.getItem("token")
  //     },
  //     body: JSON.stringify(body)
  //   };
  //   fetch(Url, param)
  //   .then(response => {
  //     return response.json()
  //   })
  //   .then(data => {
  //     if (data.status === "ok") {
  //       // console.log(JSON.stringify(data.users, null, 2));
  //       this._fetchAllUsers();
  //     } else {
  //       console.log(JSON.stringify(data, null, 2));
  //     }
  //   });
  // }
}

window.customElements.define('des-users', DESUsers);
