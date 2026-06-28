import { DEV_CONFIG } from "../config.js";
import { getDepartures } from "../api/transportRestApi.js";

export async function loadDeparturesForStation(station) {
    if (DEV_CONFIG.useMockData) {
        return [];
    }

    return await getDepartures(station);
}