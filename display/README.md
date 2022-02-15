# TicTacToe **`Py-Driven`** Webapp

*`TODO: IMPROVE THIS SECTION`*

## Directory structure
- `packages` directory contains the main packages
  - `app` the frontend SPA. Written in Vue 2 using Vuetify 
  - `server` An express server accessed through REST API endpoints (REST)

## Development

This repository is a monorepo managed with [pnpm](https://pnpm.io). Knowing a few things about pnpm is helpful.


### Prerequisites

- NodeJs (^14.x) is recommended
- pnpm. (^6.x). Version 5 was not tested (could work).

Please see each package README file for detailed information.

### Development

Make sure to have pnpm globally installed before you continue with the following steps. And also MongoDB is needed as a database management system.

1. clone the repository. For enhanced security in production, You may want to use of GitHub [Deploy Keys](https://docs.github.com/en/free-pro-team@latest/developers/overview/managing-deploy-keys)
2. install dependencies
   ```bash
   pnpm i
   ```


3. Each package can be started in development mode by running
    ```bash
   pnpm dev
   ```