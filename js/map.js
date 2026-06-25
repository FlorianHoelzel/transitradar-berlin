import { getDepartures } from "./api.js";
import { createPopupContent, createDeparturesHtml } from "./popup.js";

export const map = L.map("map").setView([52.52, 13.40], 12);

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

function updateFade(departures) {
    if (!departures) return;

    const canScroll = departures.scrollHeight > departures.clientHeight;
    const atBottom =
        departures.scrollTop + departures.clientHeight >= departures.scrollHeight - 2;

    departures.classList.toggle("has-fade", canScroll && !atBottom);
}

function setupFade(popupElement) {
    const departures = popupElement.querySelector(".departures");

    if (!departures) return;

    updateFade(departures);

    departures.onscroll = () => {
        updateFade(departures);
    };
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
        return bounds.contains(station.coordinates) && shouldShowStation(station);
    });

    visibleStations.slice(0, 200).forEach(station => {
        const marker = L.marker(station.coordinates, {
            icon: getStationIcon(station),
            zIndexOffset: 2000
        }).addTo(map);

        markers[station.name] = marker;

        marker.bindPopup(createPopupContent(station));

        marker.on("popupopen", async () => {
            const popupElement = marker.getPopup().getElement();
            const departuresContainer = popupElement.querySelector(".departures");

            setupFade(popupElement);

            try {
                const departures = await getDepartures(station);
                const departuresHtml = createDeparturesHtml(departures);

                departuresContainer.innerHTML = departuresHtml;

                setupFade(popupElement);
            } catch (error) {
                console.error("Fehler beim Laden der Abfahrten:", error);

                departuresContainer.innerHTML = "Abfahrten konnten nicht geladen werden.";

                setupFade(popupElement);
            }
        });
    });
}