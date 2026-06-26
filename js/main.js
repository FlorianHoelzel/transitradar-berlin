import { loadStationsFromApi } from "./api.js";
import { map, updateVisibleMarkers, setupLineFilters } from "./map.js";
import { setupSearch } from "./search.js";
import { updateVehicles } from "./vehicles.js";

let stations = [];

async function loadStations() {
    const data = await loadStationsFromApi();

    const rawStations = data
        .map(stop => {
            return {
                id: stop.id,
                name: stop.name,
                coordinates: [
                    stop.location.latitude,
                    stop.location.longitude
                ],
                products: stop.products || {}
            };
        })
        .filter(station => {
            const lat = station.coordinates[0];
            const lng = station.coordinates[1];

            return lat >= 52.33 && lat <= 52.70 &&
                   lng >= 13.05 && lng <= 13.80;
        });

    const groupedStations = {};

    rawStations.forEach(station => {
        if (!groupedStations[station.name]) {
            groupedStations[station.name] = {
                name: station.name,
                coordinates: station.coordinates,
                products: station.products,
                stops: []
            };
        }

        groupedStations[station.name].stops.push({
            id: station.id,
            coordinates: station.coordinates,
            products: station.products
        });

        groupedStations[station.name].products = {
            subway: groupedStations[station.name].products.subway || station.products.subway,
            suburban: groupedStations[station.name].products.suburban || station.products.suburban,
            tram: groupedStations[station.name].products.tram || station.products.tram,
            bus: groupedStations[station.name].products.bus || station.products.bus,
            ferry: groupedStations[station.name].products.ferry || station.products.ferry,
            express: groupedStations[station.name].products.express || station.products.express,
            regional: groupedStations[station.name].products.regional || station.products.regional
        };
    });

    stations = Object.values(groupedStations);

    updateVisibleMarkers(stations);
    setupSearch(stations);
    setupLineFilters(stations);
}

loadStations();

map.on("moveend", () => {
    updateVisibleMarkers(stations);
    updateVehicles();
});

updateVehicles();

setInterval(updateVehicles, 30000);