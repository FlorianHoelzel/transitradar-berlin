# 🚇 TransitRadar Berlin

TransitRadar Berlin is a modern web application for exploring Berlin's public transportation network in real time. Built with Leaflet.js and the BVG Transport REST API, it combines live station departures, animated vehicles, interactive route previews, and a clean dark user interface.

## Features

### 🗺️ Interactive Map

* Interactive map powered by Leaflet.js
* Dark theme using CARTO Dark Matter
* Smooth map navigation and zooming
* Automatic loading of visible stations
* Station grouping by name

### 🚉 Stations

* Live station search with autocomplete
* S-Bahn, U-Bahn and Bus/Tram station markers
* Layer filters for station categories
* Live departure information
* Automatic popup refresh every 15 seconds
* Delay information with highlighted real-time updates
* Clickable departures to preview their complete route

### 🚍 Live Vehicles

* Real-time vehicle positions
* Smooth vehicle movement animation
* Vehicle layer filters:

  * S-Bahn
  * U-Bahn
  * Bus / Tram
  * Regional Rail (RE / RB / RJ / FEX)
  * Long-distance Rail (ICE / IC / EC)
* Highlight individual lines
* Selected line stays visible while zooming
* Live vehicle popups with upcoming stops

### 🛤️ Route Preview

* Display the complete route of a selected trip
* Route preview from:

  * Vehicle popups
  * Station departures
* Colored route based on official line colors
* Soft glow effect around routes
* One-click route removal via Route Preview control

### 🎨 User Interface

* Modern glassmorphism-inspired dark UI
* Floating search bar
* Floating layer settings panel
* Animated loading skeletons
* Responsive popups
* Line badges using official BVG colors

## Technologies

* HTML5
* CSS3
* JavaScript (ES Modules)
* Leaflet.js
* BVG Transport REST API

## Project Structure

```text
.
├─ index.html
├─ style.css
├─ README.md
└─ js/
   ├─ api.js
   ├─ badges.js
   ├─ filters.js
   ├─ lineColors.js
   ├─ main.js
   ├─ map.js
   ├─ popup.js
   ├─ routeLayer.js
   ├─ search.js
   ├─ vehicleState.js
   ├─ vehicleUI.js
   ├─ vehicleUtils.js
   └─ vehicles.js
```

## Learning Goals

This project was created as part of my programming journey to improve my knowledge of:

* Modern JavaScript (ES Modules)
* Working with REST APIs
* Interactive web mapping
* Frontend architecture
* Asynchronous programming with `fetch()`
* Real-time data visualization
* Modular code organization
* UI/UX design for web applications

## Future Ideas

* Favorite stations
* Route history
* Live trip tracking
* Vehicle heading indicators
* Platform information
* Accessibility information
* Traffic disruptions
* Arrival notifications
* Mobile-first layout improvements

## AI Assistance

Parts of this project were developed with the assistance of AI tools such as ChatGPT. The generated code was reviewed, adapted, and integrated as part of the learning process.

## License

This project is intended for educational and portfolio purposes.
