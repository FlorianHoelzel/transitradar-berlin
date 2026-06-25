import { getVehicleMovements } from "./api.js";
import { map } from "./map.js";
import { createLineBadge } from "./badges.js";

const vehicleMarkers = {};

function clearVehicleMarkers() {
    Object.values(vehicleMarkers).forEach(marker => {
        map.removeLayer(marker);
    });

    Object.keys(vehicleMarkers).forEach(key => {
        delete vehicleMarkers[key];
    });
}

function shouldShowVehicle(movement) {
    const zoom = map.getZoom();
    const lineName = movement.line?.name || "";

    if (zoom < 13) {
        return false;
    }

    if (zoom < 15) {
        return (
            lineName.startsWith("S") ||
            lineName.startsWith("U") ||
            lineName.startsWith("RE") ||
            lineName.startsWith("RB") ||
            lineName === "FEX"
        );
    }

    return true;
}

function createVehicleIcon(movement) {
    const lineName = movement.line?.name || "?";
    const badge = createLineBadge(lineName);

    return L.divIcon({
        className: "vehicle-marker",
        html: `
            <div class="vehicle-badge">
                ${badge}
            </div>
        `,
        iconSize: [44, 28],
        iconAnchor: [22, 14],
        popupAnchor: [0, -14]
    });
}

export async function updateVehicles() {
    if (map.getZoom() < 13) {
        clearVehicleMarkers();
        return;
    }

    try {
        const movements = await getVehicleMovements(map.getBounds());
        const visibleVehicleIds = new Set();

        movements.forEach(movement => {
            if (!movement.location) return;
            if (!shouldShowVehicle(movement)) return;

            const id = movement.tripId;
            visibleVehicleIds.add(id);

            const coordinates = [
                movement.location.latitude,
                movement.location.longitude
            ];

            if (vehicleMarkers[id]) {
                vehicleMarkers[id].setLatLng(coordinates);
                return;
            }

            const marker = L.marker(coordinates, {
                icon: createVehicleIcon(movement),
                zIndexOffset: 500
            }).addTo(map);

            marker.bindPopup(`
                <strong>${movement.line?.name || "?"}</strong><br>
                Richtung: ${movement.direction || "Unbekannt"}
            `);

            vehicleMarkers[id] = marker;
        });

        Object.keys(vehicleMarkers).forEach(id => {
            if (!visibleVehicleIds.has(id)) {
                map.removeLayer(vehicleMarkers[id]);
                delete vehicleMarkers[id];
            }
        });

    } catch (error) {
        console.error(error);
    }
}