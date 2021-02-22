import {
  LitElement,
  html,
  css
} from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import {updateDrawerState} from '../actions/app.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

class DESSideBar extends connect(store)(LitElement) {
  static get properties() {
    return {
      username: {
        type: String
      },
      email: {
        type: String
      },
      name: {
        type: String
      },
      _drawerOpened: {
        type: Boolean
      }
    }
  }
  static get styles() {
    return [
      css `
        .info-container {
          position: relative;
          border: 2px solid #ccc;
          border-radius: 50%;
          height: 90px;
          padding: 2px;
          width: 90px;
          margin: 20px auto;
      }
      .info-container .image {
          background-image: url('images/user.png');
          background-size: contain;
          border-radius: 50%;
          height: 100%;
          width: 100%;
          background-repeat: no-repeat;
          background-position: center;
      }
      .self-info {
          margin: 0 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #CCC;
          text-align: center;
      }
      .self-info .name {
          font-weight: bold;
      }
      .self-info .email {
          color: #999;
      }
        `
    ];
  }

  stateChanged(state) {
    this._drawerOpened = state.app.drawerOpened;
  }

  _ClickHandler(e) {
    store.dispatch(updateDrawerState(window.innerWidth >= 1001 || !this._drawerOpened));
  }

  render() {
    return html `

      <app-toolbar style="background-color: black;">
        <iron-image
        style="width:224px; height:42px;"
        sizing="cover"
        src="images/des-logo-rev-lg.png" @click="${this._ClickHandler}"></iron-image>
      </app-toolbar>
      `;
  }

  constructor() {
    super();
    this._drawerOpened = false;
  }


}

window.customElements.define('des-sidebar', DESSideBar);
