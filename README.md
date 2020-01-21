# [Code Clusters](https://github.com/Aalto-LeTech/CodeClusters)

Work in progress.

# How to install

Requires: Docker, DockerCompose, Node.js (preferably installed with nvm), yarn installed globally

## DB

1. Create and start the database: `./db.sh start`
2. Migrate and seed the data: `./db.sh migrate`

If you make changes to the schemas and want to re-migrate, use `./db.sh reset && ./db.sh migrate` to recreate the tables.

## Backend

1. Go to the `backend`-folder and install dependencies: `yarn`
2. Copy the example environment variables: `cp .example.env .env`
3. Start the TypeScript compiler: `yarn ts:watch`
4. Open another terminal and start the server with: `yarn dev`

## Frontend

1. Go to the `frontend`-folder and install dependencies: `yarn`
2. Copy the example environment variables: `cp .example.env .env`
3. Start the Webpack bundler & dev-server: `yarn start`

## Common

Common module contains the shared code between frontend and backend. Currently only holds the type definitions for the database objects.
