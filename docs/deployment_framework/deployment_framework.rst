DES Labs Deployment Framework
======================================================

This repo contains the scripts and content necessary to deploy DES
services on development and production clusters, following the
`GitOps <https://www.gitops.tech>`__ philosophy to ensure reproducible
cluster states by using version-controlled deployment.

.. warning::

    Sensitive information, including Kubernetes Secret resources, should not be stored directly in this deployment repo, but should instead be stored in a separate, more secure repo that is cloned in the ``/private`` location. Resources defined in this private git submodule are symbolically linked where needed. 

Purpose
---------------------------

The DES Labs developer team must create, debug, and improve a suite of
applications for use by the scientific community to utilize the large
quantities of data from the Dark Energy Survey. The purpose of this
deployment repo is to achieve several goals:

-  App development should be highly collaborative and have the ability
   to iterate on ideas rapidly.
-  New and updated code should be deployed easily on a development
   Kubernetes cluster and subsequently on the production cluster in a
   seamless workflow that reduces chances for error and inconsistency.
-  The state of the Kubernetes clusters should be reproducible from the
   deployment repo. The development team should be free to innovate and
   experiment without fear of disrupting live web services.

Overview
-----------------------------------------------------------

This template repository contains the framework that allows you to deploy services on development and production Kubernetes (k8s) clusters, following the `GitOps <https://www.gitops.tech>`_ philosophy to ensure reproducible cluster states by using version-controlled deployment.

The fundamental unit of our organization scheme is an individual application, or *app*. The idea is that k8s resources (Ingresses, Deployments, Secrets, Services, etc) are typically deployed to support a specific app. We want the creation, update and deletion of these app resources to be as simple as possible. To that end, we are using the `Carvel Kubernetes tools <https://carvel.dev/>`_ as the basis of our workflow.

The repo is organized into several folder trees that follow a specific hierarchy:

* ``/apps/``
* ``/config/``
* ``/infrastructure/``
* ``/private/``
* ``/scripts/``

The foundational configuration of the cluster, including things like namespace definitions and TLS certificates, is essentially app-independent and must be deployed manually from the config files in ``/infrastructure``.

The configuration of individual apps is constructed hierarchically, starting with the parameter values defined in the ``/config`` tree. 

#. The global default values are set first, followed by 
#. cluster-specific, cluster-wide values, followed by 
#. cluster-specific, namespace-specific values, followed by 
#. the values specified in the app-specific folder in the ``/apps`` tree.

.. _carvel:

Carvel Kubernetes Tools
-----------------------------------------------------------

The software utilities powering this framework are part of the Carvel suite (formerly Kubernetes Tools, or k14s). According to the project page:

    Carvel provides a set of reliable, single-purpose, composable tools that aid in your application building, configuration, and deployment to Kubernetes.

These tools include ``ytt`` for configuration templating, ``kbld`` for image building and pushing, and ``kapp`` for creating and updating k8s resources defined together as an application. These tools assume ``kubectl`` is installed.

.. warning::

    Sensitive information, including Kubernetes Secret resources, should not be stored directly in this deployment repo, but should instead be stored in a separate, more secure repo that is cloned in the ``/private`` location. Resources defined in this private git submodule are symbolically linked where needed. 

Infrastructure
-----------------------------------------------------------

All updates to cluster configuration or infrastructure k8s resources should be captured in the ``/infrastructure`` tree. When necessary, scripts to ensure reproducibility of the cluster state should be added to the ``/scripts`` folder **along with the corresponding documentation**.

For example, the image registry credentials needed by the deployments is stored in ``/private/infrastructure/common/registry-auth.yaml`` and symlinked to ``/infrastructure/common/registry-auth.yaml``. It must be deployed manually to each namespace where there is an app deployed that relies on those credentials.

App Deployment
-----------------------------------------------------------

App deployment is best explained with an example. Let's define and deploy an app called ``website``. 

First we create the app folder ``/apps/website``. The next level of the app folder hierarchy must have at least the folder ``common``, and may also contain ``cluster-dev`` and ``cluster-prod``, if there are cluster-specific configuration settings for the app::

    /apps/website/
    /apps/website/common/
    /apps/website/cluster-dev/
    /apps/website/cluster-prod/

The ``common`` folder must contain a ``config`` folder that defines the k8s resources to be created. Any YAML file in this folder will be included as part of the deployed app. This folder typically contains at least two files::

    /apps/website/common/config/config.yaml
    /apps/website/common/config/values.yaml

but also frequently includes a symlink to a `secrets.yaml` file residing in the separate ``/private`` git submodule::

    /apps/website/common/config/secrets.yaml -> ../../../../private/apps/website/common/config/secrets.yaml

The ``values.yaml`` file is a special file used by the ``ytt`` utility to render the templated configuration files. It may contain definitions such as ::

    #@data/values
    ---
    app_name: website

that allow the k8s resource definitions in ``config.yaml`` such as ::

    #@ load("@ytt:data", "data")
    #@yaml/text-templated-strings
    ---
    kind: Deployment
    apiVersion: apps/v1
    metadata:
      name: (@= data.values.app_name @)

to render as ::

    ---
    kind: Deployment
    apiVersion: apps/v1
    metadata:
      name: website

If we want to actually deploy this to the cluster, we invoke the ``deploy`` script::

    /scripts/deploy -a website -n default -c dev -u cluster-user

The input parameters tell the deploy script to build and deploy the app "website" to the namespace "default" on the development cluster with authentication for user "cluster-user". Let's follow the logic of the ``deploy`` script to understand the hierarchical configuration scheme.

First, the k8s access configuration file, or kubeconfig, for the target cluster is loaded for use by ``kubectl``::

    export KUBECONFIG=/private/infrastructure/cluster-dev/.kube/config

Then the context is set for subsequent ``kubectl`` commands::

    kubectl config use-context cluster-user@cluster-dev

The next step is the hierarchical loading of the app configuration. The order follows this sequence::

    1. /config/defaults
    2. /config/cluster-dev/cluster
    3. /config/cluster-dev/namespace
    4. /apps/website/common/config
    5. /apps/website/cluster-dev/config

The power of this hierarchy is evident when we dive into more detail in this example.

Development workflow
-----------------------------------------------------------

The primary deployment workflow revolves around the ``/scripts/deploy`` script, deploying an updated app first on the dev cluster, and then after code review, on the production cluster.

#. A developer clones this repo (recursively to get the submodules), and then typically begins working on a particular app's source code (typically a git submodule within ``/apps/[app_name]/common/build/src``).
#. To rapidly iterate the code, the developer frequently runs the deploy script to update the resources on the dev cluster in a development namespace such as ``dev1``. The ``deploy`` script builds the templated k8s resource config files for the app using ``ytt``, builds the updated Docker image if necessary using ``kbld``, pushes the image to the image repository, and then updates the app resources using ``kapp``.
#. When the app update has been tested properly, it can be deployed on the production cluster by simply changing the target cluster in the ``deploy`` command.

Persistent Volumes
---------------------------

Persistent volumes (PVs) provide storage for Kubernetes deployments that persists beyond the lifecycle of the individual pods or deployments themselves. Our PVs are one of the following types:

* local paths to GPFS-mounts on the host nodes (all nodes have the GPFS mounts at the same path)
* storage volumes managed by Longhorn, using local storage capacity from each host node to replicate each PV across the cluster

For more information about the Longhorn installation and configuration, see `/infrastructure/cluster-prod/longhorn/Readme.md <../../../../infrastructure/cluster-prod/longhorn/Readme.md>`_

Docker image registry
---------------------------

We use the Harbor instance at https://hub.ncsa.illinois.edu/ for a private Docker image registry. There are two service accounts with access to the "des" project space:

* The first service account is ``robot$puller``. It is a pull-only account that is deployed as a k8s Secret (see ``/infrastructure/common/registry-auth.yaml``) so that Deployments can pull their container images.
* The second service account is ``robot$deployment``. This is a push/pull account whose password does not leave the build-and-deploy machine, which may be a developer workstation or perhaps a dedicated build node.

Tutorials
---------

Install required packages on your local development machine
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Carvel Kubernetes Tools
^^^^^^^^^^^^^^^^^^^^^^^

The software utilities powering this framework are part of the Carvel suite (formerly Kubernetes Tools, or k14s). According to the project page:

    Carvel provides a set of reliable, single-purpose, composable tools that aid in your application building, configuration, and deployment to Kubernetes.

These tools include ``ytt`` for configuration templating, ``kbld`` for image building and pushing, and ``kapp`` for creating and updating k8s resources defined together as an application. 

.. note::
   These tools assume ``kubectl`` is installed.

The tools can be installed by following the
instructions on their website. To avoid requiring admin permissions
for anything, you can add ``~/.local/bin`` to your ``PATH`` environment
variable by adding the following line to your ``~/.bashrc`` file:

::

   export PATH=$HOME/.local/bin:$PATH

Then, you install k14s using the following commands

::

   export K14SIO_INSTALL_BIN_DIR=$HOME/.local/bin/
   curl -L https://k14s.io/install.sh | bash

Docker
^^^^^^

You need Docker installed locally in order to build and push images to
the our private image registry.

On Linux, install Docker using

::

   sudo apt install docker.io
   sudo usermod -aG docker $USER

Then log out and back in to activate your new ``docker`` group
membership.

You should run the ``docker login`` command manually once to store the image registry credentials for future use by the ``deploy`` script:

::

   docker login registry.example.com

Sphinx documentation generator
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

On Linux, install Sphinx using

::

   sudo apt install sphinx-common 


Create cluster namespace admins
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Apply the ClusterRole resources needed. On cluster-dev for example:

::

   kubectl apply -f infrastructure/cluster-dev/rbac-users.yaml

Then create the users:

::

   ./scripts/add_k8s_user -u andrew -u matias -u michael -c dev

The user creation script will generate a kubeconfig file
``scripts/user_certs/generated_kubeconfig`` from which you can manually
copy the ``users`` and ``contexts`` items associated with the new users.
If you want to assign different users to different default namespaces
you can run the script individually like

::

   ./scripts/add_k8s_user -u michael -n desdev1 -c dev
   ./scripts/add_k8s_user -u andrew  -n desdev2 -c dev
   ...

Then configure these users as namespace admins for one or more
namespaces:

::

   ./scripts/create_namespace_admins -u andrew -u michael -u matias -n desdev1 -n desdev2 -n desdev3 -c dev

Manage apps
~~~~~~~~~~~

::

   # Change directory to deployment repo root and set kubeconfig path
   export KUBECONFIG="$(pwd)/private/infrastructure/cluster-dev/.kube/config"
   kubectl config use-context andrew@cluster-dev

   # List kapp-deployed apps
   kapp ls -n desapps

   # Delete one of the apps
   ./scripts/delete_app -u andrew -n desapps -c dev -a registry

   # Redeploy some apps
   ./scripts/deploy -u andrew -n desapps -c dev -a registry
   ./scripts/deploy -u andrew -n desapps -c dev -a deslabs-frontpage

TLS certificates
~~~~~~~~~~~~~~~~~~~~~~~

Our TLS certificates (a.k.a. SSL certs) are issued by NCSA. To request a certificate, `follow the instructions on the NCSA wiki <https://wiki.ncsa.illinois.edu/display/cybersec/NCSA+Certificate+Requests#NCSACertificateRequests-request>`_. 

Create a CSR using the following command::

   domain="des.ncsa.illinois.edu" # Replace with the relevant Fully qualified domain name (FQDN)
   openssl req -nodes -newkey rsa:2048 \
      -keyout "${domain}.tls.key" \
      -out "${domain}.csr" \
      -subj "/C=US/ST=Illinois/L=Urbana/O=University of Illinois/OU=NCSA/CN=${domain}"

Email this CSR file and a request message to help+ca@ncsa.illinois.edu. Do not lose the associated ``key`` file.

.. note::
   `It is possible to use LetsEncrypt to automate TLS certificate issuance and renewal <https://answers.uillinois.edu/illinois/92484>`_, but we have not implemented this.
   
In the example of the cert for ``des.ncsa.illinois.edu`` above, when the cert is signed and issued, it must be incorporated into the corresponding k8s Secret definition.

The ``des.ncsa.illinois.edu`` domain is associated with all ingresses defined for namespace ``default`` on the production cluster (cluster-prod). The secret name is captured in the file ``/config/cluster-prod/namespace/default/values.yaml``, and the referenced secret itself is in ``/private/infrastructure/cluster-prod/tls-certificates.yaml``. 

The construction of the signed certificate is confusing. You should download the version with the entire chain included, but then you need to rearrange the order of the chain by moving the cert to the top. Your resulting `crt` file will have a structure similar to this::

   -----BEGIN CERTIFICATE-----
   MIIG...WQ==
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   MIIE...bg==
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   MIIF...1+V
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   MIIF+...Ywk
   -----END CERTIFICATE-----

where the domain-specific cert is the top ``MIIG...`` section and the other three below are the CA cert chain.

Convert this modified cert and key files to base64 encoding using ::

   $ cat des_ncsa_illinois_edu.cer.with_chain | base64 | tr -d '\n'
   $ cat des.ncsa.illinois.edu.tls.key | base64 | tr -d '\n'

and populate the values of the ``tls.crt`` and ``tls.key`` fields in the secret definition. 

Apply the updates to the k8s Secret manually.