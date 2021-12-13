#!/bin/bash
set -e

REPO_ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../.."
cd $REPO_ROOT_DIR

ENV_VARS=$(tr '\n' ',' < packages/app/.env.prod)
PROJECT_ID="dework"
DEPLOYMENT_NAME="app-prod"
IMAGE_NAME="gcr.io/${PROJECT_ID}/app"
REGION="europe-west1"

gcloud config set project $PROJECT_ID

gcloud run deploy $DEPLOYMENT_NAME  \
  --image $IMAGE_NAME               \
  --update-env-vars "${ENV_VARS}"   \
  --region $REGION                  \
  --platform managed                \
  --allow-unauthenticated
