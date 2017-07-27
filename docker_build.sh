#!/usr/bin/env bash

HOSTNAME="gcr.io"
TAG=$1
PROJECT_ID="whatsit-174908"
IMAGE="whatsit-api"
NAMESPACE="whatsit"

docker build -t $IMAGE:$TAG .
docker tag $IMAGE:$TAG $HOSTNAME/$PROJECT_ID/$IMAGE:$TAG
gcloud docker -- push $HOSTNAME/$PROJECT_ID/$IMAGE:$TAG
gcloud container images list --repository=$HOSTNAME/$PROJECT_ID

kubectl --namespace=$NAMESPACE set image deployment/$IMAGE $IMAGE=$HOSTNAME/$PROJECT_ID/$IMAGE:$TAG
kubectl --namespace=$NAMESPACE rollout status deployment/$IMAGE
