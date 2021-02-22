import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';
import { scrollToTop } from './utils.js';

class DESHelpDbAccess extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <a href="#" onclick="return false;" title="Back to top" style="text-decoration: none; color: inherit;">
      <h3 @click="${scrollToTop}">
        DB Access Help
        <iron-icon icon="vaadin:angle-double-up"></iron-icon>
      </h3></a>
      <p>The database access page allows you to submit your own OracleDB queries directly to the database.</p>
      <div class="help-content-grid">
        <div>
          Use the query editor to compose your database query.
          The <b>See examples</b> button provides some example queries to explore and
          copy into the editor. Before submitting a job, you may use the <b>Check syntax</b>
          to validate your query syntax to avoid failed jobs due to typos.
          </div>
        <div class="image-container">
          <img src="images/help/db-access-query-editor.png">
        </div>
        <div>
          <p>
            To see results as quickly as possible, you can select <b>Quick query</b>.
            Query results are truncated at 1000 rows, and the processing time is limited
            to 30 seconds. Results are displayed at the bottom of the page.
          </p>
          <p>
            For larger queries, you must specify an output file name, indicating
            the desired file format. Options include <b>CSV</b>, <b>H5</b>, and
            <b>FITS</b>. You may optionally choose to compress the <b>CSV</b> and
            <b>H5</b> files.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/db-access-output-file.png">
        </div>
        <div>
          <p>
            Specifying a custom job name can help make it easier to filter
            the job list on the <b>Job Status</b> page to find one or more jobs.
          </p>
          <p>
            To be notified when your job is complete, select the <b>Email when Complete</b>
            option and ensure that the email address is correct.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/db-access-options.png">
        </div>
      </div>
    `;
  }
}

window.customElements.define('des-help-db-access', DESHelpDbAccess);
