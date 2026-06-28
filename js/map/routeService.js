import { getTripDetails } from "../api/transportRestApi.js";
import { loadTripsFromLocalData } from "./localRouteRepository.js";

async function loadTripFromRemoteApi(tripId, lineName) {
    return await getTripDetails(tripId, lineName);
}

async function loadTripFromFallbackData(tripId) {
    const trips = await loadTripsFromLocalData();

    return trips[tripId] ?? null;
}

export async function loadTripDetails(tripId, lineName) {
    try {
        return await loadTripFromRemoteApi(tripId, lineName);
    } catch (apiError) {
        console.warn("Failed to load trip from API. Trying local fallback:", apiError);

        try {
            return await loadTripFromFallbackData(tripId);
        } catch (fallbackError) {
            console.error("Failed to load trip from local fallback:", fallbackError);
            return null;
        }
    }
}