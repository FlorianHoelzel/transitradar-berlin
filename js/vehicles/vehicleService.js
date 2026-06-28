import { getVehicleMovements } from "../api/transportRestApi.js";

export async function loadVehicleMovements(bounds, zoom) {
    return await getVehicleMovements(bounds, zoom);
}