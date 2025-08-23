#!/bin/bash

source ./etc/bin/source.sh

SRC_DIR="code"
INCLUDE_TEST="N"
INCLUDE_REACT="N"

if [ "$TESTS" = "yes" ] || [ "$TESTS" = "y" ] || [ "$TESTS" = "Yes" ] || [ "$TESTS" = "Y" ];
then
    INCLUDE_TEST="Y"
fi

if [ "$REACT" = "yes" ] || [ "$REACT" = "y" ] || [ "$REACT" = "Yes" ] || [ "$REACT" = "Y" ];
then
    INCLUDE_REACT="Y"
fi

prepare_environment() {
    # Reset default environment
    rm ./${SRC_DIR}/vitest.config.ts
    cp ./etc/tpl/package.json.tpl ./${SRC_DIR}/package.json
    cp ./etc/tpl/tsconfig.json.tpl ./${SRC_DIR}/tsconfig.json
    cp ./etc/tpl/vite.config.ts.tpl ./${SRC_DIR}/vite.config.ts
    cp ./etc/tpl/eslint.config.mjs.tpl ./${SRC_DIR}/eslint.config.mjs
    cp ./etc/tpl/index.html.tpl ./${SRC_DIR}/index.html


    if [ "Y" = "$INCLUDE_TEST" ];
    then
        cp ./etc/tpl/tsconfig.json.test.tpl ./${SRC_DIR}/tsconfig.json
        cp ./etc/tpl/vite.config.test.ts.tpl ./${SRC_DIR}/vite.config.ts
        cp ./etc/tpl/vitest.config.ts.tpl ./${SRC_DIR}/vitest.config.ts

        if [ "Y" = "$INCLUDE_REACT" ];
        then
            cp ./etc/tpl/tsconfig.json.test.react.tpl ./${SRC_DIR}/tsconfig.json
            cp ./etc/tpl/vite.config.test.react.ts.tpl ./${SRC_DIR}/vite.config.ts
            cp ./etc/tpl/vitest.config.react.ts.tpl ./${SRC_DIR}/vitest.config.ts
        fi
    else
        if [ "Y" = "$INCLUDE_REACT" ];
        then
            cp ./etc/tpl/tsconfig.json.react.tpl ./${SRC_DIR}/tsconfig.json
            cp ./etc/tpl/eslint.config.react.mjs.tpl ./${SRC_DIR}/eslint.config.mjs
            cp ./etc/tpl/index.html.react.tpl ./${SRC_DIR}/index.html
        fi
    fi
}

build_web() {
    pushd ${SRC_DIR}
    echo "    🛠️   Building $1"
    # Delete older node_modules, yarn.lock, dist and coverage
    rm -Rf ./node_modules ./yarn.lock ./dist ./coverage
    # Format dependencies to a single line
    DEV_FILES=$(cat ./deps_dev.txt | tr '\n' ' ')
    RUN_FILES=$(cat ./deps_run.txt | tr '\n' ' ')
    DEV_TEST_FILES=$(cat ./deps_dev_test.txt | tr '\n' ' ')
    # Install dependencies
    if [ "$RUN_FILES" != "" ]; then
        echo "    📦   Installing dependencies"
        $DOCKER_COMPOSE run --rm node yarn --cwd /app/ add $RUN_FILES > /dev/null
    fi
    # Install dev dependencies
    if [ "$DEV_FILES" != "" ]; then
        echo "    📦   Installing dev dependencies"
        $DOCKER_COMPOSE run --rm node yarn --cwd /app/ add -D $DEV_FILES > /dev/null
    fi

    # Install dev test dependencies
    if [ "Y" = "$INCLUDE_TEST" ] && [ "$DEV_TEST_FILES" != "" ]; then
        echo "    📦   Installing dev test dependencies"
        $DOCKER_COMPOSE run --rm node yarn --cwd /app/ add -D $DEV_TEST_FILES > /dev/null
    fi
    popd
}

prepare_environment
build_web "${VITE_APP_NAME}"