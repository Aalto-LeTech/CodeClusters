# [Code Clusters](https://github.com/Aalto-LeTech/CodeClusters)

Work in progress.

[Model repository](https://github.com/Aalto-LeTech/CodeClustersModeling)

# How to install

Requires: Docker, DockerCompose, Node.js (preferably installed with nvm), yarn installed globally

## DB

1. Create and start the database: `./db.sh start`
2. Migrate and seed the data: `./db.sh migrate`

If you make changes to the schemas and want to re-migrate, use `./db.sh reset && ./db.sh migrate` to recreate the tables.

## Shared

Shared module contains the shared code between frontend and backend. Currently only holds the type definitions for the database objects.

1. Go to the `shared`-folder and link it to the local available packages: `yarn link`

## Backend

1. Go to the `backend`-folder and link the shared module: `yarn link shared`
2. Install dependencies: `yarn`
3. Copy the example environment variables: `cp .example.env .env`
4. Start the TypeScript compiler: `yarn ts:watch`
5. Open another terminal and start the server with: `yarn dev`

## Frontend

1. Go to the `frontend`-folder and link the shared module: `yarn link shared`
2. Install dependencies: `yarn`
3. Copy the example environment variables: `cp .example.env .env`
4. Start the Webpack bundler & dev-server: `yarn start`

## Test data generator

1. Go to the `db/generator`-folder and install dependencies: `npm`
2. Either run the script directly or using `db.sh`: `npm start` or `./db.sh testdata`

## Model server

Git clone https://github.com/Aalto-LeTech/CodeClustersModeling. Follow its instructions for starting the model-server. Then launch the app.

It should reside in http://localhost:8500. If you want to change it, remember to change the MODEL_SERVER_URL in backend's `.env`.

## Solr

The instructions for this are still a little bit hazy. In theory what you should do:

1. Start the solr server: `docker-compose up -d solr`
2. Add the lines from `solrconfig-add.xml` to the `solrconfig.xml` in `/solr/data/data/gettingstarted/conf`
3. Replace file `managed-schema`'s content with the contents of `schema.xml`
4. Copy `data-config.xml` to the same folder
5. Restart the solr: `docker-compose restart solr`
6. Run `./solr.sh data-import`
7. Visit the the GUI at http://localhost:8983 and see that there are no errors clicking the `Logging` link
8. Select the "gettingstarted" core from the `Core Selector` dropdown
9. Go to the `Query` page and click `Execute Query` without adding any parameters
10. This should return 112 records. If not, Google is your best friend

# How to launch manually in production

Requires a virtual machine eg Ubuntu 18.04 with root privileges. Expects git, Docker, Docker Compose to be installed.

1. Create app folder: `sudo mkdir /opt/codeclusters-app/`
2. Create user group that can access the app: `sudo groupadd codeclusters`
3. Create user: `sudo useradd codeclusters-app-user`
4. Add the user to the group: `sudo usermod -a -G codeclusters codeclusters-app-user`
5. Grant the folder's ownership to the user group: `sudo chown -R codeclusters-app-user:codeclusters /opt/codeclusters-app/`
6. Cd to the app folder: `cd /opt/codeclusters-app/`
7. Clone the repositories: `git clone https://github.com/Aalto-LeTech/CodeClusters && git clone https://github.com/Aalto-LeTech/CodeClustersModeling`
8. Cd to the main app folder: `cd CodeClusters`
9. Create Solr Docker volume folder with correct permissions: `mkdir -p ./solr/data && sudo chown -R 8983:8983 ./solr/data`
10. Create the environment variables:

```bash
cat > .db.env <<EOF
POSTGRES_USER=code-clusters-app-user
POSTGRES_PASSWORD=<32 char postgres password>
POSTGRES_DB=code_clusters_prod
EOF
```

```bash
cat > .backend.env <<EOF
NODE_ENV=production
PORT=8600
LOG_LEVEL=info

CORS_SAME_ORIGIN=true
JWT_SECRET=<128 char [a-z|A-Z|0-9]>

# Docker machine's internal IP for Ubuntu
DB_HOST=172.17.0.1
DB_PORT=5600
DB_USER=code-clusters-app-user
DB_PASSWORD=<32 char postgres password>
DB_NAME=code_clusters_prod

MODEL_SERVER_URL=http://172.17.0.1:8500
SOLR_URL=http://172.17.0.1:8983
EOF
```

```bash
cat > .flyway.env <<EOF
FLYWAY_USER=code-clusters-app-user
FLYWAY_PASSWORD=<32 char postgres password>
FLYWAY_NAME=code_clusters_prod
FLYWAY_URL=jdbc:postgresql://postgres:5432/code_clusters_prod
EOF
```

```bash
cat > .test_data.env <<EOF
EMAIL=admin@asdf.fi
PASSWORD=asdfasdf
API_URL=http://172.17.0.1:8600/api
EOF
```

11. Change the Solr db credentials and Docker IP (host.docker.internal to 172.17.0.1): `nano solr/data-config.xml`
12. Start up the Docker Compose stack with Let's Encrypt (in codeclusters.cs.aalto.fi domain): `./init-prod.sh certbot`
13. Run the migrations: `./init-prod.sh migrate`
14. Run the seeding: `./init-prod.sh seed`
15. Run the test data generator: `./init-prod.sh testdata`
16. Create the Solr data: `./init-prod.sh data-import`
