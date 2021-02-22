let cnf = {
  "backEndOrigin" : "{{BACKEND_BASE_URL}}",
  "frontEndOrigin" : "{{FRONTEND_BASE_URL}}",
  "rootPath"  : "{{WEB_ROOT_PATH}}",
  "fileServerRootPath"  : "{{FILESERVER_ROOT_PATH}}",
  "apiPath"  : "{{API_ROOT_PATH}}",
  "ticketAuth": "{{TICKET_AUTH}}",
  "desaccessInterface": "{{DESACCESS_INTERFACE}}",
  "maxCutoutsPerJob": {{LIMIT_CUTOUTS_CUTOUTS_PER_JOB}}
}


let iterstr = null;
while(cnf.rootPath !== iterstr) {
  cnf.rootPath = cnf.rootPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  iterstr = cnf.rootPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
}

iterstr = null;
while(cnf.apiPath !== iterstr) {
  cnf.apiPath = cnf.apiPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  iterstr = cnf.apiPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
}

iterstr = null;
while(cnf.fileServerRootPath !== iterstr) {
  cnf.fileServerRootPath = cnf.fileServerRootPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  iterstr = cnf.fileServerRootPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
}

// Construct base URLs, ensuring exactly one trailing slash
cnf.frontEndUrl = cnf.frontEndOrigin.replace(/\/+$/, '') + '/' + cnf.rootPath + '/';
cnf.backEndUrl  = cnf.backEndOrigin.replace(/\/+$/, '') + '/' + cnf.apiPath + '/';
// Ensure exactly one trailing slash
cnf.frontEndUrl = cnf.frontEndUrl.replace(/\/+$/, '/')
cnf.backEndUrl = cnf.backEndUrl.replace(/\/+$/, '/')

export const config = cnf;

// The `rbac.js` file contains the role-based access control information for
// displaying pages based on the authenticated user's roles. This file must be
// provided. In deployment it is mounted from a ConfigMap.
import { rbac_bindings } from './rbac.js'
export { rbac_bindings } from './rbac.js'
