import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';
import { scrollToTop } from './utils.js';

class DESHelpJupyter extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <a href="#" onclick="return false;" title="Back to top" style="text-decoration: none; color: inherit;">
      <h3 @click="${scrollToTop}">
        JupyterLab Help
        <iron-icon icon="vaadin:angle-double-up"></iron-icon>
      </h3></a>
      <p>JupyterLab provides a dedicated personal JupyterLab server for you to use. You can run Jupyter notebooks and take advantage of the processing power of our cluster nodes as well as the proximity to the DES database and integration with the output of your query and cutout jobs.</p>
      <p>
        If available to your account, you may check the GPU checkbox to deploy your JupyterLab server on a cluster node that makes GPUs available to your code.
      </p>
    `;
  }
}

window.customElements.define('des-help-jupyter', DESHelpJupyter);
