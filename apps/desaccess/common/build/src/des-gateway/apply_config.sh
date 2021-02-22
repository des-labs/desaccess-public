#!/bin/bash

cp src/components/des-config.js.tpl src/components/des-config.js
sed -i "s#{{BACKEND_BASE_URL}}#${BACKEND_BASE_URL}#g" src/components/des-config.js
sed -i "s#{{API_ROOT_PATH}}#${API_ROOT_PATH}#g" src/components/des-config.js
sed -i "s#{{FRONTEND_BASE_URL}}#${FRONTEND_BASE_URL}#g" src/components/des-config.js
sed -i "s#{{WEB_ROOT_PATH}}#${WEB_ROOT_PATH}#g" src/components/des-config.js
sed -i "s#{{FILESERVER_ROOT_PATH}}#${FILESERVER_ROOT_PATH}#g" src/components/des-config.js
TICKET_AUTH="$(echo -n ${TICKET_AUTH} | base64)"
sed -i "s#{{TICKET_AUTH}}#${TICKET_AUTH}#g" src/components/des-config.js
sed -i "s#{{DESACCESS_INTERFACE}}#${DESACCESS_INTERFACE}#g" src/components/des-config.js
sed -i "s#{{LIMIT_CUTOUTS_CUTOUTS_PER_JOB}}#${LIMIT_CUTOUTS_CUTOUTS_PER_JOB}#g" src/components/des-config.js

cp index.tpl.html index.html
sed -i "s#{{SERVICE_WORKER_SCOPE}}#${WEB_ROOT_PATH}#" index.html

cp polymer.tpl.json polymer.json
sed -i "s#{{WEB_ROOT_PATH}}#${WEB_ROOT_PATH}#g" polymer.json
