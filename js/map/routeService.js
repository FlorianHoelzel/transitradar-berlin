import { getTripDetails } from "../api/transportRestApi.js";

async function loadTripFromRemoteApi(tripId, lineName) {
    return await getTripDetails(tripId, lineName);
}

export async function loadTripDetails(tripId, lineName) {
    try {
        console.log("Loading trip from API.");
        return await loadTripFromRemoteApi(tripId, lineName);
    } catch (apiError) {
        console.warn("Failed to load trip from VBB API:", apiError);
        return null;
    }
}
