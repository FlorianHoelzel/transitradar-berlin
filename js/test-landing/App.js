const cities = [
    {
        name: "Berlin",
        network: "VBB / BVG",
        status: "Live-Daten verfügbar",
        color: "berlin",
        image: "./assets/test-landing/berlin-neu.png",
        href: "./index.html",
        lines: [],
    },
    {
        name: "Hamburg",
        network: "HVV",
        status: "Geplant",
        color: "hamburg",
        image: "./assets/test-landing/hamburg-neu.png",
        href: "#planned",
        lines: [],
    },
];

function CityPortrait({ city, index }) {
    return React.createElement(
        "a",
        {
            className: `city-card city-card--${city.color}`,
            href: city.href,
            style: { "--delay": `${index * 110}ms` },
        },
        React.createElement(
            "span",
            { className: "city-orb", "aria-hidden": "true" },
            React.createElement("img", { src: city.image, alt: "" })
        ),
        React.createElement("strong", { className: "city-name" }, city.name),
        city.network && React.createElement("span", { className: "city-network" }, city.network),
        city.lines.length > 0 && React.createElement(
            "span",
            { className: "line-badges", "aria-label": `Verkehrsmittel in ${city.name}` },
            city.lines.map((line) => React.createElement("span", { key: line }, line))
        ),
        city.status && React.createElement(
            "span",
            { className: "city-status" },
            React.createElement("span", { className: "status-dot" }),
            city.status
        )
    );
}

function LandingPage() {
    return React.createElement(
        "main",
        { className: "app-shell" },
        React.createElement("div", { className: "background-city background-city--berlin", "aria-hidden": "true" }),
        React.createElement("div", { className: "animated-routes", "aria-hidden": "true" }),
        React.createElement(
            "section",
            { className: "city-picker" },
            React.createElement(
                "header",
                { className: "brand-row" },
                React.createElement("span", null, "TransitRadar")
            ),
            React.createElement(
                "div",
                { className: "hero-copy" },
                React.createElement("h1", null, "Wähle deine Stadt"),
                React.createElement("p", null, "Live-ÖPNV, Abfahrten und Fahrzeuge auf einer klaren Karte.")
            ),
            React.createElement(
                "div",
                { className: "city-grid", "aria-label": "Stadtauswahl" },
                cities.map((city, index) => React.createElement(CityPortrait, { key: city.name, city, index }))
            ),
            React.createElement(
                "div",
                { className: "coming-soon-card" },
                React.createElement("span", { "aria-hidden": "true" }, "✦"),
                React.createElement("strong", null, "more cities coming soon")
            )
        )
    );
}

ReactDOM.createRoot(document.getElementById("landing-root")).render(React.createElement(LandingPage));
