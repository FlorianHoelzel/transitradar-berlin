import { getTripDetails } from "./api.js";
import { map } from "./map.js";
import { getLineColor } from "./vehicleUtils.js";

let activeRouteLayer = null;

function extractRouteCoordinates(polyline) {
    if (!polyline) {
        return [];
    }

    if (polyline.type === "FeatureCollection") {
        return polyline.features
            .flatMap(feature => extractRouteCoordinates(feature))
            .filter(Boolean);
    }

    if (polyline.type === "Feature") {
        return extractRouteCoordinates(polyline.geometry);
    }

    if (polyline.type === "LineString") {
        return polyline.coordinates.map(coordinate => {
            return [coordinate[1], coordinate[0]];
        });
    }

    if (polyline.type === "MultiLineString") {
        return polyline.coordinates
            .flat()
            .map(coordinate => {
                return [coordinate[1], coordinate[0]];
            });
    }

    if (polyline.type === "Point") {
        return [[polyline.coordinates[1], polyline.coordinates[0]]];
    }

    return [];
}

export function clearRouteLayer() {
    if (!activeRouteLayer) {
        return;
    }

    map.removeLayer(activeRouteLayer);
    activeRouteLayer = null;
}

export async function showRouteForTrip(tripId, lineName) {
    clearRouteLayer();

    if (!tripId || !lineName) {
        return;
    }

    try {
        const data = await getTripDetails(tripId, lineName);
        const polyline = data.trip?.polyline || data.polyline;
        const coordinates = extractRouteCoordinates(polyline);

        if (coordinates.length < 2) {
            console.warn("No route coordinates found.");
            return;
        }

        activeRouteLayer = L.polyline(coordinates, {
            color: getLineColor(lineName),
            weight: 7,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
            interactive: false
        }).addTo(map);

        activeRouteLayer.bringToFront();

    } catch (error) {
        console.error("Route could not be displayed:", error);
    }
}