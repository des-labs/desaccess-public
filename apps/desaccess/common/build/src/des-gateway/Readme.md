DESaccess frontend
===================

This repo contains the code for the frontend of the [DESaccess web app](https://des.ncsa.illinois.edu/releases/dr1/dr1-access), which consists of other components in conjunction with this frontend. The corresponding [backend can be found here](https://github.com/des-labs/des-jobhandler/).

We are using the [LitElement](https://lit-element.polymer-project.org/) base class and [lit-html](https://lit-html.polymer-project.org/) templating to construct composable web components, by extending the [PWA Starter Kit](https://pwa-starter-kit.polymer-project.org/) example app.

The repo is designed for containerized deployment via Docker or Kubernetes, but it can also be run directly. Export some environment variable definitions as shown:

```
export FRONTEND_BASE_URL=http://127.0.0.1:8080
export WEB_ROOT_PATH=
export BACKEND_BASE_URL=http://127.0.0.1:8888
export API_ROOT_PATH=
export NPM_SCRIPT=
export LOCAL_DEV=true

bash frontend.entrypoint.sh
```

This will run the Node-based `polymer` webserver in a way amenable for code development, such that changing source files and reloading the browser page will show updates. Setting `NPM_SCRIPT=build` will instead trigger the `polymer build` to be subsequently served by `prpl-server` in a method more suitable for production deployment.

**Note**: Without the backend online at the `$BACKEND_BASE_URL` defined above, the login process will fail.
