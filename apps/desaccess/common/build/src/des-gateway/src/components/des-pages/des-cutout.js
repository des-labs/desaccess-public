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


class DESCutout extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
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
          .upload{
              position: absolute;
              opacity: 0;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
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

          .around-cell {
              @apply(--layout-horizontal);
              @apply(--layout-around-justified);
          }

          .around-cell2 {
              @apply(--layout-horizontal);
              @apply(--layout-center-justified);
          }

          #rgb_bands_selector: {
            display: none;
          }

          #fits_bands_selector: {
            display: none;
          }

          .toast-position {
              /* right: 50%; */
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
          #submit-button-cutout {
            background-color: var(--paper-indigo-500);
            color: white;
            width: 150px;
            text-transform: none;
            --paper-button-raised-keyboard-focus: {
            background-color: var(--paper-indigo-a250) !important;
            color: white !important;
            };
            box-shadow: 3px -3px 4px 3px rgba(63,81,181,0.7);
          }
          #submit-button-cutout[disabled] {
              background: #eaeaea;
              color: #a8a8a8;
              cursor: auto;
              pointer-events: none;
              box-shadow: 3px -3px 8px 8px rgba(184,184,184,0.7);
          }

          #submit-container {
            position: fixed;
            bottom: 0%;
            z-index: 1;
            left: 0px;
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
          .output-format-grid {
            display: grid;
            grid-gap: 1rem;
            grid-template-columns: 1fr;
          }

          @media (min-width: 1001px) {
            .output-format-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
        `,

    ];
  }

  static get properties() {
    return {
      _value: { type: Number },
      db: {type: String},
      msg: {type: String},
      tabIdx: { type: Number },
      xsize: { type: Number },
      ysize: { type: Number },
      csvFile: {type: String},
      positions: {type: String},
      release: {type: String},
      rgb_bands: {type: Object},
      fits_bands: {type: Object},
      rgb_types_stiff: {type: Boolean},
      rgb_types_lupton: {type: Boolean},
      fits_all_toggle: {type: Boolean},
      fits: {type: Boolean},
      submit_disabled: {type: Boolean},
      username: {type: String},
      validEmail: {type: Boolean},
      email: {type: String},
      customJobName: {type: String}
    };
  }

  constructor(){
    super();
    this.username = '';
    this.email = '';
    this.validEmail = false;
    this.customJobName = '';
    this.db = '';
    this.msg = "";
    this.positions = "";
    this.tabIdx = 0;
    this.csvFile = '';
    this.fits = false;
    this.rgb_types_stiff = false;
    this.rgb_types_lupton = false;
    this.fits_all_toggle = false;
    this.submit_disabled = true;
    this.xsize = 1.0;
    this.ysize = 1.0;
    if (config.desaccessInterface == 'public'){
      this.release = "DR2";
    }
    else{
      this.release = "Y6A2";
    }
    this.rgb_bands = {
      "checked": {
        "g": true,
        "r": true,
        "i": true,
        "z": false,
        "y": false
      },
      "disabled": {
        "g": true,
        "r": true,
        "i": true,
        "z": true,
        "y": true
      }
    };
    this.fits_bands = {
      "checked": {
        "g": true,
        "r": true,
        "i": true,
        "z": false,
        "y": false
      }
    };
  }
 
  render() {
    return html`
    <div>
    <div id="submit-container">
      <paper-button raised  class="indigo"  id="submit-button-cutout" ?disabled="${this.submit_disabled}" @click="${e => this._submit(e)}">
        Submit Job
      </paper-button>
      <paper-spinner id="submit-spinner" class="big"></paper-spinner>
    </div>
    <section>
        <h2>Positions and data set</h2>
        <div style="display: grid; grid-gap: 1rem; grid-template-columns: 20% 80%;">

          <div>
            <label id="data-release-tag" style="font-weight: bold;">Data release tag:</label>
            <div>
              <paper-radio-group selected="${this.release}" aria-labelledby="data-release-tag">
              ${config.desaccessInterface == 'public' ? html`
                  <paper-radio-button class="release-button" @change="${e => this.release = e.target.name}" name="DR1">DR1</paper-radio-button><br>
                  <paper-radio-button class="release-button" @change="${e => this.release = e.target.name}" name="DR2">DR2</paper-radio-button><br>
                ` : html`
                  <paper-radio-button class="release-button" @change="${e => this.release = e.target.name}" name="Y6A2">Y6A2</paper-radio-button><br>
                  <paper-radio-button class="release-button" @change="${e => this.release = e.target.name}" name="Y3A2">Y3A2</paper-radio-button><br>
                  <paper-radio-button class="release-button" @change="${e => this.release = e.target.name}" name="Y1A1">Y1A1</paper-radio-button><br>
                  <paper-radio-button class="release-button" @change="${e => this.release = e.target.name}" name="SVA1">SVA1</paper-radio-button><br>
                `
              }
              </paper-radio-group>
            </div>
          </div>

          <div>
          <p style="margin-top: 0;">Enter cutout positions as a CSV-formatted table, specifying positions using RA/DEC coordinates or coadd object ID numbers. Values can be entered manually or by uploading a CSV-formatted text file. See the help system for more details.</p><p style="color:inherit;">Limit 10 concurrent jobs per user, ${config.maxCutoutsPerJob} positions per job. Max cutout width/height is 12 arcmin.</p>
            <iron-autogrow-textarea style="font-family: monospace; width: 90%; margin-left: 0; margin-right: 2rem;" id="position-textarea" max-rows="10" rows=7 placeholder="RA,DEC,COADD_OBJECT_ID,XSIZE,YSIZE\n21.5,3.48,,2.00,1.00\n,,61407409,,\n36.6,-15.68,,1.00,2.00\n(See Help for more examples)" value=""></iron-autogrow-textarea>
            <paper-button raised class="indigo" id="bc_uploadFile">
              <span style="overflow-x: auto; overflow-wrap: break-word;">Upload CSV file</span>
              <input type="file" id="csv-upload" class="upload" @change="${e => this._fileChange(e)}" accept=".csv, .CSV" />
            </paper-button>
            <span id="csv-file-msg" style="margin-left: 2rem;"></span>
          </div>

        </div>
    </section>

    <section>
        <h2>Output format and size</h2>
        <p>Check all desired output files. FITS format requires selection of one or more bands. RGB color images require selection of exactly three bands.</p>
        <div class="output-format-grid">
          <div>
            <h3>FITS format</h3>
            <p>FITS format requires selection of <span id="criterion-fits-band-selected">one or more bands</span>.</p>
            <div>
            <paper-checkbox @change="${e => this._updateFitsBands(e)}" ?checked="${this.fits}">FITS (FITS format)</paper-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div id="fits_bands_selector" style="display: none;">
              Bands: &nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'g')}" ?checked="${this.fits_bands.checked.g}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_gband">g</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'r')}" ?checked="${this.fits_bands.checked.r}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_rband">r</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'i')}" ?checked="${this.fits_bands.checked.i}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_iband">i</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'z')}" ?checked="${this.fits_bands.checked.z}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_zband">z</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'y')}" ?checked="${this.fits_bands.checked.y}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_Yband">Y</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox id="select-all-bands-toggle" @change="${e => this._selectAllFitsBands(e)}" ?checked="${this.fits_all_toggle}" ?disabled="${!this.fits}" style="font-weight: bold; padding-left: 2rem;" id="bc_all_toggle">Select All/None</paper-checkbox>&nbsp;
            </div>
            <h3>Color image format</h3>
            <p>RGB color images require selection of <span id="criterion-three-bands">exactly three bands</span>.</p>
            <div>
              <paper-checkbox @change="${e => this._updateRgbTypes(e, 'stiff')}" ?checked="${this.rgb_types_stiff}">Color image (RGB: STIFF format)</paper-checkbox>
            </div>
            <div>
              <paper-checkbox @change="${e => this._updateRgbTypes(e, 'lupton')}" ?checked="${this.rgb_types_lupton}">Color image (RGB: Lupton method)</paper-checkbox>
            </div>

            <div id="rgb_bands_selector" style="display: none;">
              Bands: &nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateRgbSelection(e, 'g')}" ?checked="${this.rgb_bands.checked.g}" ?disabled="${this.rgb_bands.disabled.g}" style="font-size:16px; padding-top:15px;" id="bc_gband">g</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateRgbSelection(e, 'r')}" ?checked="${this.rgb_bands.checked.r}" ?disabled="${this.rgb_bands.disabled.r}" style="font-size:16px; padding-top:15px;" id="bc_rband">r</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateRgbSelection(e, 'i')}" ?checked="${this.rgb_bands.checked.i}" ?disabled="${this.rgb_bands.disabled.i}" style="font-size:16px; padding-top:15px;" id="bc_iband">i</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateRgbSelection(e, 'z')}" ?checked="${this.rgb_bands.checked.z}" ?disabled="${this.rgb_bands.disabled.z}" style="font-size:16px; padding-top:15px;" id="bc_zband">z</paper-checkbox>&nbsp;&nbsp;
              <paper-checkbox @change="${e => this._updateRgbSelection(e, 'y')}" ?checked="${this.rgb_bands.checked.y}" ?disabled="${this.rgb_bands.disabled.y}" style="font-size:16px; padding-top:15px;" id="bc_Yband">Y</paper-checkbox>&nbsp;&nbsp;
            </div>
          </div>
          <div>
            <h3>Default cutout size (arcminutes)</h3>
            <div style="display: grid; grid-gap: 1rem; grid-template-columns: 5% 95%; align-items: center;">
              <div>
                <label id="bc_xsizeSlider" style="font-weight: bold;">X</label>
              </div>
              <div>
                <paper-slider @change="${e => this.xsize = e.target.value}" id="bc_xsizeSlider" pin min="0.1" max="12" max-markers="10" step="0.1" value="${this.xsize}" expand editable></paper-slider>
              </div>
            </div>
            <div style="display: grid; grid-gap: 1rem; grid-template-columns: 5% 95%; align-items: center;">
              <div>
                <label id="bc_ysizeSlider" style="font-weight: bold;">Y</label>
              </div>
              <div>
                <paper-slider @change="${e => this.ysize = e.target.value}" id="bc_ysizeSlider" pin min="0.1" max="12" max-markers="10" step="0.1" value="${this.ysize}" expand editable></paper-slider>
              </div>
            </div>
          </div>
        </div>
    </section>
    <section>
        <h2>Options</h2>
        <div>
          <!-- <label id="custom-job-option" style="font-weight: bold;">Provide a custom job name:</label> -->
          <!-- aria-labelledby="custom-job-option" -->
          <paper-input
            style="max-width: 500px; padding-left:2rem;"
            placeholder="" value="${this.customJobName}"
            label="Custom job name (example: my-custom-job.12)"
            @change="${(e) => {this.customJobName = e.target.value}}"
            id="custom-job-name" name="custom-job-name"></paper-input>
          <!-- <paper-input @change="${(e) => {this.customJobName = e.target.value; console.log(e.target.value);}}" always-float-label id="bc_validname" name="name" label="Job Name" placeholder="my-custom-job.12" value="${this.customJobName}" style="max-width: 500px; padding-left:2rem;"></paper-input> -->

          <p id="custom-job-invalid" class="valid-form-element">
            Custom job name must consist of lower case alphanumeric characters,
            '-' or '.', and must start and end with an alphanumeric character.
            Maximum length is 128 characters.
          </p>
          <p>Receive an email when the files are ready for download:</p>
          <div id="email-options">
            <!-- <p id="email-options-invalid" style="display: none; color: red;">Please enter a valid email address.</p> -->
            <paper-checkbox
              @change="${(e) => {this._updateEmailOption(e)}}"
              style="font-size:16px; padding-left:2rem; padding-top:15px;"
              id="send-email">Email when complete</paper-checkbox>
            <paper-input
              @change="${(e) => {this.email = e.target.value;}}"
              always-float-label
              disabled
              id="custom-email"
              name="custom-email"
              label="Email Address"
              style="max-width: 500px; padding-left:2rem;"
              placeholder="${this.email}"
              value="${this.email}"></paper-input>
              <p id="custom-email-invalid" class="valid-form-element">
                Enter a valid email address.
              </p>
          </div>
        </div>
    </section>
    <div>
      <paper-toast class="toast-position toast-success" id="toast-job-success" text="Job has been submitted!" duration="7000"> </paper-toast>
      <paper-toast class="toast-position toast-error" id="toast-job-failure" text="ERROR! There was an error. Please try again" duration="7000"> </paper-toast>
    </div>

  </div>
  `;
}


  _updateEmailOption(event) {
    this.shadowRoot.getElementById('custom-email').disabled = !event.target.checked;
    this.shadowRoot.getElementById('custom-email').invalid = this.shadowRoot.getElementById('custom-email').invalid && !this.shadowRoot.getElementById('custom-email').disabled;
    this.validEmail = this.validateEmailAddress(this.email);
    this._validateForm();
  }

  _toggleSpinner(active, callback) {

    this.submit_disabled = active;
    this.shadowRoot.getElementById('submit-spinner').active = active;
    callback();
  }

  _submit(event) {
    if (!this.submit_disabled) {
      // var that = this;
      this._toggleSpinner(true, () => {
        this._submitJob(() => {
          this._toggleSpinner(false, () => {});
        });
      });
    }
  }

  _submitJob(callback) {
    const Url=config.backEndUrl + "job/cutout"
    var body = {
      username: this.username,
      release: this.release,
      db: this.db,
      positions: this.positions,
      xsize: this.xsize,
      ysize: this.ysize,
      make_fits: this.fits,
      make_rgb_stiff: this.rgb_types_stiff,
      make_rgb_lupton: this.rgb_types_lupton
      // TODO: Implement Lupton RGB format options
      // rgb_minimum: null,
      // rgb_stretch: null,
      // rgb_asinh: null,
    };
    if (this.shadowRoot.getElementById('send-email').checked) {
      body.email = this.email;
    }
    if (this.customJobName !== '') {
      body.job_name = this.customJobName;
    }
    if (this.rgb_types_stiff || this.rgb_types_lupton) {
      // body.colors_rgb = this._getSelectedBands(this.rgb_bands).join('');
      // For simplicity of the interface, apply the same color set to both RGB types
      body.rgb_stiff_colors = this._getSelectedBands(this.rgb_bands).join('');
      body.rgb_lupton_colors = this._getSelectedBands(this.rgb_bands).join('');
    }
    if (body.make_fits) {
      body.colors_fits = this._getSelectedBands(this.fits_bands).join('');
    }
    const param = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(body)
    };
    var that = this;
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        that.shadowRoot.getElementById('toast-job-success').text = 'Job submitted';
        that.shadowRoot.getElementById('toast-job-success').show();
      } else {
        that.shadowRoot.getElementById('toast-job-failure').text = 'Error submitting job: ' + data.message;
        that.shadowRoot.getElementById('toast-job-failure').show();
        console.log(JSON.stringify(data));
      }
      callback();
    });
  }

  _getSelectedBands(bandObj) {
    var bands = [];
    for (var b in bandObj.checked) {
      if (bandObj.checked[b]) {
        bands.push(b);
      }
    }
    return bands;
  }

  _toggleValidWarning(elementId, valid) {
    if (valid) {
      this.shadowRoot.getElementById(elementId).style['font-weight'] = 'normal';
      this.shadowRoot.getElementById(elementId).style.color = 'black';
    } else {
      this.shadowRoot.getElementById(elementId).style['font-weight'] = 'bold';
      this.shadowRoot.getElementById(elementId).style.color = 'red';
    }

  }
  _validateForm() {
    var validForm = true;
    validForm = this.positions !== "" && validForm;
    validForm = (this.fits || this.rgb_types_stiff || this.rgb_types_lupton) && validForm;
    if (this.fits) {
      var criterion = this._bandsSelected(this.fits_bands) > 0
      validForm = criterion && validForm;
      this._toggleValidWarning('criterion-fits-band-selected', criterion);
    } else {
      this._toggleValidWarning('criterion-fits-band-selected', true);
    }
    if (this.rgb_types_stiff || this.rgb_types_lupton) {
      var criterion = this._bandsSelected(this.rgb_bands) === 3
      validForm = criterion && validForm;
      this._toggleValidWarning('criterion-three-bands', criterion);
    } else {
      this._toggleValidWarning('criterion-three-bands', true);
    }
    // if (this.tabIdx === 0) {
    //   var textareaID = 'coadd-id-textarea';
    // } else {
    //   var textareaID = 'coords-textarea';
    // }
    var textareaID = 'position-textarea';
    var currentText = this.shadowRoot.getElementById(textareaID).value;
    if (this.positions !== currentText) {
      this._validateCsvFile(currentText);
    }
    var criterion = this.positions === currentText
    validForm = criterion && validForm;

    this.validEmail = this.validateEmailAddress(this.email);
    var criterion = this.validEmail || !this.shadowRoot.getElementById('send-email').checked;
    validForm = criterion && validForm;
    this.shadowRoot.getElementById('custom-email').invalid = !criterion;
    if (criterion) {
      this.shadowRoot.getElementById('custom-email-invalid').classList.remove('invalid-form-element');
      this.shadowRoot.getElementById('custom-email-invalid').classList.add('valid-form-element');
    } else {
      this.shadowRoot.getElementById('custom-email-invalid').classList.remove('valid-form-element');
      this.shadowRoot.getElementById('custom-email-invalid').classList.add('invalid-form-element');
      // var that = this;
      // this._toast(false, 'Please enter a valid email address.', () => {
      //   that.shadowRoot.getElementById('email-options').classList.add('invalid-form-element');
      // });
    }

    // Enable/disable submit button
    this.submit_disabled = !validForm;
  }
  _bandsSelected(obj) {
    var bandsSelected = 0;
    for (var b in obj.checked) {
      if (obj.checked[b]) {
        bandsSelected += 1;
      }
    }
    return bandsSelected
  }
  _updateRgbTypes(event, type) {
    if (type === 'stiff') {
      this.rgb_types_stiff = event.target.checked;
    } else {
      this.rgb_types_lupton = event.target.checked;
    }
    if (this.rgb_types_lupton === false && this.rgb_types_stiff === false) {
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = true;
      }
      this.shadowRoot.getElementById('rgb_bands_selector').style.display = 'none';
    } else {
      this.shadowRoot.getElementById('rgb_bands_selector').style.display = 'block';
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = false;
      }
      this._ensureThreeRgbBands();
    }
  }

  _selectAllFitsBands(event) {
    for (var b in this.fits_bands.checked) {
      this.fits_bands.checked[b] = event.target.checked;
    }
    this.fits_all_toggle = event.target.checked;
    // This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.fits_bands;
    this.fits_bands =  {};
    this.fits_bands =  temp;
  }

  _updateFitsBands(event) {
    this.fits = event.target.checked;
    for (var b in this.fits_bands.disabled) {
      this.fits_bands.disabled[b] = !this.fits;
    }
    // This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.fits_bands;
    this.fits_bands =  {};
    this.fits_bands =  temp;

  }

  _updateFitsBandsSelection(event, band) {
    this.fits_bands.checked[band] = event.target.checked;
    if (this.fits_bands.checked[band] === false) {
      this.fits_all_toggle = false;
    } else {
      var allChecked = true;
      for (var b in this.fits_bands.checked) {
        allChecked = allChecked && this.fits_bands.checked[b];
      }
      this.fits_all_toggle = allChecked;
    }
    //This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.fits_bands;
    this.fits_bands =  {};
    this.fits_bands =  temp;

  }

  _ensureThreeRgbBands() {
    var numChecked = 0;
    for (var b in this.rgb_bands.checked) {
      if (this.rgb_bands.checked[b]) {
        numChecked += 1;
      }
    }
    if (numChecked > 2) {
      for (var b in this.rgb_bands.disabled) {
        if (!this.rgb_bands.checked[b]) {
          this.rgb_bands.disabled[b] = true;
        }
      }
    } else {
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = false;
      }
    }
  }
  _updateRgbSelection(event, band) {
    this.rgb_bands.checked[band] = event.target.checked;
    this._ensureThreeRgbBands();
    // This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.rgb_bands;
    this.rgb_bands =  {};
    this.rgb_bands =  temp;
  }

  _fileChange(event) {
    this.csvFile = this.shadowRoot.getElementById('csv-upload').files[0];
    var reader = new FileReader();
    reader.onload = (e) => {
      var text = reader.result;
      // Count lines in the file, ignoring blank lines
      var textLength = 0; //text.split("\n").length;
      var lines = text.split("\n");
      for (let line in lines) {
        if (lines[line].trim() !== '') {
          textLength++;
        }
      }
      if (textLength <= config.maxCutoutsPerJob + 1){
        this._validateCsvFile(text);
      }
      else{
        this.shadowRoot.getElementById('toast-job-failure').text = `CSV file is too large! Please limit file to ${config.maxCutoutsPerJob} lines.`;
        this.shadowRoot.getElementById('toast-job-failure').show();
      }
    }
    reader.readAsText(this.csvFile);
  }

  _validateCsvFile(csvText) {
    const Url=config.backEndUrl + "page/cutout/csv/validate"
    const param = {
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        csvText: csvText,
      }),
      method: "POST"
    };
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        if (data.valid) {
          var textareaID = 'position-textarea'
          this.positions = data.csv;
          this.shadowRoot.getElementById(textareaID).value = data.csv;
          this.shadowRoot.getElementById('csv-file-msg').innerHTML = 'Positions validated.';
          this.shadowRoot.getElementById('csv-file-msg').style.color = 'green';
          this.shadowRoot.getElementById(textareaID).style['border-color'] = 'green';
        } else {
          var textareaID = 'position-textarea'
          // this.positions = 'INVALID';
          this.shadowRoot.getElementById('csv-file-msg').innerHTML = `Invalid: ${data.msg}`;
          this.shadowRoot.getElementById('csv-file-msg').style.color = 'red';
          this.shadowRoot.getElementById(textareaID).style['border-color'] = 'red';
          this.shadowRoot.getElementById(textareaID).style['border-color'] = 'red';
        }
      } else {
        var textareaID = 'position-textarea'
        // this.positions = 'ERROR VALIDATNG ';
        this.shadowRoot.getElementById('csv-file-msg').innerHTML = `Error validating input: ${data.msg}`;
        this.shadowRoot.getElementById('csv-file-msg').style.color = 'red';
        this.shadowRoot.getElementById(textareaID).style['border-color'] = 'red';
        this.shadowRoot.getElementById(textareaID).style['border-color'] = 'red';
        console.log(JSON.stringify(data));
      }
    })
  }

  _updateTabbedContent(event) {
    this.tabIdx = this.shadowRoot.getElementById('tab-selector').selected;
  }

  _toast(status, msg, callback) {
    if (status) {
      var elId = 'toast-job-success';
    } else {
      var elId = 'toast-job-failure';
    }
    this.shadowRoot.getElementById(elId).text = msg;
    this.shadowRoot.getElementById(elId).show();
    callback();
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.db = state.app.db;
    this.email = this.email === '' ? state.app.email : this.email;
  }

  firstUpdated() {
    var that = this;
    this.shadowRoot.getElementById('position-textarea').addEventListener('blur', function (event) {
      that._validateForm();
    });
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'submit_disabled':
          this.shadowRoot.getElementById('submit-button-cutout').disabled = this.submit_disabled;
          break;
        case 'fits':
          if (this.fits) {
            this.shadowRoot.getElementById('fits_bands_selector').style.display = 'block';
          } else {
            this.shadowRoot.getElementById('fits_bands_selector').style.display = 'none';
          }
        case 'customJobName':
          var originalName = this.customJobName;
          var isValidJobName = this.customJobName === '' || (this.customJobName.match(/^[a-z0-9]([-a-z0-9]*[a-z0-9])*(\.[a-z0-9]([-a-z0-9]*[a-z0-9])*)*$/g) && this.customJobName.length < 129);
          this.shadowRoot.getElementById('custom-job-name').invalid = !isValidJobName;
          if (isValidJobName) {
            this.shadowRoot.getElementById('custom-job-invalid').classList.remove('invalid-form-element');
            this.shadowRoot.getElementById('custom-job-invalid').classList.add('valid-form-element');
          } else {
            this.shadowRoot.getElementById('custom-job-invalid').classList.remove('valid-form-element');
            this.shadowRoot.getElementById('custom-job-invalid').classList.add('invalid-form-element');
          }
        case 'email':
          this.validEmail = this.validateEmailAddress(this.email);
        default:
          // Assume that we want to revalidate the form when a property changes
          this._validateForm();
      }
    });
  }
}

window.customElements.define('des-cutout', DESCutout);
