import { getVehicleMovements } from "../api/transportRestApi.js";

async function loadVehicleMovementsFromRemoteApi(bounds, zoom) {
    return await getVehicleMovements(bounds, zoom);
}

export async function loadVehicleMovements(bounds, zoom) {
    try {
        console.log("Loading vehicles from API.");
        return await loadVehicleMovementsFromRemoteApi(bounds, zoom);
    } catch (apiError) {
        console.warn("Failed to load live vehicles from VBB API:", apiError);
        return [];
    }
}
