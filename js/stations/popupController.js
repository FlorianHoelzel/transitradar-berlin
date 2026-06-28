import { showRouteForTrip } from "../map/routeLayer.js";
import { DEPARTURE_CONFIG } from "../config.js";
import { createDeparturesHtml } from "./stationPopup.js";
import { loadDeparturesForStation } from "./departureService.js";
import {
    toggleFavorite,
    isFavoriteStation,
    onFavoritesChanged,
    offFavoritesChanged
} from "../favorites/favoriteService.js";

let popupRefreshInterval = null;
let favoriteChangeHandler = null;

function updateFade(departures) {
    if (!departures) {
        return;
    }

    const canScroll = departures.scrollHeight > departures.clientHeight;
    const atBottom =
        departures.scrollTop + departures.clientHeight >= departures.scrollHeight - 2;

    departures.classList.toggle("has-fade", canScroll && !atBottom);
}

function setupFade(popupElement) {
    const departures = popupElement?.querySelector(".departures");

    if (!departures) {
        return;
    }

    updateFade(departures);

    departures.onscroll = () => {
        updateFade(departures);
    };
}

function setupDepartureRouteClicks(popupElement) {
    const departureRows = popupElement?.querySelectorAll(".clickable-departure");

    if (!departureRows) {
        return;
    }

    departureRows.forEach(row => {
        row.addEventListener("click", () => {
            const tripId = row.dataset.tripId;
            const lineName = row.dataset.lineName;

            if (!tripId || !lineName) {
                return;
            }

            showRouteForTrip(tripId, lineName, {
                showControl: true
            });
        });
    });
}

function updateFavoriteButtonState(favoriteButton, station) {
    favoriteButton.textContent = isFavoriteStation(station) ? "★" : "☆";
}

function removeFavoriteChangeHandler() {
    if (!favoriteChangeHandler) {
        return;
    }

    offFavoritesChanged(favoriteChangeHandler);
    favoriteChangeHandler = null;
}

function setupFavoriteButton(popupElement, station) {
    const favoriteButton = popupElement?.querySelector(".station-favorite-button");

    console.log("Favorite button:", favoriteButton, station);

    if (!favoriteButton) {
        return;
    }

    removeFavoriteChangeHandler();
    updateFavoriteButtonState(favoriteButton, station);

    favoriteButton.onclick = event => {
        event.preventDefault();
        event.stopPropagation();

        console.log("Favorite clicked:", station);

        toggleFavorite(station);
        updateFavoriteButtonState(favoriteButton, station);
    };

    favoriteChangeHandler = () => {
        updateFavoriteButtonState(favoriteButton, station);
    };

    onFavoritesChanged(favoriteChangeHandler);
}

export function stopPopupRefresh() {
    if (popupRefreshInterval) {
        clearInterval(popupRefreshInterval);
        popupRefreshInterval = null;
    }
}

async function refreshPopupDepartures(marker, station) {
    const popupElement = marker.getPopup()?.getElement();
    const departuresContainer = popupElement?.querySelector(".departures");

    if (!departuresContainer) {
        return;
    }

    const currentScrollTop = departuresContainer.scrollTop;

    try {
        const departures = await loadDeparturesForStation(station);
        const departuresHtml = createDeparturesHtml(departures);

        departuresContainer.innerHTML = departuresHtml;
        departuresContainer.scrollTop = currentScrollTop;

        setupDepartureRouteClicks(popupElement);
        setupFade(popupElement);
    } catch (error) {
        console.error("Failed to update departures:", error);
        departuresContainer.innerHTML = "Departures could not be loaded.";
        setupFade(popupElement);
    }
}

function startPopupRefresh(marker, station) {
    stopPopupRefresh();

    popupRefreshInterval = setInterval(() => {
        refreshPopupDepartures(marker, station);
    }, DEPARTURE_CONFIG.popupRefreshInterval);
}

export async function handleStationPopupOpen(marker, station) {
    stopPopupRefresh();

    setTimeout(() => {
        const popupElement = marker.getPopup()?.getElement();
        setupFavoriteButton(popupElement, station);
    }, 0);

    await refreshPopupDepartures(marker, station);

    startPopupRefresh(marker, station);
}

export function handleStationPopupClose() {
    stopPopupRefresh();
    removeFavoriteChangeHandler();
}