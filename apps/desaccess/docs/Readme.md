DESaccess Deployment Documentation
======================================

Production deployment
--------------------------------------

There are two base images used by several image builds defined in `/apps/desaccess/common/build/src/des-tasks/base-images/`:

* `Dockerfile-oracleclient`
* `Dockerfile-easyaccessclient`

These two images must be built manually according the instructions in that folder on the machine that builds the rest of the images.

The `/scripts/deploy` script is used in the typical way to deploy this to the target cluster. Typically:

```
/scripts/deploy -a desaccess -n deslabs -c prod -u cluster-admin
```
or when developing:
```
/scripts/deploy -a desaccess -n desdev123 -c dev -u cluster-admin
```

Local development
--------------------------------------

The frontend and backend can be developed locally for more efficient code iteration and debugging. You can use `docker-compose` to build and run the same containers that would be deployed on the k8s cluster.

Recursively clone the deployment repo:

```
$ DEPLOYMENT_REPO=$HOME/deployment_repo
$ git clone --recurse-submodules https://git.desapps.cosmology.illinois.edu/andrew.manning/deployment_public $DEPLOYMENT_REPO
```

Copy the kubeconfig to create the local `k8s.conf`:
```
cp $DEPLOYMENT_REPO/private/infrastructure/cluster-dev/.kube/config              \
   $DEPLOYMENT_REPO/apps/desaccess/common/build/src/des-jobhandler/k8s.conf
```

Copy `.env.tpl` to create the local environment variable definition file used by `docker-compose`:
```
cp $DEPLOYMENT_REPO/apps/desaccess/common/build/.env.tpl              \
   $DEPLOYMENT_REPO/apps/desaccess/common/build/.env
```
You _must_ provide the Oracle credentials by replacing the placeholder values in `.env`:
```
ORACLE_USER_MANAGER=REQUIRED_USERNAME
ORACLE_PWD_MANAGER=REQUIRED_PASSWORD
```

Copy the `db_init.tpl.yaml` file to `db_init.yaml` and customize the initial data.
```
cp $DEPLOYMENT_REPO/apps/desaccess/common/build/src/des-jobhandler/config/db_init.tpl.yaml \
   $DEPLOYMENT_REPO/apps/desaccess/common/build/src/des-jobhandler/config/db_init.yaml
```

Copy the `des-tasks` folder into `des-jobhandler`:
```
cp -r $DEPLOYMENT_REPO/apps/desaccess/common/build/src/des-tasks \
      $DEPLOYMENT_REPO/apps/desaccess/common/build/src/des-jobhandler/
```

Build and launch the three containers using:
```
cd $DEPLOYMENT_REPO/apps/desaccess/common/build
export UID=$(id -u)
docker-compose up --build
```

Then open your browser to http://127.0.0.1:8080.

The three containers that run are the JobHandler (backend) and its MySQL database server, and the Node-based webserver (frontend). This deployment is not completely local, because the backend still authenticates via the remote Oracle DB, and the backend still requires a kubeconfig to communicate with a Kubernetes API server.

The frontend code (`src/des-gateway`) and backend code (`src/des-jobhandler`) are mounted as a live Docker volumes, allowing local code edits in those folders to appear immediately in the running containers.
