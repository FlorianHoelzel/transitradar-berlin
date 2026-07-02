const cities = [
    {
        name: "Berlin",
        network: "VBB / BVG",
        href: "./index.html",
        status: "Live",
        state: "ready",
        accent: "#38bdf8",
        detail: "Stations, vehicles and departures are online now.",
        count: "1,482",
    },
    {
        name: "Hamburg",
        network: "HVV",
        href: "#hamburg",
        status: "Soon",
        state: "soon",
        accent: "#f59e0b",
        detail: "Harbor routes are queued for the next rollout.",
        count: "612",
    },
    {
        name: "Munich",
        network: "MVV",
        href: "#munich",
        status: "Soon",
        state: "soon",
        accent: "#22c55e",
        detail: "Ring lines and trunk routes are being mapped.",
        count: "738",
    },
];

const departures = [
    { line: "S7", color: "#7dd3fc", destination: "Ahrensfelde", time: "2 min" },
    { line: "U8", color: "#60a5fa", destination: "Hermannstrasse", time: "4 min" },
    { line: "M10", color: "#facc15", destination: "Warschauer Str.", time: "7 min" },
];

function TopBar() {
    return React.createElement(
        "nav",
        { className: "topbar", "aria-label": "TransitRadar" },
        React.createElement("a", { className: "brand", href: "./index.html" },
            React.createElement("span", { className: "brand-mark", "aria-hidden": "true" }),
            "TransitRadar"
        ),
        React.createElement(
            "div",
            { className: "topbar-actions" },
            React.createElement("a", { href: "./test-landing-2.html" }, "Test 2"),
            React.createElement("a", { href: "./test-landing-3.html" }, "Test 3"),
            React.createElement("a", { className: "map-link", href: "./index.html" }, "Open map")
        )
    );
}

function SearchPreview() {
    return React.createElement(
        "div",
        { className: "search-preview", "aria-label": "Search preview" },
        React.createElement("span", { className: "search-icon", "aria-hidden": "true" }),
        React.createElement("span", null, "Search station..."),
        React.createElement("strong", null, "Berlin")
    );
}

function FilterDock() {
    return React.createElement(
        "aside",
        { className: "filter-dock", "aria-label": "Map filters preview" },
        React.createElement("button", { type: "button" }, "S-Bahn"),
        React.createElement("button", { type: "button" }, "U-Bahn"),
        React.createElement("button", { type: "button" }, "Bus / Tram"),
        React.createElement("button", { type: "button" }, "Live Vehicles")
    );
}

function DepartureStack() {
    return React.createElement(
        "div",
        { className: "departure-stack", "aria-label": "Live departures preview" },
        React.createElement("p", { className: "panel-kicker" }, "Alexanderplatz"),
        departures.map((departure) =>
            React.createElement(
                "span",
                { className: "departure-row", key: departure.line },
                React.createElement(
                    "strong",
                    { style: { "--line": departure.color } },
                    departure.line
                ),
                React.createElement("span", null, departure.destination),
                React.createElement("em", null, departure.time)
            )
        )
    );
}

function CityCard({ city, index }) {
    return React.createElement(
        "a",
        {
            className: `city-card city-card--${city.state}`,
            href: city.href,
            style: { "--accent": city.accent, "--delay": `${index * 95}ms` },
            "aria-label": `${city.name}, ${city.network}, ${city.status}`,
        },
        React.createElement(
            "span",
            { className: "city-card-top" },
            React.createElement("strong", null, city.name),
            React.createElement(
                "span",
                { className: "city-status" },
                React.createElement("span", { "aria-hidden": "true" }),
                city.status
            )
        ),
        React.createElement("span", { className: "city-network" }, city.network),
        React.createElement("span", { className: "city-detail" }, city.detail),
        React.createElement(
            "span",
            { className: "city-meta" },
            React.createElement("strong", null, city.count),
            " tracked points"
        )
    );
}

function MapStage() {
    return React.createElement(
        "section",
        { className: "map-stage", "aria-label": "TransitRadar live map preview" },
        React.createElement("div", { className: "map-grid", "aria-hidden": "true" }),
        React.createElement("div", { className: "route-line route-line--blue", "aria-hidden": "true" }),
        React.createElement("div", { className: "route-line route-line--yellow", "aria-hidden": "true" }),
        React.createElement("div", { className: "route-line route-line--green", "aria-hidden": "true" }),
        React.createElement("span", { className: "station station--one", "aria-hidden": "true" }),
        React.createElement("span", { className: "station station--two", "aria-hidden": "true" }),
        React.createElement("span", { className: "station station--three", "aria-hidden": "true" }),
        React.createElement(SearchPreview, null),
        React.createElement(DepartureStack, null),
        React.createElement(FilterDock, null)
    );
}

function LandingPage() {
    return React.createElement(
        "main",
        { className: "glass-shell" },
        React.createElement("div", { className: "ambient-map", "aria-hidden": "true" }),
        React.createElement(TopBar, null),
        React.createElement(
            "section",
            { className: "hero" },
            React.createElement(
                "div",
                { className: "hero-copy" },
                React.createElement("p", { className: "eyebrow" }, "Live public transport, city by city"),
                React.createElement("h1", null, "Choose your live transit radar."),
                React.createElement(
                    "p",
                    { className: "intro" },
                    "A sleek city launchpad for the same glassy map interface: search stations, filter layers and jump into real-time movement."
                ),
                React.createElement(
                    "div",
                    { className: "hero-actions" },
                    React.createElement("a", { className: "primary-action", href: "./index.html" }, "Enter Berlin"),
                    React.createElement("a", { className: "secondary-action", href: "#cities" }, "Browse cities")
                )
            ),
            React.createElement(MapStage, null)
        ),
        React.createElement(
            "section",
            { className: "city-section", id: "cities", "aria-label": "Stadtauswahl" },
            React.createElement(
                "header",
                { className: "section-heading" },
                React.createElement("p", null, "City access"),
                React.createElement("h2", null, "Start with Berlin, keep the interface ready for what comes next.")
            ),
            React.createElement(
                "div",
                { className: "city-grid" },
                cities.map((city, index) => React.createElement(CityCard, { key: city.name, city, index }))
            )
        )
    );
}

ReactDOM.createRoot(document.getElementById("landing-root")).render(React.createElement(LandingPage));
