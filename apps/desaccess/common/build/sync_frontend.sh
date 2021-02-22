#!/bin/bash

set -e

scriptPath="$(readlink -f "$0")"
scriptDir="$(dirname "${scriptPath}")"
cd "${scriptDir}" || exit 1

NAMESPACE="$1"
if [[ "X${NAMESPACE}" == "X" ]]; then
  NAMESPACE=default
fi

DEPLOYMENT_NAME="desaccess-frontend"
SOURCE_DIR="src/des-gateway/src"
TARGET_DIR="/nodesrv/src"

POD_ID="$(kubectl get pod -n "${NAMESPACE}" --selector=app="${DEPLOYMENT_NAME}" -o jsonpath='{.items[0].metadata.name}')"
echo "Updating frontend code in ${POD_ID}..."
# export TIMESTAMP="$(date | tr -d '\n')"
TIMESTAMP="$(date | shasum | cut -f1 -d ' ')"
echo "${TIMESTAMP}" > "${SOURCE_DIR}/.codesync"
STRIP_NUM="$(echo "${SOURCE_DIR}" | tr '/' ' ' | wc -w)"
tar cf - "${SOURCE_DIR}" | \
    kubectl exec -i -n "${NAMESPACE}" "${POD_ID}" -- \
    tar xf - --strip-components="${STRIP_NUM}" -C "${TARGET_DIR}"

LASTSYNC="$(kubectl exec -it -n "${NAMESPACE}" "${POD_ID}" -- cat "${TARGET_DIR}/.codesync" | tr -d '\n' | tr -d '\r')"
# LASTSYNC="$(echo "${LASTSYNC}" | tr -d '\n' | tr -d '\r')"
if [[ "${LASTSYNC}" == "${TIMESTAMP}" ]]; then
  echo "Sync successful."
  # echo "Running polymer build..."
  # kubectl exec -it -n "${NAMESPACE}" "${POD_ID}" -- npm run build
  exit 0
else
  echo "Sync failed."
  exit 1
fi
