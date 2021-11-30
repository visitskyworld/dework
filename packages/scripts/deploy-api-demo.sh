#!/bin/bash
set -e

REPO_ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../.."
cd $REPO_ROOT_DIR

ENV_VARS=$(tr '\n' ',' < packages/api/.env.demo)
PROJECT_ID="dework"
DEPLOYMENT_NAME="api-demo"
IMAGE_NAME="gcr.io/${PROJECT_ID}/api"
REGION="europe-west1"

docker build --platform linux/amd64 -t $IMAGE_NAME -f packages/api/Dockerfile .
docker push $IMAGE_NAME

gcloud config set project $PROJECT_ID

gcloud run deploy $DEPLOYMENT_NAME  \
  --image $IMAGE_NAME               \
  --update-env-vars "${ENV_VARS}"   \
  --region $REGION                  \
  --platform managed                \
  --allow-unauthenticated
