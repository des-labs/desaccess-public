#!/bin/bash

# LOCAL_DEV implies non-Kubernetes deployment
if [[ "$LOCAL_DEV" == "true" ]]; then
	source apply_config.sh
	npm install
	# Kubernetes would execute this using an initContainer via init.sh
	if [[ "$NPM_SCRIPT" == "build" ]]; then
		npm run build
	fi
fi

if [[ "$NPM_SCRIPT" == "build" ]]; then
	echo "Running \"npm run serve\"..."
	npm run serve
else
	echo "Running \"npm run start\"..."
	npm run start
fi
