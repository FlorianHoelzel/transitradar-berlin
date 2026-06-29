import { createLineBadge } from "../lines/badges.js";
import { isFavoriteStation } from "../favorites/favoriteService.js";

function createSkeletonHtml() {
    return `
        <div class="popup-skeleton-card"></div>
        <div class="popup-skeleton-card"></div>
        <div class="popup-skeleton-card"></div>
    `;
}

function formatTime(dateString) {
    if (!dateString) {
        return "?";
    }

    return new Date(dateString).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getRelativeTimeText(dateString) {
    if (!dateString) {
        return "";
    }

    const minutes = Math.round(
        (new Date(dateString).getTime() - Date.now()) / 60000
    );

    if (minutes <= 0) {
        return "departing now";
    }

    if (minutes === 1) {
        return "in 1 min";
    }

    return `in ${minutes} min`;
}

function createTimeHtml(departure) {
    const plannedTime = formatTime(departure.plannedWhen);
    const realtime = formatTime(departure.when || departure.plannedWhen);
    const delay = departure.delay ?? 0;

    if (delay <= 0) {
        return `
            <div class="popup-departure-time-block">
                <span class="popup-realtime">${realtime}</span>
            </div>
        `;
    }

    const delayMinutes = Math.round(delay / 60);
    const delayClass = delay >= 300 ? "delay-large" : "delay-small";

    return `
        <div class="popup-departure-time-block">
            <div class="popup-departure-times">
                <span class="popup-planned-time">${plannedTime}</span>
                <span class="popup-realtime">${realtime}</span>
            </div>

            <span class="popup-delay ${delayClass}">
                +${delayMinutes}
            </span>
        </div>
    `;
}

function getStationSubtitle(station) {
    const products = station.products || {};

    const activeProducts = Object.entries(products)
        .filter(([, isActive]) => isActive)
        .map(([product]) => product);

    if (activeProducts.length === 0) {
        return "Live departures";
    }

    return activeProducts
        .map(product => {
            if (product === "subway") return "Subway";
            if (product === "suburban") return "S-Bahn";
            if (product === "tram") return "Tram";
            if (product === "bus") return "Bus";
            if (product === "regional") return "Regional";

            return product;
        })
        .join(" • ");
}

export function createPopupContent(station, content = createSkeletonHtml()) {
    const isFavorite = isFavoriteStation(station);
    const favoriteIcon = isFavorite ? "★" : "☆";
    const favoriteClass = isFavorite ? "active" : "";

    return `
        <div class="station-popup station-popup-v2">
            <div class="station-popup-header">
                <div class="station-popup-title-group">
                    <div class="station-title">${station.name}</div>
                    <div class="station-subtitle">${getStationSubtitle(station)}</div>
                </div>

                <button
                    class="station-favorite-button ${favoriteClass}"
                    type="button"
                    title="Toggle favorite"
                >
                    ${favoriteIcon}
                </button>
            </div>

            <div class="departures-wrapper station-departures-wrapper">
                <div class="departures station-departures">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

export function createDeparturesHtml(departures) {
    if (departures.length === 0) {
        return "<div class='empty-departures'>No departures found.</div>";
    }

    return departures.map(departure => {
        const lineName = departure.line?.name || "";
        const tripId = departure.tripId || "";
        const direction = departure.direction || "Unknown direction";
        const relativeTime = getRelativeTimeText(
            departure.when || departure.plannedWhen
        );

        return `
            <div
                class="popup-departure-card clickable-departure"
                data-trip-id="${tripId}"
                data-line-name="${lineName}"
            >
                <div class="popup-departure-surface">
                    <div class="popup-departure-left">
                        ${createLineBadge(lineName)}
                    </div>

                    <div class="popup-departure-center">
                        <div class="popup-departure-direction">
                            ${direction}
                        </div>

                        <div class="popup-departure-relative">
                            ${relativeTime}
                        </div>
                    </div>

                    <div class="popup-departure-right">
                        ${createTimeHtml(departure)}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}