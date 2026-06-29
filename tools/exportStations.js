const fs = require("fs/promises");
const path = require("path");

const stations = require("vbb-stations");
const linesAt = require("vbb-lines-at");

const DATA_DIR = path.join(__dirname, "..", "data");
const OUTPUT_FILE = path.join(DATA_DIR, "stations.json");

const BERLIN_BOUNDS = {
    minLat: 52.33,
    maxLat: 52.70,
    minLng: 13.05,
    maxLng: 13.80
};

function hasValidLocation(station) {
    return (
        station.location &&
        typeof station.location.latitude === "number" &&
        typeof station.location.longitude === "number"
    );
}

function isInsideBerlinBounds(station) {
    const latitude = station.location.latitude;
    const longitude = station.location.longitude;

    return (
        latitude >= BERLIN_BOUNDS.minLat &&
        latitude <= BERLIN_BOUNDS.maxLat &&
        longitude >= BERLIN_BOUNDS.minLng &&
        longitude <= BERLIN_BOUNDS.maxLng
    );
}

function sortLines(lines) {
    return [...new Set(lines)]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "de-DE", { numeric: true }));
}

function createProductsFromLines(lines) {
    return {
        subway: lines.some(line => line.product === "subway"),
        suburban: lines.some(line => line.product === "suburban"),
        tram: lines.some(line => line.product === "tram"),
        bus: lines.some(line => line.product === "bus"),
        ferry: lines.some(line => line.product === "ferry"),
        express: lines.some(line => line.product === "express"),
        regional: lines.some(line => line.product === "regional")
    };
}

function normalizeStation(station) {
    const stationLines = linesAt[station.id] || [];
    const lineNames = sortLines(stationLines.map(line => line.name));

    return {
        id: station.id,
        name: station.name,
        location: {
            latitude: station.location.latitude,
            longitude: station.location.longitude
        },
        products: {
            ...(station.products || {}),
            ...createProductsFromLines(stationLines)
        },
        lines: lineNames
    };
}

async function exportStations() {
    const allStations = stations("all");

    const berlinStations = allStations
        .filter(hasValidLocation)
        .filter(isInsideBerlinBounds)
        .map(normalizeStation);

    await fs.writeFile(
        OUTPUT_FILE,
        JSON.stringify(berlinStations, null, 4),
        "utf8"
    );

    console.log(`Saved ${berlinStations.length} stations to data/stations.json`);
}

exportStations().catch(error => {
    console.error("Failed to export stations:", error);
});