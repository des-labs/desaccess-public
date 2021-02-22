#!/bin/bash

set -e

scriptPath="$(readlink -f "$0")"
scriptDir="$(dirname "${scriptPath}")"
cd "${scriptDir}" || exit 1
pwd
echo "$(date): Pre-build script start."

cd "../src/des-jobhandler/des_tasks/base-images/easyaccess"
if [[ "$(docker image list easyaccessclient:latest | grep easyaccessclient)" == "" ]]; then
    echo "Build easyaccessclient base image..."
    docker build --tag easyaccessclient:latest .
else
    echo "Skipping easyaccessclient base image build..."
fi

# Generate the Sphinx docs
cd "${scriptDir}/../src/desaccess-docs/docs/"
./build_docs

## Replace pre-rendering with JavaScript-based rendering in client browser
# cd "${scriptDir}/../src/docs" || exit 1
# bash run-openapi-generator.sh

echo "$(date): Pre-build script done."