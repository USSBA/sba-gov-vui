#!/bin/bash
BUCKET_NAME=sbagovlower-lambda-source-temp
PREFIX="mint"
ZIP_FILE="vui.zip"

cd lambda
zip -rq ../${ZIP_FILE} .
cd ..
aws s3 cp "${ZIP_FILE}" "s3://${BUCKET_NAME}/${PREFIX}/${ZIP_FILE}"
rm -rf "${ZIP_FILE}"