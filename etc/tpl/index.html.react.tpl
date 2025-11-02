<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="fb:app_id" content="%VITE_FACEBOOK_APP_ID%" />
    <meta property="og:title" content="%VITE_APP_NAME%" />
    <meta property="og:description" content="%VITE_DESCRIPTION%" />
    <meta property="og:type" content="game" />
    <meta property="og:url" content="%VITE_APP_URL%" />
    <meta property="og:site_name" content="%VITE_APP_NAME%" />
    <meta property="og:image" content="%VITE_APP_IMAGE%" />
    <meta property="og:image:height" content="%VITE_APP_IMAGE_HEIGHT%" />
    <meta property="og:image:width" content="%VITE_APP_IMAGE_WIDTH%" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>%VITE_APP_NAME%</title>
  </head>
  <body class="bg-amber-50 dark:bg-gray-800 dark:text-amber-50 font-montserrat">
    <script>
      window.applicationData = {
        appVersion: '%VITE_APP_VERSION%',
        webSocketScheme: '%VITE_SERVER_WEBSOCKET_SCHEME%',
        webSocketServer: '%VITE_SERVER_WEBSOCKET_SERVER%',
        webSocketPort: '%VITE_SERVER_WEBSOCKET_PORT%',
        webSocketPath: '%VITE_SERVER_WEBSOCKET_PATH%',
      }
    </script>
    <script type="module" src="/src/main.tsx"></script>
    <div id="app"></div>
  </body>
</html>
