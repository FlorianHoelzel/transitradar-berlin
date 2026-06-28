export const map = L.map("map", {
    zoomControl: false
}).setView([52.52, 13.40], 12);

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO"
}).addTo(map);