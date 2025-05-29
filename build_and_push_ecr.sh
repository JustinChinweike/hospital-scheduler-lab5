#!/bin/bash
set -e

# Build and push Docker images to AWS ECR

AWS_ACCOUNT_ID=<your_account_id>
AWS_REGION=us-east-1

# ECR repository names
BACKEND_REPO_NAME=hospital-backend
FRONTEND_REPO_NAME=hospital-frontend

# Create ECR repositories if they don't exist
aws ecr create-repository --repository-name $BACKEND_REPO_NAME --region $AWS_REGION || true
aws ecr create-repository --repository-name $FRONTEND_REPO_NAME --region $AWS_REGION || true

# Authenticate Docker to AWS ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build backend image and push
docker build -t $BACKEND_REPO_NAME:latest ./backend
docker tag $BACKEND_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO_NAME:latest

# Build frontend image and push
docker build -t $FRONTEND_REPO_NAME:latest ./frontend
docker tag $FRONTEND_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO_NAME:latest
