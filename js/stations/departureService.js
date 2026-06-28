import { getDepartures } from "../api/transportRestApi.js";

export async function loadDeparturesForStation(station) {
    return await getDepartures(station);
}