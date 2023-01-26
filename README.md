# UIII-LMS

### Installation

UIII-LMS requires [Node.js](https://nodejs.org/) v14+ to run.

Copy ```.env.example``` file into ```.env``` and change database information.

Install the dependencies and devDependencies and start the server.

```sh
cd uiii-lms
yarn install
yarn dev
```

For production environments...

```sh
yarn install --production
NODE_ENV=production node app
```

### Migration

copy ```database.example.json``` file into ```database.json``` and change database information into it. Then run example migration below.
> change ```migration-information``` to what you want to create. example ```alter-table-user-add-address-info```

```sh
node_modules/db-migrate/bin/db-migrate create migration-information --sql-file
```

```migration-information``` is name of file we will use.
this command will create 3 file with timestamp in front of the name for 2 sql file ```up``` and ```down``` inside folder ```migrations/sqls``` and 1 js (```javascript```) file inside folder ```migrations```
> Note: ignore created ```javascript``` and ```sql down``` file. just copy sql syntax into ```sql up``` file