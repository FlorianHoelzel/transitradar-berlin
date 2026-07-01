import { getDepartures } from "../api/transportRestApi.js";

export async function loadDeparturesForStation(station) {
    try {
        return await getDepartures(station);
    } catch (apiError) {
        console.warn("Failed to load departures from VBB API:", apiError);
        return [];
    }
}
