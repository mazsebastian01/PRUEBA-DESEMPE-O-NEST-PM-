# FleetCore API
Sebastian Maz - Clan Centurion NODEJS PM

FleetCore is a REST API for managing a vehicle fleet and its
maintenance. It is built with NestJS and TypeScript and uses PostgreSQL
to store data.

## What the project does

FleetCore helps manage:

-   **Users and authentication:** users can register and log in.
    Passwords are hashed with bcrypt, and protected routes use JWT
    authentication.
-   **Vehicles:** create, view, update, and deactivate vehicles.
-   **Mechanics:** manage mechanics and their active or inactive status.
-   **Workshops:** manage workshops and their active or inactive status.
-   **Maintenances:** schedule and track maintenance for vehicles,
    including the assigned mechanic and workshop, dates, mileage,
    status, work performed, and final cost.

## Main technologies

-   NestJS and TypeScript
-   PostgreSQL and TypeORM
-   JWT and bcrypt
-   Swagger for API documentation
-   Docker and Docker Compose
-   Vitest for automated tests

## Project modules

-   `auth`: registration, login, and authentication.
-   `users`: user management.
-   `vehicles`: vehicle management.
-   `mechanics`: mechanic management.
-   `workshops`: workshop management.
-   `maintenances`: maintenance scheduling and tracking.

## Run the project

### With Docker

Start the API and its services:

``` bash
docker compose up -d --build
```

Check the containers:

``` bash
docker compose ps
```

View API logs:

``` bash
docker compose logs -f api
```

The API is expected at `http://localhost:3000`.

### API documentation

Open Swagger at:

`http://localhost:3000/api-docs`

Use `POST /auth/login` to obtain a JWT, then authorize Swagger with the
token. Some endpoints may also require the `x-api-key` header.

## Environment variables

Create a local `.env` file from the example:

``` bash
cp .env.example .env
```

Configure the values required by the project, including the JWT secret
and PostgreSQL connection settings. Do not publish the real `.env` file
or its secrets.

## Database seed

The project includes a seed command for loading initial data:

``` bash
npm run seed
```

Use the test credentials configured by the seeder when logging in.

## Tests and build

Run the tests:

``` bash
npm test
```

Run tests with coverage:

``` bash
npm run test:cov
```

Build the project:

``` bash
npm run build
```

The project previously reached approximately 47.11% line coverage. Run
the coverage command to see the current result.

## Database backup

The repository includes `fleetcore_backup.sql`, a PostgreSQL database
backup. Check that it contains no sensitive information before sharing
it publicly.

## Important maintenance rules

The API validates maintenance data and resource assignments. Inactive
vehicles, mechanics, or workshops should not be assigned to new
maintenance. Maintenance records track their status and completion
details, including work performed, final cost, completion date, and
final mileage.

## Security

-   Passwords are hashed with bcrypt.
-   JWT authentication protects private routes.
-   Role-based access controls selected operations.
-   Configured endpoints can require an API key.
-   Keep secrets and real credentials out of version control.
