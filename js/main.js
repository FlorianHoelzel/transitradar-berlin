import { loadStationsFromApi } from "./api.js";
import { map, updateVisibleMarkers, setupLineFilters } from "./map.js";
import { setupSearch } from "./search.js";
import { updateVehicles } from "./vehicles.js";

let stations = [];

function getProductsFromStop(stop) {
    return stop.products || {};
}

async function loadStations() {
    const data = await loadStationsFromApi();

    console.log("Original API Stop:", data[0]);

    const rawStations = data
        .map(stop => {
            return {
                id: stop.id,
                name: stop.name,
                coordinates: [
                    stop.location.latitude,
                    stop.location.longitude
                ],
                products: getProductsFromStop(stop)
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
                products: {
                    subway: false,
                    suburban: false,
                    tram: false,
                    bus: false,
                    ferry: false,
                    express: false,
                    regional: false
                },
                stops: []
            };
        }

        groupedStations[station.name].stops.push({
            id: station.id,
            coordinates: station.coordinates,
            products: station.products
        });

        groupedStations[station.name].products.subway =
            groupedStations[station.name].products.subway || station.products.subway === true;

        groupedStations[station.name].products.suburban =
            groupedStations[station.name].products.suburban || station.products.suburban === true;

        groupedStations[station.name].products.tram =
            groupedStations[station.name].products.tram || station.products.tram === true;

        groupedStations[station.name].products.bus =
            groupedStations[station.name].products.bus || station.products.bus === true;

        groupedStations[station.name].products.ferry =
            groupedStations[station.name].products.ferry || station.products.ferry === true;

        groupedStations[station.name].products.express =
            groupedStations[station.name].products.express || station.products.express === true;

        groupedStations[station.name].products.regional =
            groupedStations[station.name].products.regional || station.products.regional === true;
    });

    stations = Object.values(groupedStations);

    console.log(
        "Alexanderplatz grouped:",
        stations.filter(station => station.name.includes("Alexanderplatz"))
    );

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