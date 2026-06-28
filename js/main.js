import { loadStationsFromApi } from "./api/transportRestApi.js";
import { map, updateVisibleMarkers, stopPopupRefresh } from "./map.js";
import { setupSearch } from "./search.js";
import { updateVehicles } from "./vehicles/vehicleController.js";
import { setupFilters } from "./filters.js";
import { setupSidebar } from "./sidebar.js";
import { vehicleState } from "./vehicles/vehicleState.js";

let stations = [];

function isBerlinAreaStation(station) {
    const [lat, lng] = station.coordinates;

    return lat >= 52.33 && lat <= 52.70 &&
           lng >= 13.05 && lng <= 13.80;
}

function normalizeStop(stop) {
    return {
        id: stop.id,
        name: stop.name,
        coordinates: [
            stop.location.latitude,
            stop.location.longitude
        ],
        products: stop.products || {}
    };
}

function createEmptyProducts() {
    return {
        subway: false,
        suburban: false,
        tram: false,
        bus: false,
        ferry: false,
        express: false,
        regional: false
    };
}

function mergeProducts(targetProducts, sourceProducts) {
    Object.keys(targetProducts).forEach(product => {
        targetProducts[product] =
            targetProducts[product] || sourceProducts[product] === true;
    });
}

function groupStationsByName(rawStations) {
    const groupedStations = {};

    rawStations.forEach(station => {
        if (!groupedStations[station.name]) {
            groupedStations[station.name] = {
                name: station.name,
                coordinates: station.coordinates,
                products: createEmptyProducts(),
                stops: []
            };
        }

        groupedStations[station.name].stops.push({
            id: station.id,
            coordinates: station.coordinates,
            products: station.products
        });

        mergeProducts(groupedStations[station.name].products, station.products);
    });

    return Object.values(groupedStations);
}

async function loadStations() {
    try {
        const data = await loadStationsFromApi();

        const rawStations = data
            .map(normalizeStop)
            .filter(isBerlinAreaStation);

        stations = groupStationsByName(rawStations);

        updateVisibleMarkers(stations);
        setupSearch(stations);
    } catch (error) {
        console.error("Fehler beim Laden der Haltestellen:", error);
    }
}

function setupUi() {
    setupSidebar();

    setupFilters(() => {
        stopPopupRefresh();
        updateVisibleMarkers(stations);
        updateVehicles(true);
    });
}

function setupMapEvents() {
    map.on("moveend", () => {
        updateVisibleMarkers(stations);
        updateVehicles(true);
    });
}

function setupVehicleRefresh() {
    updateVehicles(true);

    setInterval(() => {
        updateVehicles();
    }, vehicleState.refreshInterval);
}

function initApp() {
    setupUi();
    setupMapEvents();
    setupVehicleRefresh();
    loadStations();
}

initApp();