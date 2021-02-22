#!/bin/bash

source apply_config.sh

if [[ "$NPM_SCRIPT" == "build" ]]; then
	echo "Running \"npm run build\"..."
	npm run build
fi
