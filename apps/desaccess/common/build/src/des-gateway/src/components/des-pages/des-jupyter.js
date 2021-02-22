import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { store } from '../../store.js';
import { config } from '../des-config.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-checkbox/paper-checkbox.js';


class DESJupyter extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      username: {type: String},
      jupyter_url: {type: String},
      jupyter_token: {type: String},
      folderLinks: {type: String},
      gpu: {type: Boolean},
      roles: {type: Array},
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        .grid-system {
            display: grid;
            grid-gap: 1rem;
            padding: 1rem;
            grid-template-columns: 1fr;
        }
        @media all and (min-width: 1171px) {
          .grid-system {
            grid-template-columns: 1fr 1fr;
          }
        }
        `,
    ];
  }

  constructor(){
    super();
    this.username = '';
    this.jupyter_url = '';
    this.jupyter_token = '';
    this.statusIntervalId = null;
    this.folderLinks ='';
    this.gpu = false;
    this.roles = [];
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DESaccess JupyterLab
          <paper-spinner class="big"></paper-spinner>
        </div>
        <div class="grid-system">
          <div>
            <div>
              <h3>Manage Server</h3>
              <p>
                This page allows you to deploy a JupyterLab server <i>for your use only</i>.
                <span style="color: red;">
                  Server instances will be automatically deleted after being idle for approximately 24 hours.
                </span>
              </p>
            </div>
            <div id="please-wait-button" style="display: none;">
              <paper-button class="des-button" raised disabled
                style="font-size: 1rem; margin: 1rem; height: 3rem; width: 16rem;">
                <iron-icon icon="vaadin:hourglass" style="height: 2rem; margin-right: 1rem;"></iron-icon>
                Please wait...
              </paper-button>
            </div>
            <div id="deploy-jlab-button" style="display: none;">
              <paper-button @click="${this._create}" class="des-button" raised disabled
                style="font-size: 1rem; margin: 1rem; height: 3rem; width: 16rem;">
                <iron-icon icon="vaadin:rocket" style="height: 2rem; margin-right: 1rem;"></iron-icon>
                Deploy JupyterLab server
              </paper-button>
              <div style="margin: 1rem;">
              ${config.desaccessInterface === 'public' || (this.roles.indexOf('gpu') === -1 && this.roles.indexOf('admin') === -1) ? html`` : html`
                <paper-checkbox @change="${(e) => {this.gpu = e.target.checked;}}" ?checked="${this.gpu}">Use GPUs</paper-checkbox>
              `}
              </div>
            </div>
            <div id="delete-jlab-button" style="display: none;">
              <paper-button @click="${this._delete}" class="des-button" raised disabled
                style="font-size: 1rem; margin: 1rem; height: 3rem; width: 16rem; background-color: darkred;">
                <iron-icon icon="vaadin:trash" style="height: 2rem; margin-right: 1rem;"></iron-icon>
                Destroy JupyterLab server
              </paper-button>
            </div>
            <div id="jlab-link" style="display: none;">
              <a href="${this.jupyter_url}" target="_blank">
                <paper-button class="des-button" raised
                  style="font-size: 1rem; margin: 1rem; height: 3rem; width: 16rem;">
                  <iron-icon icon="vaadin:notebook" style="height: 2rem; margin-right: 1rem;"></iron-icon>
                  Open JupyterLab
                </paper-button>
              </a>
              <p style="margin-left: 1rem;">
                Created: <span></span>
              </p>
            </div>
          </div>
          <div>
            <div id="jupyter-file-links" style="display: none; margin-top: 1rem;">
              <h3>JupyterLab Files</h3>
              <p>
                The links below show what you are sharing publicly, which includes all files and subfolders in 
                your <code>/public/</code> folder. These links can be shared with
                your collaborators to allow them to download your Jupyter files. These files are protected only 
                by the obscurity of the URL, so you should consider using random directory names for files you
                wish to share, such as for example <code>/public/d8196cfd1dc2435aab4095abe5d26971</code>.
              </p>
              ${this.folderLinks}
            </div>
          </div>
        </div>
      </section>

      <vaadin-dialog id="delete-jupyter-files-dialog" no-close-on-esc no-close-on-outside-click></vaadin-dialog>
    `;
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.roles = state.app.roles;
  }

  firstUpdated() {
    // Create a dialog for confirming the deletion of Jupyter files
    this.deleteJupyterFilesDialog = this.shadowRoot.getElementById('delete-jupyter-files-dialog');
    this.deleteJupyterFilesDialog.renderer = (root, dialog) => {
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
          <p style="text-align: center;font-size: 1.2rem;">
            Delete shared folder?<br>
            <span style="font-family: monospace;">
            <b>${this.jupyterInstanceToDelete}</b><br>
            </span>
            <span style="font-size: 0.9rem;">
            ${this.convertToLocalTime(this.jupyterInstanceToDeleteTime)}
            </span>
          </p>
          <paper-button @click="${(e) => {dialog.opened = false; this._deleteJupyterFiles(this.jupyterInstanceToDelete);}}" class="des-button" raised>Yes</paper-button>
          <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
        </div>
        `,
        container
      );
    }

    // Initialize Jupyter deployment status polling
    this.shadowRoot.querySelector('paper-spinner').active = true;
    this.statusIntervalId = setInterval(() => {
      this._status();
      // Update the list of Jupyter file folder links
      this._updateFolderLinks();
    }, 2000)

  }

  _updateFolderLinks() {
    const Url=config.backEndUrl + "jlab/files/list"
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
        // console.log(JSON.stringify(data, null, 2));
        data.folders.sort(function(a, b) {
          if (a.time < b.time) {
            return 1;
          }
          if (a.time > b.time) {
            return -1;
          }
          return 0;
        });
        this.folderLinks = html`
          <ul style="list-style-type: none; margin: 0; padding: 1rem; line-height: 2rem;">
          ${data.folders.map(i => html`
            <li>
            ${this.jupyter_token === i.directory ? html`
              <a style="text-decoration: none;" onclick="return false;">
                <iron-icon icon="vaadin:trash" style="margin-right: 1.5rem; color: lightgray;"></iron-icon>
              </a>
            ` : html`
              <a style="text-decoration: none;" href="#" onclick="return false;" title="Delete files of instance ${i.directory.substring(0,8)}">
                <iron-icon @click="${(e) => { this.jupyterInstanceToDelete = i.directory; this.jupyterInstanceToDeleteTime = i.time; this.deleteJupyterFilesDialog.opened = true;}}" icon="vaadin:trash" style="margin-right: 1.5rem; color: darkred;"></iron-icon>
              </a>
            `}
            <a style="text-decoration: none; font-family: monospace;" href="${config.frontEndOrigin}/${config.fileServerRootPath}/${this.username}/jupyter/public/${i.directory}" target="_blank">${this.convertToLocalTime(i.time)} &mdash; ${i.directory}</a>
            </li>
          `)}
          </ul>
        `;
        if (data.folders.length > 0) {
          this.shadowRoot.querySelector('#jupyter-file-links').style.display = 'block';
        } else {
          this.shadowRoot.querySelector('#jupyter-file-links').style.display = 'none';
        }
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _deleteJupyterFiles(token) {
    const Url=config.backEndUrl + "jlab/files/delete"
    let body = {
      'token': token
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
        // console.log(JSON.stringify(data, null, 2));
        this._updateFolderLinks();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _create(event) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "jlab/create"
    let body = {
      'gpu': this.gpu
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
        // console.log(JSON.stringify(data, null, 2));
        this.jupyter_url = data.url;
        this.jupyter_token = data.token;
        this.shadowRoot.querySelector('#deploy-jlab-button').disabled = true;
        this.statusIntervalId = setInterval(() => {
          this._status();
          this._updateFolderLinks();
        }, 2000)
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });

  }
  
  _delete(event) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "jlab/delete"
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
        // console.log(JSON.stringify(data, null, 2));
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').disabled = true;
        this.shadowRoot.querySelector('#delete-jlab-button').style.display = 'none';
        this.shadowRoot.querySelector('#jlab-link').style.display = 'none';
        this.statusIntervalId = setInterval(() => {
          this._status();
        }, 2000)
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _status() {
    const Url=config.backEndUrl + "jlab/status"
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
        // console.log(JSON.stringify(data, null, 2));
      } else {
        // console.log(JSON.stringify(data, null, 2));
      }
      let stopStatusPolling = true;
      // If the ready_replicas is -1 then the deployment status returned a 404 "not found" error.
      // If ready_replicas is 0 this can mean the deployment is either progressing or terminating
      if (data.latest_condition_type !== 'Progressing' && data.latest_condition_type !== 'Unknown' && data.ready_replicas === -1) {
        // Enable and display Deploy button
        this.shadowRoot.querySelector('#please-wait-button').style.display = 'none';
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').disabled = true;
        this.shadowRoot.querySelector('#delete-jlab-button').style.display = 'none';
        this.shadowRoot.querySelector('#deploy-jlab-button paper-button').disabled = false;
        this.shadowRoot.querySelector('#deploy-jlab-button').style.display = 'block';
        this.shadowRoot.querySelector('#jlab-link').style.display = 'none';

      } else if (data.latest_condition_type === 'Available' && data.ready_replicas > 0) {
        // Enable and display the Delete button
        this.shadowRoot.querySelector('#please-wait-button').style.display = 'none';
        this.jupyter_token = data.token;
        this.shadowRoot.querySelector('#jlab-link a').setAttribute('href', `${config.frontEndUrl}jlab/${this.username}/lab?token=${this.jupyter_token}`);
        this.shadowRoot.querySelector('#jlab-link').style.display = 'block';
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').disabled = false;
        this.shadowRoot.querySelector('#delete-jlab-button').style.display = 'block';
        this.shadowRoot.querySelector('#deploy-jlab-button paper-button').disabled = true;
        this.shadowRoot.querySelector('#deploy-jlab-button').style.display = 'none';
        this.shadowRoot.querySelector('#jlab-link span').innerHTML = this.convertToLocalTime(data.creation_timestamp.replace(/\+.*$/, ''));
      } else {
        // The deployment is transitioning, either starting or terminating
        this.shadowRoot.querySelector('#jlab-link').style.display = 'none';
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').disabled = true;
        this.shadowRoot.querySelector('#delete-jlab-button').style.display = 'none';
        this.shadowRoot.querySelector('#deploy-jlab-button paper-button').disabled = true;
        this.shadowRoot.querySelector('#deploy-jlab-button').style.display = 'none';
        this.shadowRoot.querySelector('#please-wait-button').style.display = 'block';
        stopStatusPolling = false;
      }
      if (stopStatusPolling && this.statusIntervalId) {
        clearInterval(this.statusIntervalId);
        this.statusIntervalId = null;
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
    });
  }

}

window.customElements.define('des-jupyter', DESJupyter);
