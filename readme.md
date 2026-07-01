# TransitRadar

TransitRadar is a web app for watching public transport move in real time. It shows nearby stations, live departures, vehicles, and route previews on an interactive map.

The app currently starts with the VBB network. More cities and transport regions are planned, with the goal of making TransitRadar useful beyond one default area.

This is still a personal learning and portfolio project, but the core experience is already usable: open the map, search for a station, check upcoming departures, follow vehicles, and save the stations you care about.

## What You Can Do

- Search for stations and jump to them on the map
- See live departures, delays, and destinations
- Open station popups with automatically refreshed departure data
- View live vehicle positions on the map
- Filter stations and vehicles by transport type
- Preview the route of a selected trip
- Save favorite stations for quicker access
- Use your current location to find nearby stations
- Check whether the live data source is currently reachable

TransitRadar currently supports S-Bahn, U-Bahn, bus, tram, regional rail, and long-distance rail categories where the data is available.

## Data

TransitRadar uses the VBB Transport REST API:

```text
https://v6.vbb.transport.rest
```

The app uses this data for stations, departures, vehicle positions, trip details, and route shapes.

Live public transport data is not always perfect. Vehicles can be delayed, positions can be estimated, and some information may be missing or temporarily unavailable. TransitRadar is an independent project and is not affiliated with VBB, Deutsche Bahn, or any transport operator.

## Current State

The project is frontend-only and runs in the browser. Favorites are saved locally on the user's device, and there is no account system or backend yet.

The main app already includes:

- A dark interactive map
- Live station and departure views
- Live vehicle markers
- Route previews
- Favorites
- Nearby stations
- A sidebar for quick access
- Basic mobile-friendly styling

Some parts are still experimental and will continue to change as the project grows.

## Planned Next Steps

The next focus is making the app easier to use, more reliable, and less tied to one region.

- Add support for more cities and transport networks
- Make the default region configurable
- Improve the mobile layout
- Make errors and loading states clearer
- Improve accessibility and keyboard navigation
- Show more useful trip details, such as stop sequences and platforms where available
- Add disruption and service notice information
- Add route history or recently viewed trips
- Improve favorite and nearby station views
- Explore PWA support for an app-like experience

## Technology

TransitRadar is built with:

- HTML
- CSS
- JavaScript modules
- Leaflet
- VBB Transport REST API
- Browser geolocation
- Browser local storage

There is currently no build step.

## Running Locally

Serve the project with a small local web server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project Structure

```text
.
|-- index.html
|-- style.css
|-- readme.md
|-- assets/
|-- js/
|   |-- api/
|   |-- favorites/
|   |-- lines/
|   |-- map/
|   |-- stations/
|   |-- ui/
|   `-- vehicles/
|-- styles/
`-- tools/
```

## Why This Project Exists

TransitRadar is a way to practice building a real, data-driven frontend without hiding the complexity behind a framework. It combines maps, live API data, UI state, browser features, and responsive design in one project.

## License

This project is intended for educational and portfolio use.
