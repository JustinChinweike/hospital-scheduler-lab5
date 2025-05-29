#!/bin/bash
# Build and push Docker images to AWS ECR

# Define your AWS account ID and region
AWS_ACCOUNT_ID=<your_account_id>
AWS_REGION=us-east-1

# ECR repository names
BACKEND_REPO_NAME=hospital-backend
FRONTEND_REPO_NAME=hospital-frontend

# Build backend image
docker build -t $BACKEND_REPO_NAME:latest ./backend

# Create ECR repository if not exists
aws ecr create-repository --repository-name $BACKEND_REPO_NAME --region $AWS_REGION || true

# Tag and push backend image
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
docker tag $BACKEND_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO_NAME:latest

# Build frontend image
docker build -t $FRONTEND_REPO_NAME:latest ./frontend

# Create ECR repository if not exists
aws ecr create-repository --repository-name $FRONTEND_REPO_NAME --region $AWS_REGION || true

# Tag and push frontend image
docker tag $FRONTEND_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO_NAME:latest
