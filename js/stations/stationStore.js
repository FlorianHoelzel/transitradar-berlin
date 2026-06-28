export const stationStore = {
    stations: []
};

export function setStations(stations) {
    stationStore.stations = stations;
}

export function getStations() {
    return stationStore.stations;
}