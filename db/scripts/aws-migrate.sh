#!/bin/sh

AWS_REGION="eu-west-1"

get_ssm() {
  echo $(aws ssm get-parameter \
    --name $1 \
    --with-decryption \
    --region ${AWS_REGION} \
    --query Parameter.Value \
    --output text)
}

if [ -z "$DB_PASSWORD" ]; then
  echo "BEFORE BOOT: Fetching the environment variables from SSM"
  set +e
  export FLYWAY_USER=$(get_ssm ${DB_USER_SSM_PATH})
  export FLYWAY_PASSWORD=$(get_ssm ${DB_PASSWORD_SSM_PATH})
  set -e
else
  # For running the image locally with manually exposed environment variables and without AWS credentials
  echo "BEFORE BOOT: Database credentials have been already set manually"
fi

export FLYWAY_URL=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}

/flyway/flyway -baselineOnMigrate=true migrate