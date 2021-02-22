import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-checkbox/vaadin-checkbox.js';

class DESTables extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
        .schema-header-row {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .schema-field-row {
          font-family: monospace;
        }
        vaadin-grid {
          height: 80vh; 
          max-width: 85vw;
        }
        ul {
          list-style-type: none; 
          margin: 0; 
          padding: 1rem; 
          line-height: 2rem;
        }
        a {
          font-weight: bold; 
          text-decoration: none; 
          color: inherit;
        }
        .table-heading {
          font-size: 1.5rem; 
          font-weight: bold; 
          margin-top: 2rem; 
          margin-bottom: 1rem;
        }
        iron-icon {
          color: darkgray;
          --iron-icon-width:  18px;
          --iron-icon-height: 18px;
        }
      `
    ];
  }

  static get properties() {
    return {
      description: {type: Object}
    };
  }

  constructor(){
    super();
    this.description = {};
    this.detailRenderIntervalId = {};
    this.schema = null;
    this.rendererTableDescriptionAll = this.rendererTableDescriptionAll.bind(this); // need this to invoke class methods in renderers
    this.rendererTableDescriptionMy = this.rendererTableDescriptionMy.bind(this); // need this to invoke class methods in renderers
    this.rendererTableNameAll = this.rendererTableNameAll.bind(this); // need this to invoke class methods in renderers
    this.rendererTableNameMy = this.rendererTableNameMy.bind(this); // need this to invoke class methods in renderers
  }

  render() {
    return html`
    <style>
      .public-hide {
        ${ config.desaccessInterface === 'public' ? html`
          display: none;
          ` : html``
        }
      }
    </style>
    <section>
      <div style="font-size: 2rem; font-weight: bold;">
        DES Database Tables
        <paper-spinner class="big"></paper-spinner>
      </div>
      <div>
        <p>Explore the tables available in the DES database.</p>
        <ul>
          <li><a title="Scroll to table" href="#" onclick="return false;" @click="${(e) => {this._scrollToTable('all-tables')}}">
          <iron-icon icon="vaadin:angle-double-down"></iron-icon>&nbsp;&nbsp;
            All Tables
          </a></li>
          <li class="public-hide"><a title="Scroll to table" href="#" onclick="return false;" @click="${(e) => {this._scrollToTable('my-tables')}}">
          <iron-icon icon="vaadin:angle-double-down"></iron-icon>&nbsp;&nbsp;
            My Tables
          </a></li>
        </ul>
      </div>
      <div>
        <a href="#" onclick="return false;" title="Back to top">
          <div class="table-heading"
            @click="${(e) => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });}}">
            All Tables
            <iron-icon icon="vaadin:angle-double-up"></iron-icon>
          </div>
        </a>
        <vaadin-grid id="all-tables" .multiSort="${true}">
          <vaadin-grid-filter-column path="table.name" header="Table Name"></vaadin-grid-filter-column>
          <vaadin-grid-sort-column   path="table.rows" header="Number of Rows"></vaadin-grid-sort-column>
          <vaadin-grid-column .renderer="${this.rendererTableNameAll}" header="Description"></vaadin-grid-column>
        </vaadin-grid>
      </div>
      <div class="public-hide">
        <a href="#" onclick="return false;" title="Back to top">
          <div class="table-heading"
            @click="${(e) => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });}}">
            My Tables
            <iron-icon icon="vaadin:angle-double-up"></iron-icon>
          </div>
        </a>
        <vaadin-grid id="my-tables" .multiSort="${true}">
          <vaadin-grid-filter-column path="table.name" header="Table Name"></vaadin-grid-filter-column>
          <vaadin-grid-sort-column   path="table.rows" header="Number of Rows"></vaadin-grid-sort-column>
          <vaadin-grid-column .renderer="${this.rendererTableNameMy}" header="Description"></vaadin-grid-column>
        </vaadin-grid>
      </div>
    </section>
    <vaadin-dialog id="table-description-dialog"></vaadin-dialog>
    <dom-module id="my-grid-styles" theme-for="vaadin-grid">
      <template>
        <style>
          .monospace-column {
            font-family: monospace;
            font-size: 0.8rem;
          }
        </style>
      </template>
    </dom-module>
    `;
  }

  rendererTableDescriptionAll(root, column, rowData) {
    this.rendererTableDescription(root, column, rowData, 'all');
  }

  rendererTableDescriptionMy(root, column, rowData) {
    this.rendererTableDescription(root, column, rowData, 'my');
  }

  rendererTableNameAll(root, column, rowData) {
    this.rendererTableName(root, column, rowData, 'all');
  }

  rendererTableNameMy(root, column, rowData) {
    this.rendererTableName(root, column, rowData, 'my');
  }

  rendererTableDescription(root, column, rowData, whichGrid) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    render(
      html`
        <a href="#" onclick="return false;" @click="${(e) => {this._fetchTableDescription(whichGrid, rowData.item.table.name);}}">Show schema...</a>
      `,
      container
    );

  }

  rendererTableName(root, column, rowData, whichGrid) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    render(
      html`
        <a style="font-family: monospace;"
          title="Display description of ${rowData.item.table.name}"
          href="#" onclick="return false;" 
          @click="${(e) => {this._fetchTableDescription(whichGrid, rowData.item.table.name);}}">
          View description
        </a>
      `,
      container
    );

  }


  _scrollToTable(tableId) {
    let el = this.shadowRoot.getElementById(tableId);
    window.scrollTo({
      top: el.getBoundingClientRect().top - 130,
      behavior: 'smooth'
    })
  }

  firstUpdated() {
    this.grids = {
      'all': {
        'gridElement': this.shadowRoot.querySelector('#all-tables'),
        'detailsElement': this.shadowRoot.querySelector('#all-tables .details'),
        'apiEndpoint': 'tables/list/all'
      },
      'my': {
        'gridElement': this.shadowRoot.querySelector('#my-tables'),
        'detailsElement': this.shadowRoot.querySelector('#my-tables .details'),
        'apiEndpoint': 'tables/list/mine'
      }
    };
    
    // Apply class names for styling
    for (let grid in this.grids) {
      this.grids[grid].gridElement.cellClassNameGenerator = function(column, rowData) {
        let classes = '';
        classes += ' monospace-column';
        return classes;
      };
    }

    //
    // TODO: The details renderer gets confused about which table is on which row. Not sure how to debug.
    //
    // for (let grid in this.grids) {
    //   this.grids[grid].gridElement.rowDetailsRenderer = (root, grid, rowData) => {
    //     if (!root.firstElementChild) {
    //       if (this.schema !== null) {
    //         console.log(`this.schema: ${JSON.stringify(this.schema)}`);
    //         render(
    //           html`
    //             <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; border-top: darkgray solid thin; margin: 1rem;">
    //             <div class="schema-header-row">Column Name</div>
    //             <div class="schema-header-row">Data Type</div>
    //             <div class="schema-header-row">Data Format</div>
    //             <div class="schema-header-row">Comments</div>
    //             ${this.schema.map(field => html`
    //               <div class="schema-field-row">${field['COLUMN_NAME']}</div>
    //               <div class="schema-field-row">${field['DATA_TYPE']}</div>
    //               <div class="schema-field-row">${field['DATA_FORMAT']}</div>
    //               <div class="schema-field-row">${field['COMMENTS']}</div>
    //             `)}
    //             </div>
    //           `, root);
    //           // Clear the schema value
    //           this.schema = null;
    //       }
    //     }
    //   };
    //   // this.grids[grid].gridElement.rowDetailsRenderer = this.grids[grid].gridElement.rowDetailsRenderer.bind(this);
    // }
    // for (let grid in this.grids) {
    //   this.grids[grid].detailsElement.renderer = (root, column, rowData) => {
    //     if (!root.firstElementChild) {
    //       root.innerHTML = `<vaadin-checkbox name="${rowData.item.table.name}">Show schema...</vaadin-checkbox>`;
    //       root.firstElementChild.addEventListener('checked-changed', (e) => {
    //         console.log(`rowData: ${JSON.stringify(rowData)}`);
    //         console.log(`details for table: ${rowData.item.table.name}`);
    //         console.log(`target name attr: ${e.target.getAttribute("name")}`);
    //         if (e.detail.value) {
    //           this._fetchTableDescription(grid, rowData.item.table.name, root.item);
    //         } else {
    //           this.grids[grid].gridElement.closeItemDetails(root.item);
    //         }
    //       });
    //     }
    //     root.item = rowData.item;
    //     root.firstElementChild.checked = this.grids[grid].gridElement.detailsOpenedItems.indexOf(root.item) > -1;
    //   };
    //   this.grids[grid].detailsElement.renderer = this.grids[grid].detailsElement.renderer.bind(this);
    // }

    for (let grid in this.grids) {
      this._fetchAllTables(grid);
    }
  }

  _showTableDescription(tableName, schema) {
    const tableDescriptionDialog = this.shadowRoot.getElementById('table-description-dialog');
    
    tableDescriptionDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      let description = html`
        <style>
          .schema-header-row {
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          .schema-field-row {
            font-family: monospace;
            border-top: lightgray solid thin;
          }
        </style>
        <div class="schema-header-row">Column Name</div>
        <div class="schema-header-row">Data Type</div>
        <div class="schema-header-row">Data Format</div>
        <div class="schema-header-row">Comments</div>
        ${schema.map(field => html`
          <div class="schema-field-row">${field['COLUMN_NAME']}</div>
          <div class="schema-field-row">${field['DATA_TYPE']}</div>
          <div class="schema-field-row">${field['DATA_FORMAT']}</div>
          <div class="schema-field-row">${field['COMMENTS']}</div>
        `)}
      `;
      render(
        html`
          <h3>Table:&nbsp;&nbsp;<span style="font-family: monospace;">${tableName}</span></h3>
          <div style="overflow: auto; width: 85vw; max-width: 1000px; height: 85vh;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; margin: 1rem;">
              ${description}
            </div>
          </div>
        `,
        container
      );
    }
    tableDescriptionDialog.opened = true;
  }

  _fetchTableDescription(whichGrid, tableName) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "tables/describe"
    let body = {
      'table': tableName,
      'owner': whichGrid === 'all' ? 'nobody' : ''
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
        this.schema = data.schema;
        this._showTableDescription(tableName, this.schema);
      } else {
        console.log(JSON.stringify(data, null, 2));
        // Clear the schema value
        this.schema = null;
      }
    });
  }

  _fetchAllTables(grid) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url = config.backEndUrl + this.grids[grid].apiEndpoint ;
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
        this.tables = data.tables;
        this._updateTableList(grid, this.tables)
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }
  _updateTableList(whichGrid) {
    let grid = this.grids[whichGrid].gridElement;
    let gridItems = [];
    // Allow an empty table
    if (this.tables.length === 0) {
      grid.items = gridItems;
      return;
    }
    let ctr = 0;
    this.tables.forEach((item, index, array) => {
      let table = {};
      table.name = item['TABLE_NAME'];
      table.rows = item['NROWS'];
      gridItems.push({table: table});
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
    })
  }

}

window.customElements.define('des-tables', DESTables);
