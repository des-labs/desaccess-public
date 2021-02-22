import { html,css } from 'lit-element';
import { PageViewElement } from '../page-view-element.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';

class DESTicket extends PageViewElement {
  static get properties() {
    return {
      // This is the data from the store.
      _clicks: { type: Number },
      _value: { type: Number },
      resetChecked: { type: Boolean, attribute: true},
      unlockChecked: { type: Boolean, attribute: true},
      msg: {type: String},
      searchMessage: {type: String},
      existsMessage: {type: String},
      submitMessage: {type: String},
      ticketAuth: {type: String},
    };
  }

  static get styles() {
    return [
      SharedStyles,
    ];
  }


  constructor(){
    super();
    this.user = "None";
    this.email = "None";
    this.jiraTicket = "None";
    this.stop = 0;
    this.msg = "";
    this.resetChecked = false;
    this.unlockChecked = false;
    this.ticketAuth = 'Basic ' + config.ticketAuth
 }

updateResetChecked(e) {
  this.resetChecked = e.target.checked;
}
updateUnlockChecked(e) {
  this.unlockChecked = e.target.checked;
}

  render() {
    return html`

    <section>
      <h3>A DESDM database password and DESHELP JIRA ticket resolver</h3>
      <div>
        <p>Enter username, email, first or last name to check if user exists:</p>
        <table id="search-table" style="width:100%">
        <tr class="submit-tr">
        <td class="submit-td">
          Search:
        </td>
        <td class="submit-td">
        <input value="" @input="${e => this.searchString = e.target.value}">
        </td>
        </tr>
        <tr class="submit-tr">
        <td class="submit-td">
        </td>
        <td class="submit-td">
        <button @click="${this._search}">Search</button>
        </td>
        </tr>
        </table>
        <pre> ${this.searchMessage}</pre>
      </div>
      <div>
        <p> Enter username and email below to resolve db password request:</p>
        <table id="form-submission-table" style="width:100%">
          <tr class="submit-tr">
          <td class="submit-td">
            Username:
          </td>
          <td class="submit-td">
          <input value="" @input="${e => this.user = e.target.value}">
          </td>
          </tr>
          <tr class="submit-tr">
          <td class="submit-td">
            Email:
          </td>
          <td class="submit-td">
          <input value="" @input="${e => this.email = e.target.value}">
          </td>
          </tr>
          <tr class="submit-tr">
          <td class="submit-td">
            JIRA ticket:
          </td>
          <td class="submit-td">
          <input value="" @input="${e => this.jiraTicket = e.target.value}">
          </td>
          </tr>
          <tr class="submit-tr">
          <td class="submit-td">
            Resolution options:
          </td>
          <td class="submit-td">
          <input type="checkbox" id="reset" name="reset" ?checked="${this.resetChecked}"
              @change="${this.updateResetChecked}"/>
          <label for="reset">Reset/unlock</label>
          <input type="checkbox" id="unlock" name="unlock" ?checked="${this.unlockChecked}"
              @change="${this.updateUnlockChecked}"/>
          <label for="unlock">Unlock only</label>
          </td>
          </tr>
          <tr class="submit-tr">
          <td class="submit-td">
          </td>
          <td class="submit-td">
          <button @click="${this._submit}">Submit</button>
          </td>
          </tr>
        </table>
      </div>
      <p><font color="red">${this.msg}</font></p>
      <p><font color="red">${this.existsMessage}</font></p>
      <p>${this.submitMessage}</p>
    </section>
    `;
  }

  _search(){
    console.log("_search");
    const Url="https://deslabs.ncsa.illinois.edu/desticket/api/v1/search/";
    /*const Url="http://localhost:5000/api/v1/search/";*/
    const dataP={
      search_string: this.searchString,
    };
    const param = {
      headers: {'Content-Type': 'application/json',
        'Authorization': this.ticketAuth,},
      body: JSON.stringify(dataP),
      method: "POST"
    };
    console.log(this.searchString);
    fetch(Url, param)
    .then(response => {return response.json();})
    .then(data => {this.searchMessage = data.message;})
    .catch((error) => {console.log(error);});
  }

    _exists(){
      console.log("_exists");
      const Url="https://deslabs.ncsa.illinois.edu/desticket/api/v1/exists/";
      /*const Url="http://localhost:5000/api/v1/exists/";*/
      const dataP={
        user: this.user,
        email: this.email,
      };
      const param = {
        headers: {'Content-Type': 'application/json',
        'Authorization': this.ticketAuth,},
        body: JSON.stringify(dataP),
        method: "POST"
      };
      fetch(Url, param)
      .then(response => {return response.json();})
      .then(data => {this.existsUser = data.user;
                     this.existsEmail = data.email;
                     this.count = data.count;})
      .catch((error) => {console.log(error);});
    }

  _submit() {
    console.log("_submit");
    if (this.resetChecked == true){
      this.reset = "True";}
    else{
      this.reset = "False"
    }

    const Url="https://deslabs.ncsa.illinois.edu/desticket/api/v1/reset/";
    /*const Url="http://localhost:5000/api/v1/reset/";*/
    const dataP={
      user: this.user,
      email: this.email,
      jira_ticket: this.jiraTicket,
      reset: this.reset,
    };
    const param = {
      headers: {'Content-Type': 'application/json',
        'Authorization': this.ticketAuth,},
      body: JSON.stringify(dataP),
      method: "POST"
    };

    if (this.resetChecked == this.unlockChecked){
      this.msg = "Please select only one resolution option!";
      console.log(this.msg);
      this.stop = 1;
    }
    if (this.email == undefined | this.user == undefined){
      this.msg = "Please specify username AND email!";
      console.log(this.msg);
      this.stop = 1;
    }

    if (this.stop == 0) {
      this.msg = "";

      fetch(Url, param)
      .then(response => {return response.json();})
      .then(data => {this.submitMessage = data.message;
                     this.status = data.status;})
      .catch((error) => {console.log(error);});
    }
  }
}

window.customElements.define('des-ticket', DESTicket);
