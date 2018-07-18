#!/bin/bash -e
export ENVIRONMENT=$1
export STACK_NAME="${ENVIRONMENT}-vui"
aws cloudformation delete-stack --stack-name ${STACK_NAME}  