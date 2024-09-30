# How to setup

To install all dependencies, run

```
npm install
```

or

```
yarn install
```

## Migration and seeding

Run `npx prisma gnerate`

Run `npm run migrate:dev --name <migration-name>` to migrate to database

We're initializing our database with a few tables with 4 seats each.

Run `npm run seed` to seed the database with the Tables

## Run in development mode

Run `npm run dev` to run the server on port 3000.
Once server starts running, the docs for the API will also be available on http://localhost:3000/api-docs

## Run in production mode

Run `docker-compose up --build`
