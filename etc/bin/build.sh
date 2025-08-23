#!/bin/bash

source ./etc/bin/source.sh

pushd code
$DOCKER_COMPOSE run --rm node yarn --cwd /app/ build
popd