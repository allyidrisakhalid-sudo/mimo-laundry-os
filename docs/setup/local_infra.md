# Local Infrastructure

## Services

Chapter 3.1 provisions the local development backbone with Docker Compose.

### Postgres

- Service name: `postgres`
- Container name: `mimo-postgres`
- Image: `postgres:16-alpine`
- Host port: `POSTGRES_PORT` from `.env`
- Container port: `5432`
- Persistence: named volume `mimo_postgres_data`

### Redis

- Service name: `redis`
- Container name: `mimo-redis`
- Image: `redis:7-alpine`
- Host port: `REDIS_PORT` from `.env`
- Container port: `6379`

## Files

- `compose.yaml` local infrastructure definition
- `.env.example` committed template with local defaults
- `.env` local uncommitted values for this machine

## Start

`docker compose up -d`

## Stop

`docker compose stop`

## Start after stop

`docker compose start`

## Full shutdown

`docker compose down`

## Verify

`docker compose ps`
`docker compose exec postgres psql -U mimo -d mimo_laundry_os -c "select current_database() as db_name, current_user as db_user;"`
`docker compose exec redis redis-cli ping`

## Persistence check

`docker compose exec postgres psql -U mimo -d mimo_laundry_os -c "create table if not exists chapter_3_1_persistence_check(id int primary key, note text not null);"`
`docker compose exec postgres psql -U mimo -d mimo_laundry_os -c "insert into chapter_3_1_persistence_check(id, note) values (1, 'persisted') on conflict (id) do update set note = excluded.note;"`
`docker compose exec postgres psql -U mimo -d mimo_laundry_os -c "table chapter_3_1_persistence_check;"`
`docker compose restart postgres redis`
`docker compose exec postgres psql -U mimo -d mimo_laundry_os -c "table chapter_3_1_persistence_check;"`

## Safe local DB reset

This destroys local Postgres data. Run only when you intentionally want a clean local database.

`docker compose down -v --remove-orphans`
`docker compose up -d`

## Ports

- Postgres: `localhost:5432`
- Redis: `localhost:6379`

## Volumes

- `mimo_postgres_data` persistent Postgres database storage
