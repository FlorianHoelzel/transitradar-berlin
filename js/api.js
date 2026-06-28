const BVG_API_BASE = "https://v6.bvg.transport.rest";
const VBB_API_BASE = "https://v6.vbb.transport.rest";

function getCleanStopId(stopId) {
    const parts = String(stopId).split(":");

    if (parts.length >= 3) {
        return parts[2];
    }

    return stopId;
}

function getRadarResultLimit(zoom) {
    if (zoom >= 16) {
        return 1000;
    }

    if (zoom >= 15) {
        return 600;
    }

    return 300;
}

async function fetchJson(url, errorMessage) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return await response.json();
}

function removeDuplicateDepartures(departures) {
    return departures.filter((departure, index, array) => {
        const key = `${departure.line?.name}-${departure.direction}-${departure.when}`;

        return index === array.findIndex(item => {
            const itemKey = `${item.line?.name}-${item.direction}-${item.when}`;
            return itemKey === key;
        });
    });
}

async function fetchDeparturesForStop(stopId, results, duration) {
    const cleanStopId = getCleanStopId(stopId);

    const url =
        `${BVG_API_BASE}/stops/${cleanStopId}/departures` +
        `?results=${results}` +
        `&duration=${duration}`;

    try {
        const data = await fetchJson(
            url,
            "Departures konnten nicht geladen werden."
        );

        if (Array.isArray(data)) {
            return data;
        }

        return data.departures ?? [];
    } catch (error) {
        console.warn(`Departures für Stop ${cleanStopId} konnten nicht geladen werden:`, error);
        return [];
    }
}

async function fetchDeparturesForStation(station, results = 8, duration = 30) {
    const allDepartures = [];

    const uniqueStopIds = [
        ...new Set(station.stops.map(stop => stop.id))
    ];

    for (const stopId of uniqueStopIds) {
        const departures = await fetchDeparturesForStop(stopId, results, duration);
        allDepartures.push(...departures);
    }

    const uniqueDepartures = removeDuplicateDepartures(allDepartures);

    return uniqueDepartures
        .filter(departure => departure.when)
        .sort((a, b) => new Date(a.when) - new Date(b.when));
}

export async function loadStationsFromApi() {
    return await fetchJson(
        `${BVG_API_BASE}/stops?results=1000`,
        "Stations konnten nicht geladen werden."
    );
}

export async function getDepartures(station) {
    const departures = await fetchDeparturesForStation(station, 20, 60);

    return departures.slice(0, 12);
}

export async function getVehicleMovements(bounds, zoom) {
    const results = getRadarResultLimit(zoom);

    const url =
        `${VBB_API_BASE}/radar` +
        `?north=${bounds.getNorth()}` +
        `&south=${bounds.getSouth()}` +
        `&east=${bounds.getEast()}` +
        `&west=${bounds.getWest()}` +
        `&results=${results}` +
        `&polylines=false` +
        `&frames=1`;

    const data = await fetchJson(
        url,
        "Live-Fahrzeuge konnten nicht geladen werden."
    );

    return data.movements ?? [];
}

export async function getTripDetails(tripId, lineName) {
    const url =
        `${BVG_API_BASE}/trips/${encodeURIComponent(tripId)}` +
        `?lineName=${encodeURIComponent(lineName)}` +
        `&polyline=true` +
        `&stopovers=true` +
        `&remarks=false`;

    return await fetchJson(
        url,
        "Trip route could not be loaded."
    );
}