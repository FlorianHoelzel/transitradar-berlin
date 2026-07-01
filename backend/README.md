# TransitRadar Backend

This backend keeps the small subset of the `transport.rest` contract used by the frontend and serves it from the local `gtfs-via-postgres` PostgreSQL/PostGIS database.

## Endpoints

- `GET /stops?results=1000`
- `GET /stops/:stopId/departures?results=20&duration=60`
- `GET /trips/:tripId?lineName=U8&polyline=true&stopovers=true`
- `GET /radar?north=52.55&south=52.50&east=13.45&west=13.35&results=300`
- `GET /health`

GTFS has planned schedule data only. The backend therefore returns `delay: 0` and approximates `/radar` from upcoming scheduled stop calls inside the requested bounds.

## Run

```powershell
docker compose up -d postgres
npm install
npm run backend
```

The default database settings match `docker-compose.yaml`:

```text
PGHOST=localhost
PGPORT=5432
PGDATABASE=transitradar
PGUSER=transitradar
PGPASSWORD=transitradar
```

If the SQL dump is already imported on the server, skip this step. Otherwise import it before starting the backend:

```powershell
docker compose exec -T postgres psql -U transitradar -d transitradar -f /import.sql
```

When using Docker for the import, mount the SQL file into the `postgres` service first or run `psql` from the host with the same connection settings.
