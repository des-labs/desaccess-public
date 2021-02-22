import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import { render } from 'lit-html';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-image/iron-image.js';
import { loadPage, updateQuery } from '../../actions/app.js';
import '@polymer/paper-spinner/paper-spinner.js';


class DESJobStatus extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
        .monospace-column {
          font-family: monospace;
          font-size: 0.8rem;
        }
        paper-button {
          width: 150px;
          text-transform: none;
          --paper-button-raised-keyboard-focus: {
            background-color: var(--paper-indigo-a250) !important;
            color: white !important;
          };
        }
        paper-button.indigo {
          background-color: var(--paper-indigo-500);
          color: black;
          width: 150px;
          text-transform: none;
          --paper-button-raised-keyboard-focus: {
            background-color: var(--paper-indigo-a250) !important;
            color: white !important;
          };
        }
        vaadin-grid {
          height: 70vh;
          max-width: 90vw;
        }
        paper-spinner.big {
          float: left; 
          left: 0px; 
          top: 0px; 
          z-index: 1;
          height: 35px;
          width:  35px;
        }
        @media (min-width: 1001px) {
          vaadin-grid {
          max-width: 70vw;
          }
        }
        `,

    ];
  }

  static get properties() {
    return {
      username: {type: String},
      query: {type: String},
      jobIdFromUrl: {type: String},
      jobToDelete: {type: String},
      refreshStatusIntervalId: {type: Number},
      initialJobInfoPopup: {type: Boolean},
      accessPages: {type: Array},
      _selectedItems: {type: Array}
    };
  }

  constructor(){
    super();
    this.username = '';
    this.query = '';
    this.jobIdFromUrl = '';
    this.initialJobInfoPopup = true;
    this.jobToDelete = '';
    this.refreshStatusIntervalId = 0;
    this.accessPages = [];
    this._selectedItems = [];
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers
    this.rendererStatus = this._rendererStatus.bind(this); // need this to invoke class methods in renderers
    this._headerRendererJobId = this._headerRendererJobId.bind(this); // need this to invoke class methods in renderers
    this._headerRendererJobName = this._headerRendererJobName.bind(this); // need this to invoke class methods in renderers
    this._deleteConfirmDialogRenderer = this._deleteConfirmDialogRenderer.bind(this); // need this to invoke class methods in renderers
    this._rendererJobId = this._rendererJobId.bind(this); // need this to invoke class methods in renderers
    this._rendererJobName = this._rendererJobName.bind(this); // need this to invoke class methods in renderers
    this._jobRenameDialog = this._jobRenameDialog.bind(this); // need this to invoke class methods in renderers
    this._showJobImageGallery = this._showJobImageGallery.bind(this); // need this to invoke class methods in renderers

    // Define the datetime functions used by the update time indicator
    Date.prototype.today = function () {
        return this.getFullYear() + "/" + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "/" + ((this.getDate() < 10)?"0":"") + this.getDate();
    }
    Date.prototype.timeNow = function () {
         return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }
  }

  render() {

    // let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    // viewportHeight = viewportHeight === 0 ? 500 : viewportHeight;
    return html`
    <style>
      vaadin-grid-sort-column {
        font-family: monospace; 
        font-size: 0.7rem;
      }
      vaadin-grid vaadin-grid-cell-content {
        font-family: monospace;
        font-size: 0.8rem;
      }
    </style>
    <section>
      <paper-spinner class="big"></paper-spinner>
      <vaadin-grid .multiSort="${true}" style="">
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
        <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererStatus}" .headerRenderer="${this._headerRendererStatus}"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererAction}" .headerRenderer="${this._headerRendererAction}"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererJobType}" .headerRenderer="${this._headerRendererJobType}"></vaadin-grid-column>
        <vaadin-grid-column width="12rem" flex-grow="0" text-align="center" path="job.time_submitted" .headerRenderer="${this._headerRendererJobTimeSubmitted}"></vaadin-grid-column>
        <vaadin-grid-column width="15rem" path="job.id"   .renderer="${this._rendererJobId}"   .headerRenderer="${this._headerRendererJobId}">  </vaadin-grid-column>
        <vaadin-grid-column auto-width path="job.name" .renderer="${this._rendererJobName}" .headerRenderer="${this._headerRendererJobName}"></vaadin-grid-column>
      </vaadin-grid>
      <div id="last-updated" style="text-align: right; font-family: monospace;"></div>

    </section>
    <vaadin-dialog id="job-info-container"></vaadin-dialog>
    <vaadin-dialog id="job-rename-dialog"></vaadin-dialog>
    <vaadin-dialog id="job-image-gallery"></vaadin-dialog>
    <vaadin-dialog id="deleteConfirmDialog" no-close-on-esc no-close-on-outside-click></vaadin-dialog>
    `;
  }

  _headerRendererJobId(root) {
    render(
      html`
        <vaadin-grid-filter path="job.id">
          <vaadin-text-field slot="filter" focus-target label="Job ID" style="max-width: 100%" theme="small" value="${this.jobIdFromUrl}"></vaadin-text-field>
        </vaadin-grid-filter>
        <a title="Clear filter"><iron-icon icon="vaadin:close-circle-o" style="color: gray;"></iron-icon></a>
      `,
      root
    );
    root.querySelector('vaadin-text-field').addEventListener('value-changed', function(e) {
      root.querySelector('vaadin-grid-filter').value = e.detail.value;
      if (e.detail.value === '') {
        root.querySelector('iron-icon').style.display = 'none';
      } else {
        root.querySelector('iron-icon').style.display = 'inline-block';
      }
    });
    root.querySelector('iron-icon').addEventListener('click', function(e) {
      root.querySelector('vaadin-grid-filter').value = '';
      root.querySelector('vaadin-text-field').value = '';
    });
  }

  _headerRendererJobName(root) {
    render(
      html`
        <vaadin-grid-filter path="job.name">
          <vaadin-text-field slot="filter" focus-target label="Job Name" style="max-width: 100%" theme="small" value=""></vaadin-text-field>
        </vaadin-grid-filter>
        <a title="Clear filter"><iron-icon icon="vaadin:close-circle-o" style="color: gray;"></iron-icon></a>
      `,
      root
    );
    root.querySelector('vaadin-text-field').addEventListener('value-changed', function(e) {
      root.querySelector('vaadin-grid-filter').value = e.detail.value;
      if (e.detail.value === '') {
        root.querySelector('iron-icon').style.display = 'none';
      } else {
        root.querySelector('iron-icon').style.display = 'inline-block';
      }
    });
    root.querySelector('iron-icon').addEventListener('click', function(e) {
      root.querySelector('vaadin-grid-filter').value = '';
      root.querySelector('vaadin-text-field').value = '';
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

  _headerRendererStatus(root) {
    render(
      html`
      <vaadin-grid-sorter path="job.status">
        <a title="Job Status"><iron-icon icon="vaadin:dashboard"></iron-icon></a>
      </vaadin-grid-sorter>
      `,
      root
    );
  }

  _headerRendererJobTimeSubmitted(root) {
    render(
      html`
      <vaadin-grid-sorter path="job.time_submitted" direction="desc">
        <a title="Time Submitted"><iron-icon icon="vaadin:clock"></iron-icon></a>
      </vaadin-grid-sorter>
      `,
      root
    );
  }

  _headerRendererJobType(root) {
    render(
      html`
      <vaadin-grid-sorter path="job.type">
        <a title="Job Type"><iron-icon icon="vaadin:cubes"></iron-icon></a>
      </vaadin-grid-sorter>
      `,
      root
    );
  }

  _copyQueryToDbAccessPage(event, query, dialog) {
    store.dispatch(updateQuery(query));
    store.dispatch(loadPage('db-access', this.accessPages));
    dialog.opened = false;
  }

  _jobRenameDialog(jobInfo, message='') {
    const jobDialogPanel = this.shadowRoot.getElementById('job-rename-dialog');
    jobDialogPanel.renderer = (root, dialog) => {
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
          <div style="">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <p style="display: ${message === '' ? 'none' : 'block'}; color: red;">${message}</p>
            <paper-input id="new-job-name-input" ?invalid="${message !== ''}" always-float-label label="New job name" placeholder=${jobInfo.name}></paper-input>
            <paper-button @click="${(e) => {dialog.opened = false; this._renameJob(jobInfo, document.getElementById('new-job-name-input').value);}}" class="des-button" raised>Rename</paper-button>
            <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
          </div>
        `,
        container
      );
    }
    jobDialogPanel.opened = true;
  }

  _renderImage(fileUrl, relPath) {
    let fileParts = fileUrl.split('.');
    if (fileParts.length > 1) {
      let fileExt = fileParts.pop().toLowerCase()
      switch (fileExt) {
        case 'png':
        case 'jpg':
          return html`
            <div style="display: grid; grid-template-columns: 1fr; grid-gap: 5px; align-content: start;">
              <div style="width: 23vw; max-width: 300px; word-wrap: break-word; font-size: 0.7rem; font-family: monospace;">${relPath}</div>
              <div>
                <a style="text-decoration: none;" title="Open image" alt="${relPath}" href="${fileUrl}" target="_blank">
                  <iron-image
                    src="${fileUrl}"
                    alt="${relPath}"
                    style="width:23vw; ; max-width: 300px; height:23vw; max-height: 300px;" sizing="cover">
                  </iron-image>
                </a>
              </div>
            </div>
          `;
          break;
        default:
          return html``;
      }
    } else {
      return html``;
    }
  }

  // _closeImageGallery(dialog, jobId) {
  //   dialog.opened = false;
  //   let newLocation = `${config.frontEndUrl}status/${jobId}`;
  //   if (newLocation !== window.location.href+window.location.pathname) {
  //     history.pushState({}, '', newLocation);
  //   }
  // }

  _imageCount(jobId) {
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    let numImages = 0;
    let job = null;
    for (let i in grid.items) {
      if (grid.items[i].job.id === jobId) {
        job = grid.items[i].job;
        break;
      }
    }
    for (let fileUrlIdx in job.cutout_files) {
      let fileParts = job.cutout_files[fileUrlIdx].split('.');
      if (fileParts.length > 1) {
        let fileExt = fileParts.pop().toLowerCase()
        switch (fileExt) {
          case 'png':
          case 'jpg':
            numImages++;
            break;
          default:
        }
      }
    }

    return numImages;
  }

  _showJobImageGallery(jobId) {
    const jobImageGallery = this.shadowRoot.getElementById('job-image-gallery');
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    let job = null;
    for (var i in grid.items) {
      if (grid.items[i].job.id === jobId) {
        // console.log("job: " + JSON.stringify(grid.items[i].job));
        job = grid.items[i].job;
        break;
      }
    }

    if (job === null || job.cutout_files === null || this._imageCount(jobId) === 0) {
      // If the job has been deleted or not found for some reason, do not open the dialog
      return;
    }

    // // Set URL to the selected job ID so that refreshing the page will reopen the job info dialog
    // let newLocation = `${config.frontEndUrl}status/${jobId}/gallery`;
    // if (newLocation !== window.location.href+window.location.pathname) {
    //   history.pushState({}, '', newLocation);
    // }
    jobImageGallery.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      let images = html`
        ${job.cutout_files.map(i => html`
          ${this._renderImage(`${config.frontEndOrigin}/${config.fileServerRootPath}/${this.username}/cutout/${i}`, i.split('/').splice(1).join('/'))}
        `)}
      `;
      // let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // viewportHeight = viewportHeight === 0 ? 600 : viewportHeight;
      // let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      // viewportWidth = viewportWidth === 0 ? 1000 : viewportWidth;
      render(
        html`
          <style>
            .job-images-container {
              display: grid;
              grid-gap: 1rem;
              padding: 1rem;
              grid-template-columns: 1fr 1fr 1fr;
              box-shadow: inset 0px 5px 5px 0px rgb(200, 200, 200);
            }
          </style>
          <div style="overflow: auto; width: 85vw; max-width: 1000px; height: 85vh;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3>Job Images</h3>
            <div class="job-images-container" style="overflow: auto; height: 70vh;">
              ${images}
            </div>
          </div>
        `,
        container
      );
    }
    jobImageGallery.opened = true;
  }


  _showJobInfo(jobId) {
    const jobInfoPanel = this.shadowRoot.getElementById('job-info-container');
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    var job = null;
    for (var i in grid.items) {
      if (grid.items[i].job.id === jobId) {
        // console.log("job: " + JSON.stringify(grid.items[i].job));
        var job = grid.items[i].job;
        break;
      }
    }
    if (job === null) {
      // If the job has been deleted or not found for some reason, do not open the dialog
      return;
    }

    let showImageGallery = window.location.pathname.split('/').pop() === 'gallery';
    // Set URL to the selected job ID so that refreshing the page will reopen the job info dialog
    let newLocation = `${config.frontEndUrl}status/${jobId}`;
    let currentLocation = window.location.origin+window.location.pathname;
    if (newLocation !== currentLocation) {
      history.pushState({}, '', newLocation);
    }
    jobInfoPanel.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }

      let taskSpecificInfo = null;
      switch (job.type) {
        case 'query':
          if (job.query_files !== null) {
            var numFiles = job.query_files.length;
          } else {
            var numFiles = 0;
          }
          taskSpecificInfo = html`
            <style>
              paper-button {
                margin-top: 10px;
                margin-bottom: 10px;
                background-color: var(--paper-indigo-500);
                color: white;
                width: 100%;
                text-transform: none;
                --paper-button-raised-keyboard-focus: {
                  background-color: var(--paper-indigo-a250) !important;
                  color: white !important;
                };
              }
              .file-list-box {
                overflow: auto;
                /* box-shadow: inset 0px 5px 5px 2px rgb(200, 200, 200); */
                padding: 1rem;
                /* height: 50vh; */
              }
            </style>
            <div>
              <a title="View all files" target="_blank" href="${config.frontEndOrigin}/${config.fileServerRootPath}/${this.username}/query/${job.id}/">
                <paper-button raised>
                  <iron-icon style="margin-right: 10px;" icon="vaadin:folder-open"></iron-icon>
                  View Files (${numFiles})
                </paper-button>
              </a>
            </div>
            <div class="file-list-box"><span class="monospace-column">
            ${job.query_files === null ?
              html``:
              html`
                <ul style="list-style-type: square; margin: 0; padding: 0;">
                  ${job.query_files.map(i => html`
                    <li>
                      <a target="_blank" href="${config.frontEndOrigin}/${config.fileServerRootPath}/${this.username}/query/${job.id}/${i}">${i}</a>
                    </li>
                  `)}
                </ul>
              `
            }
            </span></div>
            <div>
              <a title="Copy query to editor" href="#" onclick="return false;" @click="${(e) => {this._copyQueryToDbAccessPage(e, job.query, dialog)}}">
                <paper-button raised>
                  <iron-icon style="margin-right: 10px;" icon="vaadin:copy-o"></iron-icon>
                  Copy query to editor
                </paper-button>
              </a>
            </div>
            <div>
              <textarea rows="6" style="border: 1px solid #CCCCCC; font-family: monospace; width: 80%; height: 100%;">${job.query}</textarea>
            </div>
          `;
          break;
        case 'cutout':
          let positionTable = [];
          if (job.cutout_summary !== null) {
            // var cutout_summary_text = JSON.stringify(job.cutout_summary, null, 2);
            let tableHeaders = [
              'RA',
              'DEC',
              'COADD_OBJECT_ID',
              'TILENAME',
              'XSIZE',
              'YSIZE',
              'MAKE_FITS',
              'COLORS_FITS',
              'MAKE_RGB_STIFF',
              'RGB_STIFF_COLORS',
              'MAKE_RGB_LUPTON',
              'RGB_LUPTON_COLORS',
              'SEXAGECIMAL',
              'RGB_MINIMUM',
              'RGB_STRETCH',
              'RGB_ASINH',
            ]
            positionTable.push(tableHeaders);
            for (let pos in job.cutout_summary.cutouts) {
              var position = job.cutout_summary.cutouts[pos];
              var tableRow = [];
              for (let header in tableHeaders) {
                tableRow.push(position[tableHeaders[header]]);
              }
              positionTable.push(tableRow)
            }
          } else{
            var cutout_summary_text = '';
          }
          // if (job.cutout_positions !== null) {
          //   var rows = job.cutout_positions.split('\n');
          //   for (let r in rows) {
          //     var cells = rows[r].split(',')
          //     if (cells.length > 0 && cells[0] !== '') {
          //       positionTable.push(cells);
          //     }
          //   }
          // }
          if (job.cutout_files !== null) {
            var numFiles = job.cutout_files.length;
          } else {
            var numFiles = 0;
          }
          taskSpecificInfo = html`
          <style>
            paper-button {
              margin-top: 10px;
              margin-bottom: 10px;
              background-color: var(--paper-indigo-500);
              color: white;
              width: 100%;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            .file-list-box {
              overflow: auto;
              box-shadow: inset 0px 5px 5px 2px rgb(200, 200, 200);
              padding: 2rem;
              height: 20vh;
              margin-bottom: 1rem;
            }
            table {
              width: 100%;
            }
            th, td {
              text-align: left;
              border-bottom: 1px solid #ddd;
              border-right: 1px solid #ddd;
            }
          </style>
            <div></div><div></div>
            <div>
              <div>
                <a title="View all files" target="_blank" href="${config.frontEndOrigin}/${config.fileServerRootPath}/${this.username}/cutout/${job.id}/">
                  <paper-button raised>
                    <iron-icon style="margin-right: 10px;" icon="vaadin:folder-open"></iron-icon>
                    ${job.status === 'init' || job.status === 'started' ? 
                      html`View Files` :
                      html`View Files (${numFiles})`
                    }
                  </paper-button>
                </a>
              </div>

              ${this._imageCount(job.id) === 0 ?
                html``:
                html`
                  <div>
                    <paper-button @click="${(e) => {this._showJobImageGallery(job.id)}}" raised>
                      <iron-icon style="margin-right: 10px;" icon="vaadin:picture"></iron-icon>
                      Open image gallery
                    </paper-button>
                  </div>
                `
              }
            </div>
            ${job.status === 'init' || job.status === 'started' ? 
            html`<div>Job in progress...</div>` :
            html`
              <div>
                <div id="positions" class="file-list-box" style=""><span class="monospace-column">
                ${job.cutout_summary === null ?
                  html``:
                  html`
                    <table>
                    ${positionTable.map(row => html`
                      <tr>
                        ${row.map(cell => html`
                          <td>
                            ${cell}
                          </td>
                        `)}
                      </tr>
                    `)}
                    </table>
                  `
                }
                </span></div>
                <div class="file-list-box" style=""><span class="monospace-column">
                ${job.cutout_files === null ?
                  html``:
                  html`
                    <p><a title="Download archive file" target="_blank" href="${config.frontEndOrigin}/${config.fileServerRootPath}/${this.username}/cutout/${job.id}.tar.gz">
                      Download compressed archive file containing all job files (<code>.tar.gz</code>)
                    </a></p>
                    <ul style="list-style-type: square; margin: 0; padding: 0;">
                      ${job.cutout_files.map(i => html`
                        <li>
                          <a target="_blank" href="${config.frontEndOrigin}/${config.fileServerRootPath}/${this.username}/cutout/${i}">${i.split('/').splice(1).join('/')}</a>
                        </li>
                      `)}
                    </ul>
                  `
                }
                </span></div>

              </div>
            `}
          `;
          break;
        default:
          taskSpecificInfo = html``;
          break;
      }
      // let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // viewportHeight = viewportHeight === 0 ? 600 : viewportHeight;
      render(
        html`
          <style>
            p {
              line-height: 0.8rem;
              color: black;
            }
            .monospace-column {
              font-family: monospace;
              font-size: 0.8rem;
            }
            .job-results-container {
              display: grid;
              grid-gap: 1rem;
              padding: 1rem;
              grid-template-columns: 20% 80%;
              grid-template-rows: min-content min-content min-content min-content min-content min-content min-content 1fr;
              grid-row-gap: 5px;
            }
          </style>
          <div style="overflow: auto; width: 85vw; max-width: 1000px; height: 85vh;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3>Job Results</h3>
            <div class="job-results-container" style="overflow: auto; height: 70vh;">
              <div>Name</div><div><span class="monospace-column">${job.name}</span></div>
              <div>ID</div><div><span class="monospace-column">${job.id}  </span></div>
              <div>Status</div><div>${job.status}</div>
              <div>Type</div><div>${job.type}</div>
              <div>Duration</div><div>${this._displayDuration(job.time_start, job.time_complete)} (${job.time_start} &mdash; ${job.time_complete})</div>
              ${typeof(job.expiration_date) === 'string' && job.expiration_date !== '' ? html`
                <div>Job File Storage</div><div>Files are scheduled for automatic deletion on <b>${job.expiration_date} (UTC)</b>.
                ${typeof(job.renewal_token) === 'string' && job.renewal_token !== '' ? html`
                    <a target="_blank" href="${config.frontEndUrl}renew/${job.renewal_token}">Click here to extend the job file storage.</a>
                  ` : html`
                    There are no more time extensions available.
                  `
                }
                </div>
                ` : html`
                <div></div><div></div>
                `
              }
              ${taskSpecificInfo}
            </div>
          </div>
        `,
        container
      );
    }
    jobInfoPanel.opened = true;
    if (showImageGallery) {
      this._showJobImageGallery(jobId);
    }
  }

  _displayDuration(timeStart, timeComplete) {
    let durationInSeconds = Math.round((Date.parse(timeComplete) - Date.parse(timeStart))/1000);
    let seconds = -1;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let secondsInAMinute = 60;
    let secondsInAnHour = 60*secondsInAMinute;
    let secondsInADay = 24*secondsInAnHour;
    let remainingSeconds = durationInSeconds;
    let outString = '';
    let delimiter = ', '
    switch (true) {
      case (remainingSeconds >= secondsInADay):
        days = Math.floor(remainingSeconds/secondsInADay);
        remainingSeconds = remainingSeconds - secondsInADay*days;
        outString += `${days} days${delimiter}`
      case (remainingSeconds >= secondsInAnHour):
        hours = Math.floor(remainingSeconds/secondsInAnHour);
        remainingSeconds = remainingSeconds - secondsInAnHour*hours;
        outString += `${hours} hrs${delimiter}`
      case (remainingSeconds >= secondsInAMinute):
        minutes = Math.floor(remainingSeconds/secondsInAMinute);
        outString += `${minutes} min${delimiter}`
      default:
        seconds = remainingSeconds - secondsInAMinute*minutes;
        if (seconds >= 0) {
          outString += `${seconds} sec `
        }
    }
    return outString
  }

  _rendererJobId(root, column, rowData) {
    let monospaceText = rowData.item.job.id;
    render(
      html`
        <a href="#" onclick="return false;" @click="${(e) => {this._showJobInfo(rowData.item.job.id);}}"
        title="View details of job ${rowData.item.job.id.substring(0,8)}...">
          <span class="monospace-column">${monospaceText}</span>
        </a>
      `,
      root
    );
  }


  _rendererJobSubmitTime(root, column, rowData) {
    render(
      html`
        <span class="monospace-column">${rowData.item.job.time_submitted}</span>
      `,
      root
    );
  }


  _rendererJobName(root, column, rowData) {
    let monospaceText = rowData.item.job.name;
    render(
      html`
        <style>
        .edit-icon {
          --iron-icon-width: 1rem;
          --iron-icon-height: 1rem;
        }
        </style>
        <a style="text-decoration: none;" href="#" onclick="return false;" @click="${(e) => {this._jobRenameDialog(rowData.item.job);}}"
        title="Rename job">
          <span style="font-size: 0.8rem; color: black;"><iron-icon class="edit-icon" icon="vaadin:pencil"></iron-icon></span>
        </a>&nbsp;
        <a href="#" onclick="return false;" @click="${(e) => {this._showJobInfo(rowData.item.job.id);}}"
        title="View details of job ${rowData.item.job.id.substring(0,8)}...">
          <span class="monospace-column">${monospaceText}</span>
        </a>
      `,
      root
    );
  }

  _renameJob(jobInfo, newJobName) {
    var isValidJobName = newJobName === '' || (newJobName.match(/^[a-z0-9]([-a-z0-9]*[a-z0-9])*(\.[a-z0-9]([-a-z0-9]*[a-z0-9])*)*$/g) && newJobName.length < 129);
    if (!isValidJobName) {
      this._jobRenameDialog(jobInfo, 'Invalid job name');
      return;
    }
    const Url=config.backEndUrl + "job/rename"
    let body = {
      'job-id': jobInfo.id,
      'job-name': newJobName
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
        // TODO: Figure out how to update vaadin-grid immediately here
        this.shadowRoot.querySelector('paper-spinner[class="big"]').active = true;
        this._fetchJobUpdates([jobInfo.id]);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _rendererAction(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    // Assign the listener callback to a variable
    // TODO: Add a "cancel job" button that stops the process but does not delete the generated files.
    // if (rowData.item.job.status === "started" || rowData.item.job.status === "init") {
    if (false) {
      render(
        html`
          <a href="#" onclick="return false;"><iron-icon @click="${(e) => {this._cancelJob(rowData.item.job.id)}}" icon="vaadin:power-off" style="color: blue;"></iron-icon></a>
        `,
        container
      );
    } else {
      let selected = this.shadowRoot.querySelector('vaadin-grid').selectedItems;
      if (selected.length === 0) {
        render(
          html`
            <a title="Delete Job ${rowData.item.job.id.substring(0,8)}..." onclick="return false;"><iron-icon @click="${(e) => {this._deleteJobConfirm(rowData.item.job.id)}}" icon="vaadin:trash" style="color: darkgray;"></iron-icon></a>
          `,
          container
        );
      } else {
        if (selected.map((e) => {return e.job.id}).indexOf(rowData.item.job.id) > -1) {
          render(
            html`
              <a title="Delete (${selected.length}) Selected Jobs" onclick="return false;"><iron-icon @click="${(e) => {this._deleteJobConfirm(rowData.item.job.id)}}" icon="vaadin:trash" style="color: red;"></iron-icon></a>
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
  }

  _rendererStatus(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    switch (rowData.item.job.status) {
      case 'success':
        var color = 'green';
        var icon = 'vaadin:check-circle-o';
        var tooltip = 'Complete';
        break;
      case 'init':
      case 'started':
        var color = 'orange';
        var icon = 'vaadin:hourglass';
        var tooltip = 'In Progess';
        break;
      case 'failure':
      case 'unknown':
        var color = 'red';
        var icon = 'vaadin:close-circle-o';
        var tooltip = 'Failed';
        break;
      default:
        var color = 'purple';
        var icon = 'vaadin:question-circle-o';
        var tooltip = 'Error';
        break;
    }
    render(
      html`
        <a title="${tooltip}"><iron-icon icon="${icon}" style="color: ${color};"></iron-icon></a>
      `,
      container
    );

  }

  rendererJobType(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    switch (rowData.item.job.type) {
      case 'test':
        var color = 'black';
        var icon = 'vaadin:stopwatch';
        var type = 'Test';
        break;
      case 'query':
        var color = 'black';
        var icon = 'vaadin:code';
        var type = 'DB Query';
        break;
      case 'cutout':
        var color = 'black';
        var icon = 'vaadin:scissors';
        var type = 'Cutout';
        break;
      default:
        var color = 'purple';
        var icon = 'vaadin:question-circle-o';
        var type = 'Other';
        break;
    }
    render(
      html`
        <a title="Type: ${type}"><iron-icon icon="${icon}" style="color: ${color};"></iron-icon></a>
      `,
      container
    );

  }

  _updateStatusAll() {
    const Url=config.backEndUrl + "job/status"
    let body = {
      'job-id': 'all',
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
        this._updateGridData(data.jobs);
        this._updateLastUpdatedDisplay();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
      this.shadowRoot.querySelector('paper-spinner[class="big"]').active = false;
    });
  }

  _updateStatus() {
    const Url=config.backEndUrl + "job/list"
    const param = {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    };
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        // console.log(`Number of jobs in /job/list: ${data.jobs.length}`);
        // console.log(JSON.stringify(data, null, 2));
        // console.log(`Fetched job list (${data.jobs.length})`);
        // console.log(`Fetched job list (${data.jobs.length}): ${JSON.stringify(data.jobs.map((e) => {return e.job_id}), null, 2)}`);
        this._reconcileStatusTable(data.jobs);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
      this.shadowRoot.querySelector('paper-spinner[class="big"]').active = false;
    });
  }

  _reconcileStatusTable(jobs) {
    const grid = this.shadowRoot.querySelector('vaadin-grid');

    // console.log(`Current grid items (${grid.items.length})`);
    // console.log(`Current grid items (${grid.items.length}): ${JSON.stringify(grid.items.map((e) => {return e.job.id}), null, 2)}`);
    let gridItems = [];

    let newJobIds = [];
    let oldJobIds = [];
    let updatedJobIds = [];
    for (let i in jobs) {
      // If the fetched job ID is not listed in the table, it is a new job that needs to be added
      var idx = grid.items.map((e) => {return e.job.id}).indexOf(jobs[i].job_id);
      if (idx < 0) {
        newJobIds.push(jobs[i].job_id);
        // console.log(`New job: ${jobs[i].job_id}`);
      } else {
        // If the job exists in the table, detect status changes indicating updated info is needed
        var tableJobStatus = grid.items[idx].job.status;
        var newJobStatus = jobs[i].job_status;
        if (tableJobStatus !== newJobStatus) {
          updatedJobIds.push(jobs[i].job_id);
          // console.log(`Updated job: ${jobs[i].job_id}`);
        }
      }
    }
    for (let i in grid.items) {
      // If a job in the table is missing from the fetched job IDs, it must be deleted
      var idx = jobs.map((e) => {return e.job_id}).indexOf(grid.items[i].job.id);
      if (idx < 0) {
        oldJobIds.push(grid.items[i].job.id);
      }
    }

    // Remove the old jobs
    for (let i in grid.items) {
      if (oldJobIds.indexOf(grid.items[i].job.id) < 0) {
        gridItems.push(grid.items[i]);
      } 
      // else {
        // console.log(`Deleting old job: ${grid.items[i].job.id}`);
      // }
    }
    grid.items = gridItems;
    grid.recalculateColumnWidths();

    // Remove any redundant job IDs
    var jobsIdsToAdd = newJobIds.concat(updatedJobIds);
    var jobIdSet = new Set(jobsIdsToAdd);
    jobsIdsToAdd = Array.from(jobIdSet);
    this._fetchJobUpdates(jobsIdsToAdd);
  }

  _fetchJobUpdates(jobIds) {
    for (let i in jobIds) {
      var jobId = jobIds[i];
      console.log(`Fetching status of job: ${jobId}`);
      const Url=config.backEndUrl + "job/status"
      let body = {
        'job-id': jobId,
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
          this._addJobToGridData(data.jobs);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    }
    this._updateLastUpdatedDisplay();
  }

  _addJobToGridData(jobs) {
    // TODO: This code is redundant with `_updateGridData` and should be moved to separate functions
    let grid = this.shadowRoot.querySelector('vaadin-grid');
    let gridItems = grid.items;
    let gridItemsOriginal = grid.items;
    let ctr = 0
    jobs.forEach((item, index, array) => {
      let job = {};
      job.id = item.job_id;
      // console.log(`Adding job to table: ${JSON.stringify(job.id)}`);
      job.name = item.job_name;
      job.status = item.job_status;
      job.type = item.job_type;
      job.time_start = item.job_time_start;
      job.time_complete = item.job_time_complete;
      job.time_submitted = '0000-00-00 00:00:00';
      if (item.job_time_submitted) {
        let job_time_submitted = item.job_time_submitted.replace(' ','T') + 'Z';
        job.time_submitted = this.convertToLocalTime(job_time_submitted);
      } 
      job.data = typeof(item.data) === 'string' ? JSON.parse(item.data) : null;
      job.query = item.query;
      job.query_files = typeof(item.query_files) === 'object' ? item.query_files : null;
      job.cutout_files = typeof(item.cutout_files) === 'object' ? item.cutout_files : null;
      job.cutout_summary = typeof(item.cutout_summary) === 'object' ? item.cutout_summary : null;
      job.cutout_positions = typeof(item.cutout_positions) === 'string' ? item.cutout_positions : null;
      job.renewal_token = typeof(item.renewal_token) === 'string' ? item.renewal_token : null;
      job.expiration_date = typeof(item.expiration_date) === 'string' ? item.expiration_date : null;
      // console.log(JSON.stringify(job, null, 2));
      if (job.type !== 'query' || job.data === null) {

        var idx = gridItems.map((e) => {return e.job.id}).indexOf(job.id);
        if (idx > -1) {
          gridItems[idx] = {job: job};
        } else {
          gridItems.push({job: job});
        }
      }
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        var newJobs = new Set([...(new Set(grid.items))].filter(x => !(new Set(gridItemsOriginal)).has(x)));
        console.log(JSON.stringify(newJobs, null, 2));

        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.job.id}).indexOf(grid.selectedItems[i].job.id) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.job.id}).indexOf(grid.items[i].job.id) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        grid.recalculateColumnWidths();
      }
    })

  }

  _updateLastUpdatedDisplay() {

    let newDate = new Date();
    let datetime = "Last updated: " + newDate.today() + " @ " + newDate.timeNow();
    render(
      html`
        ${datetime}
      `,
      this.shadowRoot.getElementById('last-updated')
    );
  }

  _updateGridData(jobs) {
    // TODO: This code is redundant with `_addJobToGridData` and should be moved to separate functions
    let grid = this.shadowRoot.querySelector('vaadin-grid');
    let gridItems = []
    // If there are no jobs in the returned list, allow an empty table
    if (jobs.length === 0) {
      grid.items = gridItems;
    }
    let ctr = 0
    jobs.forEach((item, index, array) => {
      let job = {};
      job.id = item.job_id;
      job.name = item.job_name;
      job.status = item.job_status;
      job.type = item.job_type;
      job.time_start = item.job_time_start;
      job.time_complete = item.job_time_complete;
      job.time_submitted = '0000-00-00 00:00:00';
      if (item.job_time_submitted) {
        let job_time_submitted = item.job_time_submitted.replace(' ','T') + 'Z';
        job.time_submitted = this.convertToLocalTime(job_time_submitted);
      } 
      job.data = typeof(item.data) === 'string' ? JSON.parse(item.data) : null;
      job.query = item.query;
      job.query_files = typeof(item.query_files) === 'object' ? item.query_files : null;
      job.cutout_files = typeof(item.cutout_files) === 'object' ? item.cutout_files : null;
      job.cutout_summary = typeof(item.cutout_summary) === 'object' ? item.cutout_summary : null;
      job.cutout_positions = typeof(item.cutout_positions) === 'string' ? item.cutout_positions : null;
      job.renewal_token = typeof(item.renewal_token) === 'string' ? item.renewal_token : null;
      job.expiration_date = typeof(item.expiration_date) === 'string' ? item.expiration_date : null;
      // console.log(JSON.stringify(job, null, 2));
      if (job.type !== 'query' || job.data === null) {
        gridItems.push({job: job});
      }
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        // console.log(JSON.stringify(gridItems, null, 2));
        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.job.id}).indexOf(grid.selectedItems[i].job.id) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.job.id}).indexOf(grid.items[i].job.id) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        grid.recalculateColumnWidths();
        if (this.jobIdFromUrl !== '' && this.initialJobInfoPopup) {
          this.initialJobInfoPopup = false;
          this._showJobInfo(this.jobIdFromUrl);
        }
      }
    })
  }

  _cancelJob(jobId) {
    this._deleteJobConfirm(jobId);
  }

  _deleteJobConfirm(jobId) {
    this.jobToDelete = jobId;
    this.shadowRoot.getElementById('deleteConfirmDialog').opened = true;
  }

  _deleteJob(jobId) {
    let grid = this.shadowRoot.querySelector('vaadin-grid');
    let jobIds = [];
    if (grid.selectedItems.length === 0 ) {
      jobIds.push(jobId);
    } else {
      if (grid.selectedItems.map((e) => {return e.job.id}).indexOf(jobId) > -1) {
        for (let i in grid.selectedItems) {
          jobIds.push(grid.selectedItems[i].job.id);
        }
      }
    }
    for (let i in jobIds) {
      let jobId = jobIds[i];
      console.log(`Deleting job "${jobId}"...`);
      const Url=config.backEndUrl + "job/delete"
      let body = {
        'job-id': jobId,
      };
      const param = {
        method: "DELETE",
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
          // console.log(JSON.stringify(data));
          this._updateStatus();
        } else {
          console.log(JSON.stringify(data));
        }
      });
    }
  }

  _deleteConfirmDialogRenderer(root, dialog) {
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
        <p style="text-align: center;font-size: 1.2rem;">Are you sure?</p>
        <paper-button @click="${(e) => {dialog.opened = false; this._deleteJob(this.jobToDelete);}}" class="des-button" raised>Delete</paper-button>
        <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
      </div>
      `,
      container
    );
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.query = state.app.query;
    this.jobIdFromUrl = state.app.jobId;
    this._page = state.app.page;
    this.accessPages = state.app.accessPages;
    if (this.refreshStatusIntervalId === 0) {
      this.refreshStatusIntervalId = window.setInterval(() => {
        if (this._page === 'status') {
          this._updateStatus();
        }
      }, 10000);
    }
  }

  firstUpdated() {
    // Delete job confirmation dialog renderer
    const dialog = this.shadowRoot.getElementById('deleteConfirmDialog');
    dialog.renderer = this._deleteConfirmDialogRenderer;
    // Trigger an immediate job status update upon page load
    this.shadowRoot.querySelector('paper-spinner[class="big"]').active = true;
    this._updateStatusAll();
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'active':
          if (this.active) {
            this._updateStatusAll()
          }
          break;
        case '_selectedItems':
          break;
        default:
          break
      }
    });
  }
}

window.customElements.define('des-job-status', DESJobStatus);
