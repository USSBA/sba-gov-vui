#!/bin/bash -e
export S3BUCKET=sbagovlower-lambda-source-temp
export ZIP_FILENAME=vui.zip
export ENVIRONMENT=mint
export CLOUD_FORMATION_TEMPLATE_NAME=vui.yml
export STACK_NAME="${ENVIRONMENT}-vui"

TIMESTAMP=$(date +%s)

echo "Uploading CloudFormation Template"
aws s3 cp ${CLOUD_FORMATION_TEMPLATE_NAME} s3://${S3BUCKET}/${ENVIRONMENT}/${CLOUD_FORMATION_TEMPLATE_NAME}

echo "Creating Stack"
aws cloudformation create-change-set --stack-name ${STACK_NAME} --change-set-name ContentApiChangeSet$TIMESTAMP \
  --change-set-type $1 \
  --template-url https://s3.amazonaws.com/${S3BUCKET}/${ENVIRONMENT}/${CLOUD_FORMATION_TEMPLATE_NAME} \
  --capabilities "CAPABILITY_IAM" \
  --parameters ParameterKey=Environment,ParameterValue=${ENVIRONMENT} 
aws cloudformation wait change-set-create-complete --stack-name ${STACK_NAME} --change-set-name ContentApiChangeSet$TIMESTAMP
aws cloudformation execute-change-set --stack-name ${STACK_NAME}  --change-set-name ContentApiChangeSet$TIMESTAMP

echo "Done"