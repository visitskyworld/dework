#!/bin/bash
set -e

REPO_ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../.."
cd $REPO_ROOT_DIR

PROJECT_ID="dework-prod"
IMAGE_NAME="gcr.io/${PROJECT_ID}/api"
REGION="us-east1"
APP_YAML_PATH="packages/api/app.prod.yaml"
APP_ENV_YAML_PATH="packages/api/app.prod.env.yaml"

docker build --platform linux/amd64 -t $IMAGE_NAME -f packages/api/Dockerfile .
docker push $IMAGE_NAME

gcloud config set project $PROJECT_ID
## gcloud app deploy --image-url=$IMAGE_NAME --appyaml=$APP_YAML_PATH --quiet

DEPLOYMENT_NAME="api"
ENV_VARS=$(node packages/scripts/get-polling-runner-env.js $APP_ENV_YAML_PATH)

gcloud run deploy $DEPLOYMENT_NAME  \
  --image $IMAGE_NAME               \
  --update-env-vars $ENV_VARS       \
  --region $REGION                  \
  --platform managed                \
  --timeout 30s                     \
  --cpu 2                           \
  --memory 1G                       \
  --timeout 1m                      \
  --min-instances 2                 \
  --max-instances 4                 \
  --allow-unauthenticated

DEPLOYMENT_NAME="polling-runner"
ENV_VARS=$(node packages/scripts/get-polling-runner-env.js $APP_ENV_YAML_PATH exclude-env)

gcloud run deploy $DEPLOYMENT_NAME  \
  --image $IMAGE_NAME               \
  --update-env-vars $ENV_VARS       \
  --region $REGION                  \
  --platform managed                \
  --memory 2G                       \
  --timeout 30m                     \
  --allow-unauthenticated
