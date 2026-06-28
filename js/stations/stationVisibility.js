import {
    shouldShowStation,
    matchesActiveStationFilter
} from "./stationUtils.js";

export function getVisibleStations(stations, bounds, zoom, limit = 200) {
    return stations
        .filter(station => {
            return (
                bounds.contains(station.coordinates) &&
                shouldShowStation(station, zoom) &&
                matchesActiveStationFilter(station)
            );
        })
        .slice(0, limit);
}