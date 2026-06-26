import { map } from "./map.js";
import { getBadgeStyle } from "./lineColors.js";
import { activeFilters } from "./filters.js";
import { vehicleState } from "./vehicleState.js";

export function getRadarBounds() {
    return map.getBounds();
}

export function getVehicleType(movement) {
    const lineName = movement.line?.name || "";

    if (
        lineName.startsWith("ICE") ||
        lineName.startsWith("IC") ||
        lineName.startsWith("EC")
    ) {
        return "longDistance";
    }

    if (
        lineName.startsWith("RE") ||
        lineName.startsWith("RB") ||
        lineName.startsWith("RJ") ||
        lineName === "FEX"
    ) {
        return "regional";
    }

    if (lineName.startsWith("S")) {
        return "suburban";
    }

    if (lineName.startsWith("U")) {
        return "subway";
    }

    if (
        lineName.startsWith("M") ||
        lineName.startsWith("X") ||
        lineName.startsWith("N") ||
        /^\d+$/.test(lineName)
    ) {
        return "surface";
    }

    return "surface";
}

export function shouldShowVehicle(movement) {
    const lineName = movement.line?.name || "";

    if (vehicleState.selectedLineName) {
        return lineName === vehicleState.selectedLineName;
    }

    const zoom = map.getZoom();
    const vehicleType = getVehicleType(movement);

    if (!activeFilters.vehicles[vehicleType]) {
        return false;
    }

    if (zoom < 14) {
        return false;
    }

    if (zoom === 14) {
        return (
            vehicleType === "suburban" ||
            vehicleType === "subway" ||
            vehicleType === "regional" ||
            vehicleType === "longDistance"
        );
    }

    return true;
}

export function cleanStopName(name) {
    return (name || "")
        .replace(/^S\+U\s+/i, "")
        .replace(/^U\s+/i, "")
        .replace(/^S\s+/i, "")
        .replace(/\s+\(Berlin\)$/i, "");
}

export function getLineColor(lineName) {
    const style = getBadgeStyle(lineName);

    if (lineName.startsWith("M")) {
        return "#C0007A";
    }

    if (lineName.startsWith("X")) {
        return "#F39200";
    }

    if (/^\d+$/.test(lineName)) {
        return "#6B7280";
    }

    if (style.background && style.background !== "#fff") {
        return style.background;
    }

    return "#6B7280";
}

export function animateMarker(marker, target) {
    const start = marker.getLatLng();

    const startLat = start.lat;
    const startLng = start.lng;
    const endLat = target[0];
    const endLng = target[1];

    const duration = 14500;
    const startTime = performance.now();

    function animate(now) {
        const progress = Math.min((now - startTime) / duration, 1);

        marker.setLatLng([
            startLat + (endLat - startLat) * progress,
            startLng + (endLng - startLng) * progress
        ]);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}