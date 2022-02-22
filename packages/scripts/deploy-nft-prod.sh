#!/bin/bash
set -e

REPO_ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../.."
cd $REPO_ROOT_DIR

ENV_VARS=$(tr '\n' ',' < packages/nft/.env.prod)
PROJECT_ID="dework-prod"
DEPLOYMENT_NAME="nft"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${DEPLOYMENT_NAME}"
REGION="us-east1"

docker build --platform linux/amd64 -t $IMAGE_NAME -f packages/nft/Dockerfile .
docker push $IMAGE_NAME

gcloud config set project $PROJECT_ID

gcloud run deploy $DEPLOYMENT_NAME  \
  --image $IMAGE_NAME               \
  --update-env-vars "${ENV_VARS}"   \
  --region $REGION                  \
  --platform managed                \
  --allow-unauthenticated

gcloud run services update-traffic $DEPLOYMENT_NAME \
  --to-latest                                       \
  --region $REGION                                  \
  --platform managed
