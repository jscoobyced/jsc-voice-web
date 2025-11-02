[![codecov](https://codecov.io/gh/jscoobyced/jsc-voice-web/graph/badge.svg?token=GGSIN6EJMA)](https://codecov.io/gh/jscoobyced/jsc-voice-web)

## JSC Voice Web - A story where you are the hero

Start the application to have a conversation with an AI powered story teller that will let you be the hero of the story.

# Quick Start - Running the application

To quickly get up and running:

```
docker run --env VITE_SERVER_WEBSOCKET_SERVER="web.yourdomain.com" -p 8080:80 jscdroiddev/jsc-voice-web:latest
```

Then open your browser on http://localhost:8080.

# Quick Start - Development

- Create a new Github repository using this repository as template
- Clone your new repository
- Copy the `./code/.env.example` file to a `./code/.env` file
- Edit the content of the `.env` file to match your preferences (see next section for details)
- Run the following commands:

```
make setup
make dev
```

Alternatively to enable tests, React or both, choose just one of below:

```
make setup-with-tests
make setup-with-react
make setup-with-tests-and-react
```

then followed by `make dev`

If you don't have `make` on your machine, simply run:

```
./etc/bin/setup.sh
./etc/bin/dev.sh
```

Alternatively to enable tests, React or both, choose just one of below:

```
TESTS=Y ./etc/bin/setup.sh
REACT=Y ./etc/bin/setup.sh
TESTS=Y REACT=Y ./etc/bin/setup.sh
```

then followed by `./etc/bin/dev.sh`

## Setting up tests

If you want to enable testing dependencies and code coverage, run:

```
make setup-with-tests
make dev
```

If you don't have `make` on your machine, simply run:

```
TESTS=y ./etc/bin/setup.sh
./etc/bin/dev.sh
```

Your application will be running on http://localhost:5173

## Environment

Here are the current environment variables to set in the `code/.env` file:

- VITE_APP_NAME: set the name of your application. It will be the `<title>` of the webpage and used in some logging
- VITE_APP_VERSION: the version of the application. It gets overwritten when you build your docker image in Github Actions.
- VITE_FACEBOOK_APP_ID: if you have a Facebook App associated with this application. Otherwise remove from the `index.html` file
- VITE_DESCRIPTION: the description of the application, used in the meta tags for SEO
- VITE_APP_URL: the URL where this application is running, used in the meta tags for SEO
- VITE_APP_IMAGE: the marketing image to use, used in the meta tags for SEO
- VITE_APP_IMAGE_HEIGHT: the height of the marketing image (required by Facebook for better optimization)
- VITE_APP_IMAGE_WIDTH: the width of the marketing image (required by Facebook for better optimization)

# Making changes

You can add your components in the `code/src` folder.

## Adding a new dependency

Edit the `code/deps_dev.txt` or `code/deps_run.txt` to add the relevant NPM packages. Then run:

```
make setup
# or
make setup-with-tests
```

# Code coverage

To get code coverage uploaded to Codecov, you need to add a Github secret named `CODECOV_TOKEN` with your token from Codecov.
