import { getVehicleMovements } from "../api.js";

export async function loadVehicleMovements(bounds, zoom) {
    return await getVehicleMovements(bounds, zoom);
}