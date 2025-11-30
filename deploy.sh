#!/bin/bash

# Deploy backend to Cloud Run
# This script deploys the backend service to Google Cloud Run

# Configuration
SERVICE_NAME="meal-planner-backend"
REGION="us-central1"

# Get project ID from gcloud config
PROJECT_ID=$(gcloud config get-value project)

if [ -z "$PROJECT_ID" ]; then
  echo "Error: No GCP project configured."
  echo "Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "Deploying backend to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=10 \
  --cpu-throttling \
  --memory=512Mi \
  --cpu=1 \
  --timeout=300 \
  --project $PROJECT_ID

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "Deployment successful!"
  echo ""
  echo "Service URL:"
  gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --project $PROJECT_ID \
    --format='value(status.url)'
else
  echo ""
  echo "Deployment failed"
  exit 1
fi
