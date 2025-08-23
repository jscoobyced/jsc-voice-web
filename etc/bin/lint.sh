#!/bin/bash

source ./etc/bin/source.sh

WITH_COVERAGE=""

if [ "${COVERAGE}" != "" ];
then
    WITH_COVERAGE=" --coverage"
fi

pushd code
echo "Running lint"
$DOCKER_COMPOSE run --rm node yarn --cwd /app/ lint --fix
popd