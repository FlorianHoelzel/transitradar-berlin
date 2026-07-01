import { getVehicleMovements } from "../api/transportRestApi.js";
import { DEV_CONFIG } from "../config.js";
import { loadVehiclesFromLocalData } from "./localVehicleRepository.js";

async function loadVehicleMovementsFromRemoteApi(bounds, zoom) {
    return await getVehicleMovements(bounds, zoom);
}

async function loadVehicleMovementsFromFallbackData() {
    return await loadVehiclesFromLocalData();
}

export async function loadVehicleMovements(bounds, zoom) {
    if (DEV_CONFIG.useMockData) {
        console.log("Developer Mode: loading vehicles from local data.");
        return await loadVehicleMovementsFromFallbackData();
    }

    try {
        console.log("Loading vehicles from API.");
        return await loadVehicleMovementsFromRemoteApi(bounds, zoom);
    } catch (apiError) {
        console.warn("Failed to load live vehicles from VBB API:", apiError);
        return [];
    }
}
