import { getDepartures } from "../api/transportRestApi.js";
import { DEV_CONFIG } from "../config.js";
import { loadDeparturesFromLocalData } from "./localDepartureRepository.js";

function getStationStopIds(station) {
    if (station.id) {
        return [station.id];
    }

    if (Array.isArray(station.stops)) {
        return station.stops
            .map(stop => stop.id)
            .filter(Boolean);
    }

    return [];
}

function getLocalDeparturesForStation(departuresByStationId, station) {
    const stopIds = getStationStopIds(station);

    return stopIds
        .flatMap(stopId => departuresByStationId[stopId] ?? [])
        .sort((a, b) => new Date(a.when) - new Date(b.when));
}

async function loadDeparturesFromFallbackData(station) {
    const departuresByStationId = await loadDeparturesFromLocalData();

    return getLocalDeparturesForStation(departuresByStationId, station);
}

export async function loadDeparturesForStation(station) {
    if (DEV_CONFIG.useMockData) {
        console.log("Developer Mode: loading departures from local data.");
        return await loadDeparturesFromFallbackData(station);
    }

    try {
        return await getDepartures(station);
    } catch (apiError) {
        console.warn("Failed to load departures from API. Trying local fallback:", apiError);

        try {
            return await loadDeparturesFromFallbackData(station);
        } catch (fallbackError) {
            console.error("Failed to load departures from local fallback:", fallbackError);
            return [];
        }
    }
}