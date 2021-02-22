import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-slider/paper-slider.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';

class DESTileFinder extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
        .monospace-column {
          font-family: monospace;
          font-size: 1.0rem;
        }
        .results-container {
          display: grid;
          grid-gap: 1rem;
          padding: 1rem;
          grid-template-columns: 20% 80%;
          grid-template-rows: min-content min-content min-content min-content min-content min-content 1fr;
          grid-row-gap: 5px;
          font-size: 1.2rem;
        }
        iron-icon.download-icon {
          --iron-icon-width:  0.8rem;
          --iron-icon-height: 0.8rem;
          color: darkgray;
          margin-right: 1rem;
        } 
          h2 {
            text-align: left;
            font-size: 1.5rem;
          }
          /* coadd table layout */
          table#coadd-table {
              /*border: 1px solid #ddd;*/
          }

          th.coadd-th, td.coadd-td {
              padding: 5px;
              text-align: left;
              border: 1px solid white;
              vertical-align: middle;
          }

          td.coadd-td:nth-child(odd) {
              background: linear-gradient(to right, #efeaf4, white);
          }

          .caption {
              padding-left: 15px;
              color: #a0a0a0;
          }

          .card-content {
              @apply(--layout-vertical);
          }
          .coadd-container {
              margin-top: 10px;
              @apply(--layout-horizontal);
          }
          .container2 {
              @apply(--layout-horizontal);
              @apply(--layout-center-justified);
          }
          .container3 {
              @apply(--layout-horizontal);
              @apply(--layout-around-justified);
          }

          .left {
              @apply(--layout-flex);
          }
          .left2 {
              @apply(--layout-flex);
              text-align: center;

          }
          .right {
              @apply(--layout-flex);
          }
          .right2 {
              @apply(--layout-flex-2);
              text-align: center;

          }

          .mid {
              @apply(--layout-flex);
          }
          .flex3child {
              @apply(--layout-flex-3);
          }
          .flex4child {
              @apply(--layout-flex-4);
          }

          paper-slider {
              width: 100%;
          }

          hr {
              display: block;
              border: 1px solid gray;
              opacity: 0.2;

          }

          paper-icon-item {
              /*background: linear-gradient(to right, #efeaf4, white);*/
          }

          .buttonLook{
              border: 4px solid #ccc;
              border-style: outset;
              border-radius: 10px;
          }
          .btcell {
              text-align: center;
          }

          .download {
            display: flex;
            width: 100%;
            height: 10%;
          }

          .around-cell {
              @apply(--layout-horizontal);
              @apply(--layout-around-justified);
          }

          .around-cell2 {
              @apply(--layout-horizontal);
              @apply(--layout-center-justified);
          }

          .toast-position {
              /* right: 50%; */
          }
          .toast-error {
            --paper-toast-color: #FFD2D2 ;
            --paper-toast-background-color: #D8000C;
          }
          .toast-success {
            --paper-toast-color:  #DFF2BF;
            --paper-toast-background-color: #4F8A10;
          }
          /* .invalid-form-element {
            color: red;
            border-color: red;
            border-width: 1px;
            border-style: dashed;
          } */

          .grid-system {
              display: grid;
              grid-gap: 1rem;
              padding: 1rem;
          }
          .position-section {
            grid-template-columns: 70% 30%;
          }
          section {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          h2 {
            padding-top: 0;
            padding-bottom: 0;
          }

          @media (min-width: 1001px) {
            #submit-container {
              left: 250px;
            }

          }
          .valid-form-element {
            display: none;
          }

          .invalid-form-element {
            display: block;
            color: red;
            font-size: 0.75rem;
            padding-left:2rem;
            max-width: 500px;
          }

          paper-button.y6a2 {
            background-color: var(--paper-purple-500);
            color: white;
          }
          paper-button.y3a2 {
            background-color: var(--paper-blue-500);
            color: white;
          }
          paper-button.y5a1 {
              background-color: var(--paper-yellow-900);
              color: white;
          }
          paper-button.y1a1 {
              background-color: var(--paper-green-500);
              color: white;

          }
          paper-button.dr1 {
              background-color: black;
              color: white;

          }
          paper-button.dr2 {
              background-color: var(--paper-red-500);
              color: white;

          }
          paper-button.sva1 {
              background-color: var(--paper-red-500);
              color: white;
          }

          paper-button[disabled] {
            background: #eaeaea;
            color: #a8a8a8;
            cursor: auto;
            pointer-events: none;
        }

        }
        `,

    ];
  }

  static get properties() {
    return {
      _value: { type: Number },
      msg: {type: String},
      username: {type: String},
      results: {type: String},
      customJobName: {type: String},
      tileName: {type: String},
      tileCenter: {type: String},
      nObjects: {type: String},
      raCorners: {type: String},
      decCorners: {type: String},
      customCoords: {type: String},
      ra: {type: String},
      raAdjusted: {type: String},
      dec: {type: String},
      files: {type: Object},
      refreshStatusIntervalId: {type: Number},
      release: {type: String},
      data: {type: Object},
      allLinks: {type: Object},
    };
  }

  constructor(){
    super();
    this.username = '';
    this.msg = '';
    this.results = '';
    this.tileName = '';
    this.tileCenter = '';
    this.nObjects = '';
    this.raCorners = '';
    this.decCorners = '';
    this.customCoords = '';
    this.refreshStatusIntervalId = 0;
    this.ra = '';
    this.raAdjusted = '';
    this.dec = '';
    this.files = {};
    this.allLinks = html``;
    this.release = '';
    this.data = null;
  }

  render() {
    return html`
    <div>
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DES TileFinder
          <paper-spinner class="big"></paper-spinner>
        </div>
            <div class="flex" style="display: inline-block;">
              <p style="margin-top: 0;">Search a tile by position or name. </p>
              <paper-input 
                style=" margin-top: -30px; float: left; max-width: 50%; padding-left:2rem;"
                placeholder="Position (ra,dec)"
                @change="${(e) => {this.customCoords = e.target.value}}"
                id="custom-coords" name="custom-coords" class="custom-coords">
                <paper-icon-button slot="suffix" icon="search" @click="${(e) => this._submit('coords')}"></paper-icon-button>
                
                </paper-input>
                <paper-input
                style="margin-top: -30px; float: left; max-width: 50%; padding-left:2rem;"
                placeholder="Tilename"
                @change="${(e) => {this.tileName = e.target.value}}"
                id="custom-tile" name="custom-tile" class="custom-tile">
                <paper-icon-button slot="suffix" icon="search" @click="${(e) => this._submit('name')}"></paper-icon-button>
                
              </paper-input>
            </div>
      </section>
      <section>
        <h2>Tile Properties</h2>
        <div class="results-container">
          <div>Name</div><div><span class="monospace-column">${this.displayTile}</span></div>
          <div>Tile Center</div><div><span class="monospace-column">${this.tileCenter}  </span></div>
          <div>No. Objects</div><div><span class="monospace-column">${this.nObjects}</span></div>
          <div>RA Corners</div><div><span class="monospace-column">${this.raCorners}</span></div>
          <div>DEC Corners</div><div><span class="monospace-column">${this.decCorners}</span></div>
        </div>

        ${config.desaccessInterface === 'public' ? html`
        <paper-button disabled raised class="dr1"  @click="${(e) => this._getFiles(e,'DR1')}">DR1</paper-button>
        <paper-button disabled raised class="dr2"  @click="${(e) => this._getFiles(e,'DR2')}">DR2</paper-button>
        ` : html`
        <paper-button disabled raised class="y6a2" @click="${(e) => this._getFiles(e,'Y6A2')}">Y6A2</paper-button>
        <paper-button disabled raised class="y3a2" @click="${(e) => this._getFiles(e,'Y3A2')}">Y3A2</paper-button>
        <paper-button disabled raised class="y1a1" @click="${(e) => this._getFiles(e,'Y1A1')}">Y1A1</paper-button>
        <paper-button disabled raised class="sva1" @click="${(e) => this._getFiles(e,'SVA1')}">SVA1</paper-button>
        `}
        <br><br>
        <!-- Click <a href="https://desar2.cosmology.illinois.edu/DESFiles/desarchive/OPS/multiepoch/"> here</a> to get access to all campaign tiles<a href></a> -->
      </section>
      <section>
        ${this.allLinks}
      </section>
      <div>
        <paper-toast class="toast-position toast-error" id="toast-job-failure" text="ERROR! There was an error. Please try again" duration="7000"> </paper-toast>
      </div>
    </div>
    `;
  }

  firstUpdated() {
    this.shadowRoot.querySelector('#custom-coords').onkeydown = (e) => {
      if (e.keyCode == 13) {
        this.customCoords = this.shadowRoot.querySelector('#custom-coords').value;
        this._submit('coords');
      }
    };
    this.shadowRoot.querySelector('#custom-tile').onkeydown = (e) => {
      if (e.keyCode == 13) {
        this.tileName = this.shadowRoot.querySelector('#custom-tile').value;
        this._submit('name');
      }
    };
  }

  _getFiles(event,release){
    this.release = release.toLowerCase();
    
    let el = this.shadowRoot.getElementById(`${this.release}-links`);
    window.scrollTo({
      top: el.getBoundingClientRect().top - 60,
      behavior: 'smooth'
    })
    
    return;
    
  } 

  stateChanged(state) {
    this.username = state.app.username;
    this.db = state.app.db;
    this.email = this.email === '' ? state.app.email : this.email;

  }

  _submit(type) {
    this._getTileInfo(type);
    if (type === 'coords') {
      this.shadowRoot.querySelector('#custom-tile').value = ''
    } else {
      this.shadowRoot.querySelector('#custom-coords').value = ''
    }
  }
  _getTileInfo(type) {
    this.allLinks = html``;
    this.shadowRoot.querySelector('paper-spinner').active = true;
  
    this.raCorners = '';
    this.decCorners = '';
    this.tileCenter = '';
    this.nObjects = '';
    this.displayTile = '';
    if (config.desaccessInterface !== 'public') {
      this.shadowRoot.querySelectorAll("paper-button.sva1")[0].disabled = true;
      this.shadowRoot.querySelectorAll("paper-button.y1a1")[0].disabled = true;
      this.shadowRoot.querySelectorAll("paper-button.y3a2")[0].disabled = true;
      this.shadowRoot.querySelectorAll("paper-button.y6a2")[0].disabled = true;
    } else {
      this.shadowRoot.querySelectorAll("paper-button.dr1")[0].disabled = true;
      this.shadowRoot.querySelectorAll("paper-button.dr2")[0].disabled = true;
    }

    let body = {}
    let Url=config.backEndUrl + "tiles/info/";
    if (type === 'coords'){
      Url += 'coords';
      body = {
        'coords': this.customCoords
      }
    }
    else {
      Url += 'name';
      body = {
        'name': this.tileName
      }
    }
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
        let results = data.results;
        this.results = results;
        this._setValuesFromQuickQueryResults(data);
        // for (let i in data.links) {
        //   console.log(data.links[i]);
        // }
      } else {
        this.shadowRoot.getElementById('toast-job-failure').text = 'Error searching for files: ' + data.message;
        this.shadowRoot.getElementById('toast-job-failure').show();
        console.log(JSON.stringify(data));
      }
    });

  }

  _setValuesFromQuickQueryResults(response){

    this.files = {}

    if (response.releases.length == 0){
      this.shadowRoot.getElementById('toast-job-failure').text = 'No files found!';
      this.shadowRoot.getElementById('toast-job-failure').show();
    }
    else {
      this.allLinks = html`
        <h2>Tile Data Downloads</h2>
      `;
      this.tileName = response.tilename;
      this.displayTile = this.tileName;

      this.tileCenter = response.ra_cent + ", " + response.dec_cent;
      this.raCorners = response.racmin + ", " + response.racmax;
      this.decCorners = response.deccmin + ", " + response.deccmax;

      console.log(response.releases);
      for (let i = 0; i < response.releases.length; i++) {
        let release = response.releases[i]["release"].toLowerCase();
        this.files[release] = {}
        if (response.releases[i]["num_objects"] !== 0 && response.releases[i]["num_objects"] !== '') {
          this.nObjects = response.releases[i]["num_objects"];
        } else {
          this.nObjects = '(varies by release)';
        }
        for (let band in response.releases[i].bands) {

          if (response.releases[i].tiff_image !== '') {
            this.files[release][`Color Image (TIFF)`] = response.releases[i].tiff_image   + "?token=" + localStorage.getItem("token");
          }
          if (response.releases[i].bands[band].image !== '') {
            this.files[release][`"${band}"-band Image`] = response.releases[i].bands[band].image   + "?token=" + localStorage.getItem("token");
          }
          if (response.releases[i].bands[band].image_nobkg !== '') {
            this.files[release][`"${band}"-band Image (no background subtraction)`] = response.releases[i].bands[band].image_nobkg   + "?token=" + localStorage.getItem("token");
          }
          if (response.releases[i].bands[band].catalog !== '') {
            this.files[release][`"${band}"-band Catalog`] = response.releases[i].bands[band].catalog   + "?token=" + localStorage.getItem("token");
          }
          if (response.releases[i].detection !== '') {
            // Color combination of bands R,I,Z typically, used to detect source objects
            this.files[release]['Detection Image'] = response.releases[i].detection   + "?token=" + localStorage.getItem("token");
          }
          if (response.releases[i].main !== '') {
            this.files[release]['Main Catalog'] = response.releases[i].main   + "?token=" + localStorage.getItem("token");
          }
          if (response.releases[i].magnitude !== '') {
            this.files[release]['Magnitude Catalog'] = response.releases[i].magnitude   + "?token=" + localStorage.getItem("token");
          }
          if (response.releases[i].flux !== '') {
            this.files[release]['Flux Catalog'] = response.releases[i].flux   + "?token=" + localStorage.getItem("token");
          }
          this.shadowRoot.querySelectorAll(`paper-button.${release}`)[0].disabled = false;
        }
        let links = [];
        for (let link in this.files[release]) {
          links.push(html`
            <li>
            <a href="${this.files[release][link]}" target="_blank"  style="text-decoration: none; color: inherit;">
            <iron-icon icon="vaadin:download" class="download-icon"></iron-icon>
            ${link}
            </a></li>
          `);
        }
        this.allLinks = html`${this.allLinks}
        <a href="#" onclick="return false;" title="Back to top" style="text-decoration: none; color: inherit;">
        <h3 id="${release}-links" @click="${(e) => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });}}">
          ${release.toUpperCase()}
          <iron-icon icon="vaadin:angle-double-up"></iron-icon>
          </h3></a>
        <ul style="list-style-type: none; margin: 0; padding: 1rem; line-height: 2rem;">${links}</ul>
        `
      }
    }
  }
}

window.customElements.define('des-tilefinder', DESTileFinder);
