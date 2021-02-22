Example Scripts
=========================

Jupyter Notebooks
---------------------------------

* `DESaccess API Examples <https://github.com/des-labs/desaccess-docs/blob/master/_static/DESaccess_API_example.ipynb>`_ (`direct download <_static/DESaccess_API_example.ipynb>`_)

Download job files
---------------------------------

The top level job output folder URL follows the form
``https://des.ncsa.illinois.edu/files-desaccess/[username]/[job_type]/[job_id]/``.
To download job files programmatically, append ``/json`` to this
folder URL to fetch a JSON-formatted directory listing amenable to
procedural tree traversal. For example, user ``astrobuff`` could
write a Python script like this to download all cutout job output
files from job ``c39008aa52f54b9e94335b566743af0c``:

::

   #!/usr/bin/env python3

   import requests
   import os

   job_id = 'c39008aa52f54b9e94335b566743af0c'
   job_type = 'cutout'
   username = 'astrobuff'
   base_url = 'https://des.ncsa.illinois.edu/desaccess/api'

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
            

generating a list of downloaded files like so:

::

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
         
