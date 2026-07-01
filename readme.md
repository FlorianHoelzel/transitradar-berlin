# 🚆 TransitRadar

**A modern public transport experience.**

TransitRadar is a fast, modern and interactive web application for exploring public transport in real time. It combines live departures, vehicle positions, route information and an intuitive map interface into one clean experience.

The project is built with scalability in mind. While the current focus is on Berlin, TransitRadar is designed to support multiple cities through official public transport APIs.

> ⚠️ TransitRadar is currently under active development.

---

# ✨ Features

## 🗺️ Interactive Map

- Interactive map powered by Leaflet
- Live vehicle positions
- Smooth vehicle animations
- Zoom-dependent station rendering
- Station clustering & performance optimizations

## 🚉 Stations

- Search for stations
- Nearby stations
- Station popups
- Favorite stations *(coming soon)*

## ⏱️ Live Departures

- Real-time departures
- Delay information
- Platform information
- Countdown timers
- Automatic refresh

## 🚆 Routes

- Route visualization
- Next stopovers
- Line information
- Vehicle tracking

## 🎨 Modern UI

- Responsive layout
- Dark mode
- Glassmorphism-inspired design
- Fast and lightweight

## ⚙️ Planned

- Favorite stations
- Favorite lines
- Locate Me
- Offline cache
- Multiple cities
- Improved settings
- Better route visualization
- More personalization

---

# 🏙️ Planned Cities

TransitRadar is designed around a modular adapter architecture.

Adding a new city should only require implementing a new API adapter while the rest of the application remains unchanged.

| Region | Status |
|---------|--------|
| 🇩🇪 Berlin (VBB) | 🚧 In Development |
| 🚇 Hamburg (HVV) | 📅 Planned |
| 🚈 Frankfurt (RMV) | 📅 Planned |
| 🚋 Cologne (VRS) | 📅 Planned |
| 🚉 Rhine-Ruhr (VRR) | 📅 Planned |
| 🚊 Hanover (GVH) | 📅 Planned |
| 🚇 Stuttgart (VVS) | 📅 Planned |
| 🚍 Bremen (VBN) | 📅 Planned |
| 🚇 Munich (MVV) | ⏳ Planned (API availability pending) |

---

# 🛠️ Tech Stack

- HTML
- CSS
- JavaScript (ES Modules)
- Leaflet.js

### APIs

TransitRadar aims to use official public transport APIs whenever possible.

Examples include:

- VBB
- HVV Geofox
- RMV
- VRS
- VRR
- GVH
- and more...

---


# ⚠️ Disclaimer

TransitRadar is an independent project and is **not affiliated with or endorsed by any public transport operator or transport association**.

While every effort is made to provide accurate information, real-time data may occasionally be delayed, unavailable or inaccurate due to API limitations or outages.

For official travel information, please refer to the respective transport operator or transport association.

---

# ❤️ Contributing

Contributions, ideas and feedback are always welcome.

Feel free to open an issue or submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.