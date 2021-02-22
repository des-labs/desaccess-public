.. DES Labs Deployment System documentation master file, created by
   sphinx-quickstart on Tue Nov 10 13:25:10 2020.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

DES Labs Documentation
======================================================

The DES Labs team is part of the Dark Energy Survey Data Management team at NCSA. The purpose of DES Labs is to develop and deploy tools and services of use to the scientific community.

Documentation system
--------------------------------
This documentation serves as the "root" of documentation related to DES Labs. Ideally all relevant docs will be linked from the tree of linked documentation sources starting here.

The deployment framework used by DES Labs to deploy web services is described in :doc:`deployment_framework/deployment_framework`.

.. note::
   Documentation related to individual deployed services, or "apps", should be stored in ``/apps/$APPNAME/docs``. These should be individually symlinked into ``/docs/apps/$APPNAME`` like so::

      ln -s apps/$APPNAME/docs docs/apps/$APPNAME

.. warning::
   There is a minor bug due to the way we are using symlinks to app docs. To see the full documentation menu on the sidebar you sometimes need to return "home".

The documentation is powered by Sphinx, using the reStructuredText (reST) format. With Sphinx installed locally, you can build the HTML files using ::

  cd /docs/
  make html

Then open ``_build/html/index.html`` in your browser.

The ``/.gitlab-ci.yml`` file directs GitLab CI/CD system to automatically build and deploy these docs to https://des-labs.gitlab.io/deployment/.

Contents
----------------------------

.. toctree::
   :maxdepth: 2
   :glob:

   index
   deployment_framework/deployment_framework
   apps/desaccess/index
