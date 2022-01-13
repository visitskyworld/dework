#!/bin/bash
set -e

REPO_ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../.."
cd $REPO_ROOT_DIR

PROJECT_ID="dework-demo"
IMAGE_NAME="gcr.io/${PROJECT_ID}/api"
REGION="us-east1"
APP_YAML_PATH="packages/api/app.demo.yaml"

docker build --platform linux/amd64 -t $IMAGE_NAME -f packages/api/Dockerfile .
docker push $IMAGE_NAME

gcloud config set project $PROJECT_ID
gcloud app deploy --image-url=$IMAGE_NAME --appyaml=$APP_YAML_PATH --quiet
