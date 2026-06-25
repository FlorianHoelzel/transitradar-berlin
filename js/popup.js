import { createLineBadge } from "./badges.js";

function createSkeletonHtml() {
    return `
        <div class="skeleton-row">
            <div class="skeleton-badge"></div>
            <div class="skeleton-time"></div>
            <div class="skeleton-direction"></div>
        </div>

        <div class="skeleton-row">
            <div class="skeleton-badge"></div>
            <div class="skeleton-time"></div>
            <div class="skeleton-direction"></div>
        </div>

        <div class="skeleton-row">
            <div class="skeleton-badge"></div>
            <div class="skeleton-time"></div>
            <div class="skeleton-direction"></div>
        </div>
    `;
}

export function createPopupContent(station, content = createSkeletonHtml()) {
    return `
        <div class="station-popup">
            <div class="station-title">${station.name}</div>
            <div class="departures">
                ${content}
            </div>
        </div>
    `;
}

export function createDeparturesHtml(departures) {
    if (departures.length === 0) {
        return "<div class='empty-departures'>Keine Abfahrten gefunden.</div>";
    }

    return departures.map(departure => {
        const line = createLineBadge(departure.line?.name);
        const direction = departure.direction || "Unbekannt";
        const time = departure.when
            ? new Date(departure.when).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit"
            })
            : "?";

        return `
            <div class="departure-row">
                <div class="departure-top">
                    ${line}
                    <span class="departure-time">${time}</span>
                </div>

                <div class="departure-direction">
                    ${direction}
                </div>
            </div>
        `;
    }).join("");
}