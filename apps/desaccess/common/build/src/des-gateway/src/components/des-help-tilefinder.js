import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';
import { scrollToTop } from './utils.js';

class DESHelpTileFinder extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <a href="#" onclick="return false;" title="Back to top" style="text-decoration: none; color: inherit;">
      <h3 @click="${scrollToTop}">
        TileFinder Help
        <iron-icon icon="vaadin:angle-double-up"></iron-icon>
      </h3></a>
      <p>TileFinder allows you to search for DES data tiles based on sky coordinates or the name of the tile containing the data. Download links are generated for all available tile data across all relevant data releases.</p>
    `;
  }
}

window.customElements.define('des-help-tilefinder', DESHelpTileFinder);
