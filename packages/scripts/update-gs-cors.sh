#!/bin/bash
set -e

REPO_ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../.."
cd $REPO_ROOT_DIR

# gsutil cors set "${REPO_ROOT_DIR}/packages/scripts/cors.json" gs://dev.assets.dework.xyz
# gsutil cors set "${REPO_ROOT_DIR}/packages/scripts/cors.json" gs://assets.dework.xyz
gsutil cors set "${REPO_ROOT_DIR}/packages/scripts/cors.json" gs://chum-bucketz