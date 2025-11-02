#!/bin/bash

set -e
source ./code/.env.production
docker build -t jscdroiddev/jsc-voice-web:latest -f etc/docker/Dockerfile .