import { loadStationsFromApi } from "../api/transportRestApi.js";

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

export async function loadStations() {
    const data = await loadStationsFromApi();

    const rawStations = data
        .map(normalizeStop)
        .filter(isBerlinAreaStation);

    return groupStationsByName(rawStations);
}