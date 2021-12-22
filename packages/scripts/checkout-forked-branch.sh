#!/bin/bash
set -e

CONTRIBUTOR_NAME=$1
BRANCH_NAME=$2
REPO_NAME="dewo"

git remote add ${CONTRIBUTOR_NAME} "https://github.com/${CONTRIBUTOR_NAME}/${REPO_NAME}"
git fetch ${CONTRIBUTOR_NAME}
git checkout --track "${CONTRIBUTOR_NAME}/${BRANCH_NAME}"
