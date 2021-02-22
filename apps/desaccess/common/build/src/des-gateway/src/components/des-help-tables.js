import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';
import { scrollToTop } from './utils.js';
import { config } from './des-config.js';

class DESHelpTables extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <a href="#" onclick="return false;" title="Back to top" style="text-decoration: none; color: inherit;">
      <h3 @click="${scrollToTop}">
        DB Tables Help
        <iron-icon icon="vaadin:angle-double-up"></iron-icon>
      </h3></a>
      <p>The DES Tables browser shows you all the DES database tables you have permission to view. For each table in the list, you can view a description of the table's schema by toggling the checkbox on that table's row.</p>
      ${config.desaccessInterface === 'public' ? html`` : html`
        <p>
          All of your personal tables are displayed in the My Tables viewer.
        </p>
      `}
    `;
  }
}

window.customElements.define('des-help-tables', DESHelpTables);
