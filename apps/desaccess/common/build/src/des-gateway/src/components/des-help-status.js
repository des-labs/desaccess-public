import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';
import {config} from './des-config.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { scrollToTop } from './utils.js';

class DESHelpStatus extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <a href="#" onclick="return false;" title="Back to top" style="text-decoration: none; color: inherit;">
      <h3 @click="${scrollToTop}">
      Job Status Help
        <iron-icon icon="vaadin:angle-double-up"></iron-icon>
      </h3></a>
      <p>
        The job status page provides an interface to manage your jobs and view the results of
        completed jobs.
      </p>
      <div class="help-content-grid">
        <div>
          <p>
          The <b>Job Status</b> column, labeled by the <iron-icon icon="vaadin:dashboard"></iron-icon> icon, indicates if a job is in progress <iron-icon icon="vaadin:hourglass" style="color: orange;"></iron-icon>, is complete <iron-icon icon="vaadin:check-circle-o" style="color: green;"></iron-icon>, or has failed <iron-icon icon="vaadin:close-circle-o" style="color: red;"></iron-icon>.
          </p>
          <p>
          The <b>Job Type</b> column, labeled by the <iron-icon icon="vaadin:cubes"></iron-icon> icon, indicates the type of the job. For most people this is either a database query <iron-icon icon="vaadin:code"></iron-icon> or a cutout <iron-icon icon="vaadin:scissors"></iron-icon> type.
          </p>
          <p>
          Jobs may be sorted on multiple columns. For example, you may want to list jobs in progress at the top of the list, where they are then sorted by job type. Alternatively, you may want to see all of you database query jobs first, sorted by status so you can see all the query jobs still in progress at the top.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/status-job-status.png">
        </div>
        <div>
          <p>
            <b>Filter the job list</b> by typing part of the desired job name or ID into the column header text fields.
            Job <i><b>IDs</b></i> are unique, but the same job <i><b>name</b></i> can be applied to multiple jobs, providing a way
            to filter your job list to show a group of related jobs.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/status-filter.png">
        </div>
        <div>
          <p>
            Job details and results are accessed by clicking the name or ID in the list.
            The dialog contains a button to open a listing of the generated output files for download (see below for details about programmatic access to job output files).
            If the job is a <b>cutout</b> job, and there color image files were generated using the Lupton or STIFF methods,
            an image gallery is provided for easy image browsing.
            If the job is a <b>database query</b> job, the job query text is displayed with a button to conveniently copy the query back
            into the editor on the DB Access page.
        </div>
        <div class="image-container">
          <img src="images/help/status-results-dialog.png">
          <img src="images/help/status-image-gallery.png">
        </div>
      </div>
      <div>
        <p>
        The top level job output folder URL follows the form
        <code>${config.frontEndOrigin}/${config.fileServerRootPath}/[username]/[job_type]/[job_id]/</code>.
        To download job files programmatically, append <code>/json</code> to this folder URL to fetch a
        JSON-formatted directory listing amenable to procedural tree traversal. For example, user
        <code>astrobuff</code> could write a Python script like this to download all cutout job output
        files from job <code>c39008aa52f54b9e94335b566743af0c</code>:

        <pre>
#!/usr/bin/env python3

import requests
import os

job_id = 'c39008aa52f54b9e94335b566743af0c'
job_type = 'cutout'
username = 'astrobuff'
base_url = '${config.frontEndOrigin}/${config.fileServerRootPath}'

def download_job_files(url, outdir):
    os.makedirs(outdir, exist_ok=True)
    r = requests.get('{}/json'.format(url))
    for item in r.json():
        if item['type'] == 'directory':
            suburl = '{}/{}'.format(url, item['name'])
            subdir = '{}/{}'.format(outdir, item['name'])
            download_job_files(suburl, subdir)
        elif item['type'] == 'file':
            data = requests.get('{}/{}'.format(url, item['name']))
            with open('{}/{}'.format(outdir, item['name']), "wb") as file:
                file.write(data.content)

    return r.json()

job_url = '{}/{}/{}/{}'.format(base_url, username, job_type, job_id)
download_dir = './{}'.format(job_id)
download_job_files(job_url, download_dir)
print('Files for job "{}" downloaded to "{}"'.format(job_id, download_dir))
        </pre>
        <p>generating a list of downloaded files like so:</p>
        <pre>
./c39008aa52f54b9e94335b566743af0c/DES0226-1541/DESJ022640.4160-154120.0040_irg_stiff.png
./c39008aa52f54b9e94335b566743af0c/DES0226-1541/DESJ022640.4160-154120.0040_r.fits
./c39008aa52f54b9e94335b566743af0c/DES0226-1541/DESJ022642.8160-153932.0040_g.fits
./c39008aa52f54b9e94335b566743af0c/DES0226-1541/DESJ022642.8160-153932.0040_i.fits
./c39008aa52f54b9e94335b566743af0c/DES0305-3415/DESJ030510.9606-341521.6000_irg_lupton.png
./c39008aa52f54b9e94335b566743af0c/DES0305-3415/DESJ030510.9606-341521.6000_irg_stiff.png
./c39008aa52f54b9e94335b566743af0c/DES0305-3415/DESJ030510.9606-341521.6000_r.fits
./c39008aa52f54b9e94335b566743af0c/BTL_C39008AA52F54B9E94335B566743AF0C.csv
./c39008aa52f54b9e94335b566743af0c/BulkThumbs_20200706-152133.log
./c39008aa52f54b9e94335b566743af0c/BulkThumbs_20200706-152133_SUMMARY.json
        </pre>
      </div>
    `;
  }
}

window.customElements.define('des-help-status', DESHelpStatus);
