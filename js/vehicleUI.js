import { createLineBadge } from "./badges.js";
import { vehicleMarkers, vehicleState } from "./vehicleState.js";
import { cleanStopName, getLineColor } from "./vehicleUtils.js";

export function createVehicleStopsHtml(stopovers, lineColor) {
    return (stopovers || [])
        .slice(0, 5)
        .map((stopover, index, array) => {
            const name = cleanStopName(
                stopover.stop?.name ||
                stopover.name ||
                ""
            );

            const last = index === array.length - 1;

            return `
                <div class="vehicle-stop ${last ? "last" : ""}">
                    <div
                        class="vehicle-stop-icon"
                        style="--line-color: ${lineColor};"
                    ></div>
                    <div class="vehicle-stop-name">${name}</div>
                </div>
            `;
        })
        .join("");
}

export function createVehicleIcon(movement) {
    const lineName = movement.line?.name || "?";
    const badge = createLineBadge(lineName);

    let highlightClass = "";

    if (vehicleState.selectedLineName) {
        highlightClass = lineName === vehicleState.selectedLineName
            ? "vehicle-selected"
            : "vehicle-dimmed";
    }

    return L.divIcon({
        className: `vehicle-marker ${highlightClass}`,
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

export function createVehiclePopup(movement) {
    const lineName = movement.line?.name || "?";
    const lineColor = getLineColor(lineName);
    const nextStops = createVehicleStopsHtml(movement.nextStopovers, lineColor);
    const isSelected = vehicleState.selectedLineName === lineName;

    return `
        <div class="vehicle-popup">
            <div class="vehicle-popup-line">
                ${createLineBadge(lineName)}
            </div>

            <div class="vehicle-popup-direction">
                Richtung ${cleanStopName(movement.direction) || "Unbekannt"}
            </div>

            <button class="vehicle-line-button">
                ${isSelected ? "Line selected" : `Highlight ${lineName}`}
            </button>

            ${
                nextStops
                    ? `
                        <div class="vehicle-popup-title">
                            Nächste Haltestellen
                        </div>

                        <div class="vehicle-stops">
                            ${nextStops}
                        </div>
                    `
                    : ""
            }
        </div>
    `;
}

export function updateVehicleMarkerStyles() {
    Object.values(vehicleMarkers).forEach(marker => {
        const movement = marker.transitMovement;

        if (!movement) return;

        marker.setIcon(createVehicleIcon(movement));
        marker.setPopupContent(createVehiclePopup(movement));
    });
}

export function createSelectedLineControl(onClear) {
    if (vehicleState.selectedLineControl) {
        return;
    }

    vehicleState.selectedLineControl = document.createElement("div");
    vehicleState.selectedLineControl.className = "selected-line-control";
    vehicleState.selectedLineControl.innerHTML = `
        <div class="selected-line-label"></div>
        <button class="selected-line-clear">Clear</button>
    `;

    document.body.appendChild(vehicleState.selectedLineControl);

    vehicleState.selectedLineControl
        .querySelector(".selected-line-clear")
        .addEventListener("click", onClear);
}

export function updateSelectedLineControl(onClear) {
    createSelectedLineControl(onClear);

    if (!vehicleState.selectedLineName) {
        vehicleState.selectedLineControl.classList.remove("visible");
        return;
    }

    vehicleState.selectedLineControl
        .querySelector(".selected-line-label")
        .innerHTML = `
            <span>Selected line</span>
            ${createLineBadge(vehicleState.selectedLineName)}
        `;

    vehicleState.selectedLineControl.classList.add("visible");
}