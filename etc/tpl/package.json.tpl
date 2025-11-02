{
  "name": "jsc-voice-web",
  "private": false,
  "license": "MIT",
  "version": "0.4.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint .",
    "pretty": "prettier --write .",
    "server": "vite-node ./src/server/index.ts"
  }
}
