[![codecov](https://codecov.io/gh/jscoobyced/jsc-voice-web/graph/badge.svg?token=GGSIN6EJMA)](https://codecov.io/gh/jscoobyced/jsc-voice-web)

## JSC Voice Web - A story where you are the hero

Start the application to have a conversation with an AI powered story teller that will let you be the hero of the story.

# Quick Start - Running the application

To quickly get up and running:

```
docker run --rm --env VITE_SERVER_WEBSOCKET_SERVER="ws.your-domain.com" -p 8080:80 --name jjj jscdroiddev/jsc-voice-web

```

Then open your browser on http://localhost:8080.

# Quick Start - Development

- Clone the repository
- Copy the `./code/.env.example` file to a `./code/.env` file
- Edit the content of the `.env` file to match your preferences (see next section for details)
- Run the following commands:

```
make setup
make dev
```

If you don't have `make` on your machine, simply run:

```
./etc/bin/setup.sh
./etc/bin/dev.sh
```

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
- VITE_SERVER_WEBSOCKET_SCHEME: the HTTP schema to use (i.e. ws or wss)
- VITE_SERVER_WEBSOCKET_SERVER: the server running [JSC Voice server](https://github.com/jscoobyced/jsc-voice-web)
- VITE_SERVER_WEBSOCKET_PORT: the port of the server
- VITE_SERVER_WEBSOCKET_PATH: the path of the web-socket (default is empty)

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
