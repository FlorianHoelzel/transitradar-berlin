const API_BASE = "https://v6.bvg.transport.rest";
const stationTypeCache = {};

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

    return allDepartures
        .filter(departure => departure.when)
        .sort((a, b) => new Date(a.when) - new Date(b.when));
}

export async function getDepartures(station) {
    const departures = await fetchDeparturesForStation(station, 5, 20);
    return departures.slice(0, 8);
}

function countLines(departures) {
    const counts = {
        subway: 0,
        suburban: 0,
        tram: 0,
        bus: 0
    };

    departures.forEach(departure => {
        const line = departure.line;
        const name = line?.name || "";
        const product = line?.product || "";

        if (product === "subway" || name.startsWith("U")) {
            counts.subway++;
            return;
        }

        if (product === "suburban" || name.startsWith("S")) {
            counts.suburban++;
            return;
        }

        if (product === "tram") {
            counts.tram++;
            return;
        }

        if (product === "bus") {
            counts.bus++;
            return;
        }
    });

    return counts;
}

export async function getStationType(station) {
    if (stationTypeCache[station.name]) {
        return stationTypeCache[station.name];
    }

    const departures = await fetchDeparturesForStation(station, 12, 90);
    const counts = countLines(departures);

    let type = "bus";
    let highestCount = counts.bus;

    if (counts.tram > highestCount) {
        type = "tram";
        highestCount = counts.tram;
    }

    if (counts.subway > highestCount) {
        type = "subway";
        highestCount = counts.subway;
    }

    if (counts.suburban > highestCount) {
        type = "suburban";
        highestCount = counts.suburban;
    }

    stationTypeCache[station.name] = type;
    return type;
}