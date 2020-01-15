# [Code Clusters](https://github.com/Aalto-LeTech/CodeClusters)

Work in progress.

# How to install

Requires: Docker, DockerCompose, Node.js (preferably installed with nvm), yarn installed globally

## DB

1. Create and start the database: `./db.sh start`
2. Migrate and seed the data: `./db.sh migrate`

If you make changes to the schemas and want to re-migrate, use `./db.sh reset && ./db.sh migrate` to recreate the tables.

## Backend

First off you should go to the `common`-folder and install the module locally: `yarn link`. 

1. Go to the `backend`-folder and install dependencies: `yarn`
2. Copy the example environment variables: `cp .example.env .env`
3. Link the common module: `yarn link common`
4. Start the TypeScript compiler: `yarn ts:watch`
5. Open another terminal and start the server with: `yarn dev`

## Frontend

You should have the `common`-module installed as with the backend.

1. Go to the `frontend`-folder and install dependencies: `yarn`
2. Copy the example environment variables: `cp .example.env .env`
3. Link the common module: `yarn link common`
4. Start the Webpack bundler & dev-server: `yarn start`
