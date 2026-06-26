const API_BASE = "https://v6.bvg.transport.rest";

export async function loadStationsFromApi() {
    const response = await fetch(`${API_BASE}/stops?results=1000`);

    if (!response.ok) {
        throw new Error("Stations konnten nicht geladen werden.");
    }

    return await response.json();
}

function getCleanStopId(stopId) {
    const parts = stopId.split(":");

    if (parts.length >= 3) {
        return parts[2];
    }

    return stopId;
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

async function fetchDeparturesForStation(station, results = 8, duration = 30) {
    const allDepartures = [];

    const uniqueStopIds = [
        ...new Set(station.stops.map(stop => getCleanStopId(stop.id)))
    ];

    for (const stopId of uniqueStopIds) {
        const response = await fetch(
            `${API_BASE}/stops/${stopId}/departures?results=${results}&duration=${duration}`
        );

        if (!response.ok) {
            continue;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            allDepartures.push(...data);
        } else if (data.departures) {
            allDepartures.push(...data.departures);
        }
    }

    const uniqueDepartures = removeDuplicateDepartures(allDepartures);

    return uniqueDepartures
        .filter(departure => departure.when)
        .sort((a, b) => new Date(a.when) - new Date(b.when));
}

export async function getDepartures(station) {
    const departures = await fetchDeparturesForStation(station, 20, 60);

    return departures.slice(0, 12);
}

export async function getVehicleMovements(bounds) {
    const url =
        `${API_BASE}/radar` +
        `?north=${bounds.getNorth()}` +
        `&south=${bounds.getSouth()}` +
        `&east=${bounds.getEast()}` +
        `&west=${bounds.getWest()}` +
        `&results=1000`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Live-Fahrzeuge konnten nicht geladen werden.");
    }

    const data = await response.json();

    return data.movements ?? [];
}

export async function getTripDetails(tripId, lineName) {
    const url =
        `${API_BASE}/trips/${encodeURIComponent(tripId)}` +
        `?lineName=${encodeURIComponent(lineName)}` +
        `&polyline=true` +
        `&remarks=false`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Trip route could not be loaded.");
    }

    return await response.json();
}