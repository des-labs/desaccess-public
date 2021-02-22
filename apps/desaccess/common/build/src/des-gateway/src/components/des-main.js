/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import {
  navigate,
  loadPage,
  updateDrawerState,
  updateDrawerPersist,
  loginUser,
  logoutUser,
  getProfile
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-image/iron-image.js';
import './des-toolbar.js';
import './des-sidebar.js';
import { config } from './des-config.js';

class DESMain extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
      _session: {type: Boolean},
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _drawerPersisted: { type: Boolean },
      username: {type: String},
      name: {type: String},
      email: {type: String},
      database: {type: String},
      accessPages: {type: Array},
      _listPages: {type: Array},
      roles: {type: Array}
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #E91E63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: white;
          --app-drawer-text-color: black;
          --app-drawer-selected-color: black;
        }


        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
          z-index: 5;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 0px;
          padding-top: 20px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
          font-weight: bold;
          background-color: lightgray;
        }

        .drawer-list > a:hover {
          background-color: lightgray;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 80vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 5px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        @media (min-width: 1001px) {
          .main-content {
            padding-top: 107px;
            margin-left: 256px;
          }


        }
      `
    ];
  }

  _renderMenuItem(linkText, pageName, iconName) {
    return html`
      <a ?selected="${this._page === pageName}" href="${config.frontEndUrl + pageName}">
        <iron-icon icon="${iconName}" style="color: black; margin-right: 1rem;"></iron-icon>
        ${linkText}
      </a>
      `
  }

  render() {
    return html`
      <!-- Header -->
      <app-header fixed>
        <des-toolbar name=${this.name} @clickMenu=${this._menuButtonClicked}></des-toolbar>
      </app-header>

      <!-- Drawer content -->
      <app-drawer style="z-index: 20;"
          .opened="${this._drawerOpened}"
          .persistent="${this._drawerPersisted}"
          @opened-changed="${this._drawerOpenedChanged}"
          transition-duration=0
       >
       <des-sidebar name=${this.name} email=${this.email}></des-sidebar>
        <nav class="drawer-list">
          ${this.accessPages.includes('home')  ? this._renderMenuItem('Home', 'home', 'vaadin:home') : html ``}
          ${this.accessPages.includes('test-job')  ? this._renderMenuItem('Submit Test Job', 'test-job', 'vaadin:stopwatch') : html ``}
          ${this.accessPages.includes('db-access') ? this._renderMenuItem('DB Access', 'db-access', 'vaadin:code') : html ``}
          ${this.accessPages.includes('tables') ? this._renderMenuItem('DB Tables', 'tables', 'vaadin:table') : html ``}
          ${this.accessPages.includes('tilefinder') ? this._renderMenuItem('DES TileFinder', 'tilefinder', 'vaadin:globe-wire') : html ``}
          ${this.accessPages.includes('cutout') && this.database !== 'desoper'   ? this._renderMenuItem('Cutout Service', 'cutout', 'vaadin:scissors') : html ``}
          ${this.accessPages.includes('status')    ? this._renderMenuItem('Job Status', 'status', 'vaadin:cogs') : html ``}
          ${this.accessPages.includes('jupyter')    ? this._renderMenuItem('JupyterLab', 'jupyter', 'vaadin:notebook') : html ``}
          ${this.accessPages.includes('ticket')    ? this._renderMenuItem('DES Ticket', 'ticket', 'vaadin:clipboard-user') : html ``}
          ${this.accessPages.includes('users')    ? this._renderMenuItem('User Management', 'users', 'vaadin:users') : html ``}
          ${this.accessPages.includes('notifications')    ? this._renderMenuItem('Notifications', 'notifications', 'vaadin:envelope-open-o') : html ``}
          <a href="${config.frontEndUrl + 'docs'}" target="_blank">
            <iron-icon icon="vaadin:open-book" style="color: black; margin-right: 1rem;"></iron-icon>
            Docs
          </a>
          ${this.accessPages.includes('help')  ? this._renderMenuItem('Help', 'help', 'vaadin:question-circle-o') : html ``}
          <div style="display: grid; grid-template-columns: 25% 1fr; position: absolute; bottom: 50px;left: 10px;">
            <div>
              <a href="https://www.nsf.gov/" target="_blank" alt="NSF Logo" title="National Science Foundation">
                <iron-image src="images/NSF_4-Color_bitmap_Logo_100px.png" sizing="contain" style="width: 60px; height: 100px;"></iron-image>
              </a>
            </div>
            <div>
              <a href="http://www.ncsa.illinois.edu/" target="_blank" alt="NCSA Logo" title="National Center for Supercomputing Applications">
              <iron-image src="images/NCSA_FullColor_RGB.png" sizing="contain" style="width: 180px; height: 100px;"></iron-image>
              </a>
            </div>
          </div>
          </nav>
          
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        
        <!-- Public content -->

        <des-login class="page" ?active="${this._page === 'login'}" ></des-login>
        <des-activate class="page" ?active="${this._page === 'activate'}"></des-activate>
        <des-reset class="page" ?active="${this._page === 'reset'}"></des-reset>
        <des-renew class="page" ?active="${this._page === 'renew'}"></des-renew>
        <des-404 class="page" ?active="${this._page === 'des404'}"></des-404>

        <!-- Access controlled content -->
        
        ${this.accessPages.includes('home') ?
          html`<des-home class="page" ?active="${this._page === 'home'}"></des-home>` :
          html`<des-access-denied class="page" ?active="${this._page === 'home'}"></des-access-denied>`}
        ${this.accessPages.includes('help') ?
          html`<des-help class="page" ?active="${this._page === 'help'}"></des-help>` :
          html`<des-access-denied class="page" ?active="${this._page === 'help'}"></des-access-denied>`}
        ${this.accessPages.includes('test-job') ?
          html`<des-test-job class="page" ?active="${this._page === 'test-job'}"></des-test-job>` :
          html`<des-404 class="page" ?active="${this._page === 'test-job'}"></des-404>`}
        ${this.accessPages.includes('db-access') ?
          html`<des-db-access class="page" ?active="${this._page === 'db-access'}"></des-db-access>` :
          html`<des-404 class="page" ?active="${this._page === 'db-access'}"></des-404>`}
        ${this.accessPages.includes('tables') ?
          html`<des-tables class="page" ?active="${this._page === 'tables'}"></des-tables>` :
          html`<des-404 class="page" ?active="${this._page === 'db-access'}"></des-404>`}
        ${this.accessPages.includes('tilefinder') ?
          html`<des-tilefinder class="page" ?active="${this._page === 'tilefinder'}"></des-tilefinder>` :
          html`<des-404 class="page" ?active="${this._page === 'db-access'}"></des-404>`}
        ${this.accessPages.includes('cutout') && this.database !== 'desoper' ?
          html`<des-cutout class="page" ?active="${this._page === 'cutout'}"></des-cutout>` :
          html`<des-404 class="page" ?active="${this._page === 'cutout'}"></des-404>`}
        ${this.accessPages.includes('status') ?
          html`<des-job-status class="page" ?active="${this._page === 'status'}"></des-job-status>` :
          html`<des-404 class="page" ?active="${this._page === 'status'}"></des-404>`}
        ${this.accessPages.includes('jupyter') ?
          html`<des-jupyter class="page" ?active="${this._page === 'jupyter'}"></des-jupyter>` :
          html`<des-404 class="page" ?active="${this._page === 'jupyter'}"></des-404>`}
        ${this.accessPages.includes('ticket') ?
          html`<des-ticket class="page" ?active="${this._page === 'ticket'}"></des-ticket>` :
          html`<des-404 class="page" ?active="${this._page === 'ticket'}"></des-404>`}
        ${this.accessPages.includes('users') ?
          html`<des-users class="page" ?active="${this._page === 'users'}"></des-users>` :
          html`<des-404 class="page" ?active="${this._page === 'users'}"></des-404>`}
        ${this.accessPages.includes('notifications') ?
          html`<des-notifications class="page" ?active="${this._page === 'notifications'}"></des-notifications>` :
          html`<des-404 class="page" ?active="${this._page === 'notifications'}"></des-404>`}

      </main>


      <footer>
        <p style="font-size: 0.8rem; color: darkgray;">
          <a href="https://des.ncsa.illinois.edu/about" target="_blank" style="text-decoration: none; color: inherit;">
          DESDM Team</a>
          <br>
          <a href="https://des.ncsa.illinois.edu/terms" target="_blank" style="font-size: 0.7rem; text-decoration: none; font-weight: bold; color: darkgray;">
            Terms and Conditions
          </a>
        </p>
      </footer>

    `;
  }

  constructor() {
    super();
    this._session = false;
    store.dispatch(getProfile());
    setPassiveTouchGestures(true);
  }

  stateChanged(state) {
    this._session = state.app.session;
    this._page = state.app.page;
    this._drawerOpened = state.app.drawerOpened;
    this._drawerPersisted = state.app.drawerPersisted;
    this.username = state.app.username;
    this.email = state.app.email;
    this.name = state.app.name;
    this.roles = state.app.roles;
    this.accessPages = state.app.accessPages;
    this.database = state.app.db;
  }

  firstUpdated() {
    installMediaQueryWatcher(`(min-width: 1001px)`, (matches) => {
      matches ?  this._goWide() :  this._goNarrow()
    })
    // Attempt to refresh the auth token automatically before it expires
    let minutes = 60*1000;
    window.setInterval(() => {
      store.dispatch(getProfile());
    }, 5*minutes);
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
      });
    }
    if (changedProps.has('accessPages')) {
      installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname),this._drawerPersisted, this.accessPages, this._session)));
    }
  }

  _goWide(){
    store.dispatch(updateDrawerPersist(true));
    store.dispatch(updateDrawerState(true));
  }

  _goNarrow(){
    store.dispatch(updateDrawerPersist(false));
    store.dispatch(updateDrawerState(false));
  }

  _menuButtonClicked() {
    store.dispatch(updateDrawerState(!this._drawerOpened));
  }

  _drawerOpenedChanged(e) {
    store.dispatch(updateDrawerState(e.target.opened));
  }

}

window.customElements.define('des-main', DESMain);
