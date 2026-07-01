# TransitRadar

TransitRadar is a browser-based public transport radar for exploring live transit data on an interactive map. It uses Leaflet for mapping and the VBB Transport REST API for stations, departures, trip details, routes, and vehicle movements.

The project is currently a frontend-only learning and portfolio project. It runs directly in the browser, keeps user data locally, and focuses on making live public transport data easier to search, filter, inspect, and follow.

## Current Status

TransitRadar already includes the main building blocks of a real-time transit map:

- Interactive Leaflet map with a dark CARTO basemap
- Station loading from the VBB API
- Station markers that appear based on map position and zoom level
- Station grouping and popup rendering
- Station search with autocomplete-style results
- Live departures for selected stations
- Departure delay display and realtime highlighting
- Automatic departure refresh while a station popup is open
- Clickable departures that can open a route preview
- Live vehicle positions from the VBB radar endpoint
- Smooth vehicle marker updates and movement animation
- Vehicle popups with line, direction, and stop information
- Trip route previews loaded from trip details
- Colored route rendering with a highlighted route layer
- One-click route preview removal
- Filters for station and vehicle categories
- Line badges and line color helpers
- API status indicator with periodic health checks
- User location button using browser geolocation
- Nearby station panel based on the user's current position
- Favorite stations stored in local storage
- Favorite station panel with live departure previews
- Sidebar with nearby stations, favorites, and project information
- Responsive styling for smaller screens

## Transport Modes

The UI currently distinguishes these transport categories:

- S-Bahn
- U-Bahn
- Bus and tram
- Regional rail, including RE, RB, RJ, and FEX-style services
- Long-distance rail, including ICE, IC, and EC-style services

## Data Source

TransitRadar uses the VBB Transport REST API:

```text
https://v6.vbb.transport.rest
```

The app currently calls these kinds of endpoints:

- `stations` for station data
- `stops/{id}/departures` for station departures
- `radar` for live vehicle movements
- `trips/{id}` for trip details, stopovers, and route polylines

Live transit data can be incomplete, delayed, temporarily unavailable, or different from official operator apps. TransitRadar is an independent project and is not affiliated with VBB, Deutsche Bahn, or any other transport operator.

## Technology

- HTML5
- CSS3
- JavaScript with ES modules
- Leaflet.js
- VBB Transport REST API
- Browser geolocation API
- Browser local storage

No build step is required at the moment.

## Project Structure

```text
.
|-- index.html
|-- style.css
|-- readme.md
|-- assets/
|   `-- fonts/
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

## Running Locally

Because the project uses ES modules, it should be served through a local web server instead of being opened directly from the file system.

One simple option:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## What Still Needs Work

The app is functional, but still a prototype. Important next steps include:

- Remove remaining hard-coded regional assumptions from configuration and helper code
- Make the map region configurable
- Improve mobile layout and touch ergonomics
- Add stronger loading, empty, and error states
- Improve accessibility for controls, popups, and keyboard navigation
- Add better route history and recently viewed trips
- Add optional arrival or departure notifications
- Add disruption, warning, and remark handling
- Improve vehicle heading and movement direction display
- Add platform and accessibility information where the API provides it
- Add user settings for refresh intervals and enabled transport modes
- Add automated tests for API normalization and UI state helpers
- Add a backend or proxy only if rate limiting, caching, or API protection becomes necessary
- Clean up old experimental landing page assets if they are no longer needed

## Roadmap

### Short Term

- Rename remaining UI copy to the neutral TransitRadar brand
- Review all VBB API calls and normalize fallback behavior
- Improve the sidebar panels for favorites and nearby stations
- Polish responsive CSS for phones and tablets
- Add clearer API error messages in the UI

### Medium Term

- Introduce a region configuration system
- Support multiple map presets
- Add route history and saved trips
- Improve route previews with stop sequence details
- Add disruption and remark rendering
- Add basic automated tests

### Long Term

- Make TransitRadar usable beyond the current default map area
- Add user-configurable data layers
- Add installable PWA behavior
- Add offline-friendly cached station metadata
- Explore server-side caching if API limits or performance require it

## Learning Goals

This project is also a practical learning project for:

- Modern JavaScript modules
- Working with REST APIs
- Async data loading with `fetch`
- Interactive maps
- Realtime data visualization
- State management without a framework
- UI architecture in plain JavaScript
- Responsive frontend design

## License

This project is intended for educational and portfolio use.
