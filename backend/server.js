import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    getDeparturesForStop,
    getRadarMovements,
    getStops,
    getTrip
} from "./gtfs.js";
import { assertDatabaseConnection } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const projectRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
);

app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        response.status(204).end();
        return;
    }

    next();
});

app.get("/health", async (_request, response, next) => {
    try {
        await assertDatabaseConnection();
        response.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

app.get("/stops", async (request, response, next) => {
    try {
        response.json(await getStops(request.query));
    } catch (error) {
        next(error);
    }
});

app.get("/stops/:stopId/departures", async (request, response, next) => {
    try {
        response.json({
            departures: await getDeparturesForStop(
                request.params.stopId,
                request.query
            )
        });
    } catch (error) {
        next(error);
    }
});

app.get("/trips/:tripId", async (request, response, next) => {
    try {
        const trip = await getTrip(request.params.tripId, request.query);

        if (!trip) {
            response.status(404).json({ error: "Trip not found." });
            return;
        }

        response.json(trip);
    } catch (error) {
        next(error);
    }
});

app.get("/radar", async (request, response, next) => {
    try {
        const { north, south, east, west } = request.query;

        if (!north || !south || !east || !west) {
            response.status(400).json({
                error: "north, south, east and west query parameters are required."
            });
            return;
        }

        response.json(await getRadarMovements(request.query));
    } catch (error) {
        next(error);
    }
});

app.use(express.static(projectRoot));

app.get("/", (_request, response) => {
    response.sendFile(path.join(projectRoot, "index.html"));
});

app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({
        error: "Internal server error."
    });
});

app.listen(port, () => {
    console.log(`TransitRadar backend listening on http://localhost:${port}`);
});
