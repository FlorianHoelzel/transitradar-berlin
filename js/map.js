import { getDepartures } from "./api.js";
import { createPopupContent, createDeparturesHtml } from "./popup.js";
import { activeFilters } from "./filters.js";

export const map = L.map("map").setView([52.52, 13.40], 12);

let popupRefreshInterval = null;

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO"
}).addTo(map);

const subwayIcon = L.divIcon({
    className: "station-marker subway-marker",
    html: "●",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});

const suburbanIcon = L.divIcon({
    className: "station-marker suburban-marker",
    html: "●",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});

const busIcon = L.divIcon({
    className: "station-marker bus-marker",
    html: "●",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6]
});

export const markers = {};

function getStationIcon(station) {
    const name = station.name.toLowerCase();

    if (name.startsWith("s+u ") || name.startsWith("s ")) {
        return suburbanIcon;
    }

    if (name.startsWith("u ")) {
        return subwayIcon;
    }

    return busIcon;
}

function shouldShowStation(station) {
    const zoom = map.getZoom();
    const name = station.name.toLowerCase();

    const isTrainStation =
        name.startsWith("s+u ") ||
        name.startsWith("s ") ||
        name.startsWith("u ");

    if (zoom < 14) {
        return isTrainStation;
    }

    return true;
}

function hasProduct(station, productName) {
    if (station.products?.[productName] === true) {
        return true;
    }

    return station.stops?.some(stop => {
        return stop.products?.[productName] === true;
    }) === true;
}

function matchesActiveStationFilter(station) {
    const name = station.name.toLowerCase();

    const isSuburban =
        name.startsWith("s ") ||
        name.startsWith("s+u ") ||
        hasProduct(station, "suburban");

    const isSubway =
        name.startsWith("u ") ||
        name.startsWith("s+u ") ||
        hasProduct(station, "subway");

    const isSurface =
        !name.startsWith("s ") &&
        !name.startsWith("u ") &&
        !name.startsWith("s+u ");

    if (isSuburban && activeFilters.stations.suburban) return true;
    if (isSubway && activeFilters.stations.subway) return true;
    if (isSurface && activeFilters.stations.surface) return true;

    return false;
}

function updateFade(departures) {
    if (!departures) return;

    const canScroll = departures.scrollHeight > departures.clientHeight;
    const atBottom =
        departures.scrollTop + departures.clientHeight >= departures.scrollHeight - 2;

    departures.classList.toggle("has-fade", canScroll && !atBottom);
}

function setupFade(popupElement) {
    const departures = popupElement?.querySelector(".departures");

    if (!departures) return;

    updateFade(departures);

    departures.onscroll = () => {
        updateFade(departures);
    };
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

    if (!departuresContainer) return;

    const currentScrollTop = departuresContainer.scrollTop;

    try {
        const departures = await getDepartures(station);
        const departuresHtml = createDeparturesHtml(departures);

        departuresContainer.innerHTML = departuresHtml;
        departuresContainer.scrollTop = currentScrollTop;

        setupFade(popupElement);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Abfahrten:", error);
        departuresContainer.innerHTML = "Abfahrten konnten nicht geladen werden.";
        setupFade(popupElement);
    }
}

function startPopupRefresh(marker, station) {
    stopPopupRefresh();

    popupRefreshInterval = setInterval(() => {
        refreshPopupDepartures(marker, station);
    }, 15000);
}

export function updateVisibleMarkers(stations) {
    const bounds = map.getBounds();

    Object.values(markers).forEach(marker => {
        map.removeLayer(marker);
    });

    Object.keys(markers).forEach(key => {
        delete markers[key];
    });

    const visibleStations = stations.filter(station => {
        return (
            bounds.contains(station.coordinates) &&
            shouldShowStation(station) &&
            matchesActiveStationFilter(station)
        );
    });

    visibleStations.slice(0, 200).forEach(station => {
        const marker = L.marker(station.coordinates, {
            icon: getStationIcon(station),
            zIndexOffset: 2000
        }).addTo(map);

        markers[station.name] = marker;

        marker.bindPopup(createPopupContent(station));

        marker.on("popupopen", async () => {
            stopPopupRefresh();

            await refreshPopupDepartures(marker, station);

            startPopupRefresh(marker, station);
        });

        marker.on("popupclose", () => {
            stopPopupRefresh();
        });
    });
}