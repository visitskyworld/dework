#!/bin/bash
set -e

REPO_ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../.."
cd $REPO_ROOT_DIR

PROJECT_ID="dework-prod"
IMAGE_NAME="gcr.io/${PROJECT_ID}/api"
REGION="us-east1"
APP_YAML_PATH="packages/api/app.prod.yaml"

docker build --platform linux/amd64 -t $IMAGE_NAME -f packages/api/Dockerfile .
docker push $IMAGE_NAME

gcloud config set project $PROJECT_ID
gcloud app deploy --image-url=$IMAGE_NAME --appyaml=$APP_YAML_PATH --quiet

DEPLOYMENT_NAME="api"
ENV_VARS=$(node packages/scripts/get-polling-runner-env.js packages/api/app.prod.env.yaml)

gcloud run deploy $DEPLOYMENT_NAME  \
  --image $IMAGE_NAME               \
  --update-env-vars $ENV_VARS       \
  --region $REGION                  \
  --platform managed                \
  --timeout 30s                     \
  --cpu 2                           \
  --memory 1G                       \
  --allow-unauthenticated

DEPLOYMENT_NAME="polling-runner"
ENV_VARS=$(node packages/scripts/get-polling-runner-env.js packages/api/app.prod.env.yaml exclude-env)

gcloud run deploy $DEPLOYMENT_NAME  \
  --image $IMAGE_NAME               \
  --update-env-vars $ENV_VARS       \
  --region $REGION                  \
  --platform managed                \
  --timeout 1m                      \
  --allow-unauthenticated
