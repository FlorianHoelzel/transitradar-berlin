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

function formatTime(dateString) {
    if (!dateString) return "?";

    return new Date(dateString).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function createTimeHtml(departure) {
    const plannedTime = formatTime(departure.plannedWhen);
    const realtime = formatTime(departure.when || departure.plannedWhen);
    const delay = departure.delay ?? 0;

    if (delay > 0) {
        const delayMinutes = Math.round(delay / 60);
        const delayClass = delay >= 300 ? "delay-large" : "delay-small";

        return `
            <div class="departure-time-wrapper">
                <div class="departure-times">
                    <span class="planned-time">${plannedTime}</span>
                    <span class="realtime">${realtime}</span>
                </div>

                <div class="delay ${delayClass}">
                    +${delayMinutes}
                </div>
            </div>
        `;
    }

    return `
        <div class="departure-time-wrapper">
            <div class="departure-times">
                <span class="realtime">${realtime}</span>
            </div>
        </div>
    `;
}

export function createPopupContent(station, content = createSkeletonHtml()) {
    return `
        <div class="station-popup">
            <div class="station-title">${station.name}</div>

            <div class="departures-wrapper">
                <div class="departures">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

export function createDeparturesHtml(departures) {
    if (departures.length === 0) {
        return "<div class='empty-departures'>Keine Abfahrten gefunden.</div>";
    }

    return departures.map(departure => {
        const lineName = departure.line?.name || "";
        const tripId = departure.tripId || "";
        const line = createLineBadge(lineName);
        const direction = departure.direction || "Unbekannt";
        const timeHtml = createTimeHtml(departure);

        return `
            <div
                class="departure-row clickable-departure"
                data-trip-id="${tripId}"
                data-line-name="${lineName}"
            >
                <div class="departure-top">
                    ${line}
                    ${timeHtml}
                </div>

                <div class="departure-direction">
                    ${direction}
                </div>
            </div>
        `;
    }).join("");
}