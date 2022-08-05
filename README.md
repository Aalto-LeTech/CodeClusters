# [Code Clusters](https://github.com/Aalto-LeTech/CodeClusters)

Application to easily search and cluster code in programming courses.

[Model repository](https://github.com/Aalto-LeTech/CodeClustersModeling)

[Introduction video](https://www.youtube.com/watch?v=cffAIIIQNYw)

# How to install locally

Requires: Docker, DockerCompose, Node.js (preferably installed with nvm), pnpm installed globally

1. Start Solr & database: `docker-compose up -d postgres solr`
2. Migrate and seed db: `docker-compose up flyway_migration` or `./db.sh migrate`
3. Install packages: `pnpm i`
4. Copy environment variables: `cp packages/api/.env.example packages/api/.env cp packages/client/.env.example packages/client/.env`
5. Start api: `pnpm api`
6. Start client: `pnpm client`
7. Generate test submissions: `pnpm seed`
8. Install and start model server as per its instructions https://github.com/Aalto-LeTech/CodeClustersModeling If you change the port from 8500, change it accordingly in .envs
9. Go to http://localhost:8800/solr and click "Reindex" and then "Run and index metrics"
10. The app should be ready at http://localhost:8800 use one of the presets at the top to log in eg "Admin login"

If you make changes to the schemas and want to re-migrate, use `./db.sh reset && ./db.sh migrate` to recreate the tables.

For Solr, you can go to the admin panel http://localhost:8983/solr/#/ to execute queries directly for debugging.

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
9. Create Solr Docker volume folder with correct permissions: `mkdir -p ./vol/solr && sudo chown -R 8983:8983 ./vol/solr`
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
DB_PORT=5442
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
12. Start up the Docker Compose stack with Let's Encrypt (in codeclusters.cs.aalto.fi domain): `./scripts-prod.sh certbot`
13. Run the migrations: `./scripts-prod.sh migrate`
14. Run the seeding: `./scripts-prod.sh seed`
15. Run the test data generator: `./scripts-prod.sh testdata`
16. Create the Solr data: `./scripts-prod.sh data-import`
17. Go to the modeling repo: `cd ../CodeClustersModeling`
18. Create the environment variables:

```bash
cat > .modeling.env <<EOF
DB_HOST=172.17.0.1
DB_PORT=5442
DB_USER=code-clusters-app-user
DB_PASSWORD=<32 char postgres password>
DB_NAME=code_clusters_prod

SOLR_URL=http://172.17.0.1:8983
SOLR_CORE=submission-search
EOF
```

19. Build and launch the modeling server: `sudo docker-compose -f prod-docker-compose.yml up -d`
20. The app should be running at https://codeclusters.cs.aalto.fi/

## How to update the stacks in production

The scripts in `scripts-prod.sh` should contain the majority of scripts required to update a service in production. As of now, there isn't an automated CI to do this so you have it to do it by hand.

In general, to update a service like backend or frontend, use eg `./scripts-prod.sh update backend`

To run migrations to the Postgres, you can use the same `.scripts-prod.sh migrate` script. Incase you alter the schemas in some fashion that requires complete wipe out of the database, use `.scripts-prod.sh db-delete`

To delete the Solr data, use `./solr.sh delete`. Then remember to reindex the data and to run metrics from the React app.

There can and will be other errors that I might have fixed as one-off scripts but have forgotten what they were. Then Google is your friend. In general deleting the container alongside its volume and rebuilding it helps.
