import { showRouteForTrip, clearRouteLayer } from "../routeLayer.js";
import { map } from "../map.js";

import { vehicleState } from "./vehicleState.js";
import { loadVehicleMovements } from "./vehicleService.js";
import {
    updateVehicleMarkerStyles,
    updateSelectedLineControl
} from "./vehicleUI.js";
import {
    clearVehicleMarkers,
    renderVehicleMovements
} from "./vehicleRenderer.js";

export { clearVehicleMarkers };

export function clearSelectedLine() {
    vehicleState.selectedLineName = null;
    clearRouteLayer();

    updateVehicleMarkerStyles();

    updateSelectedLineControl(() => {
        clearSelectedLine();
        updateVehicles(true);
    });
}

function selectLineFromMovement(movement) {
    const lineName = movement.line?.name;

    if (!lineName) {
        return;
    }

    if (vehicleState.selectedLineName === lineName) {
        clearSelectedLine();
        return;
    }

    vehicleState.selectedLineName = lineName;

    showRouteForTrip(movement.tripId, lineName).then(() => {
        updateVehicleMarkerStyles();
    });

    updateVehicleMarkerStyles();

    updateSelectedLineControl(() => {
        clearSelectedLine();
        updateVehicles(true);
    });

    updateVehicles(true);
}

export async function updateVehicles(force = false) {
    const zoom = map.getZoom();

    if (zoom < 14 && !vehicleState.selectedLineName) {
        clearVehicleMarkers();
        return;
    }

    const now = Date.now();

    if (vehicleState.updateRunning) {
        return;
    }

    if (!force && now - vehicleState.lastUpdate < vehicleState.minimumUpdateInterval) {
        return;
    }

    vehicleState.updateRunning = true;
    vehicleState.lastUpdate = now;

    try {
        const bounds = map.getBounds();
        const movements = await loadVehicleMovements(bounds, zoom);

        renderVehicleMovements(movements, selectLineFromMovement, zoom);
    } catch (error) {
        console.error("Fehler beim Laden der Fahrzeuge:", error);
    } finally {
        vehicleState.updateRunning = false;
    }
}