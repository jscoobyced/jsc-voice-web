<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
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
    <link media="all" rel="stylesheet" href="style.css" />
    <title>%VITE_APP_NAME%</title>
  </head>
  <body>
    <script>
      window.applicationData = {
        appVersion: '%VITE_APP_VERSION%',
      }
    </script>
    <script type="module" src="/src/main.tsx"></script>
    <div id="app"></div>
  </body>
</html>
