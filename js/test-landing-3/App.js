const cities = [
    {
        name: "Berlin",
        network: "VBB",
        href: "./index.html",
        state: "Open the map",
        signal: "ready",
        accent: "#f2c94c",
        code: "01",
        meta: "A loud pocket atlas with live vehicles inside.",
    },
    {
        name: "Hamburg",
        network: "HVV",
        href: "#hamburg",
        state: "Paste drying",
        signal: "soon",
        accent: "#ef5350",
        code: "02",
        meta: "Harbor routes, stickered and waiting.",
    },
    {
        name: "Munich",
        network: "MVV",
        href: "#munich",
        state: "Folded for later",
        signal: "soon",
        accent: "#62c370",
        code: "03",
        meta: "Ring lines tucked into the next edition.",
    },
];

const scraps = [
    "ticket confetti",
    "platform gossip",
    "folded maps",
    "tiny departures",
];

const stats = [
    { label: "live city", value: "1" },
    { label: "paper cuts", value: "0" },
    { label: "planned stops", value: "many" },
];

function StatusStamp({ city }) {
    return React.createElement(
        "span",
        { className: `status-stamp status-stamp--${city.signal}` },
        React.createElement("span", { "aria-hidden": "true" }),
        city.state
    );
}

function CityTicket({ city, index }) {
    return React.createElement(
        "a",
        {
            className: "city-ticket",
            href: city.href,
            style: { "--accent": city.accent, "--delay": `${index * 110}ms` },
            "aria-label": `${city.name}, ${city.network}, ${city.state}`,
        },
        React.createElement("span", { className: "ticket-number", "aria-hidden": "true" }, city.code),
        React.createElement(
            "span",
            { className: "ticket-main" },
            React.createElement("strong", null, city.name),
            React.createElement("span", null, city.network)
        ),
        React.createElement(StatusStamp, { city }),
        React.createElement("span", { className: "ticket-note" }, city.meta)
    );
}

function ScrapTicker() {
    return React.createElement(
        "div",
        { className: "scrap-ticker", "aria-label": "TransitRadar notes" },
        scraps.map((scrap, index) =>
            React.createElement(
                "span",
                { key: scrap, style: { "--delay": `${index * 1.2}s` } },
                scrap
            )
        )
    );
}

function PocketStats() {
    return React.createElement(
        "div",
        { className: "pocket-stats", "aria-label": "Landing page stats" },
        stats.map((stat) =>
            React.createElement(
                "span",
                { key: stat.label },
                React.createElement("strong", null, stat.value),
                React.createElement("small", null, stat.label)
            )
        )
    );
}

function LandingPage() {
    return React.createElement(
        "main",
        { className: "paper-shell" },
        React.createElement("img", {
            className: "paper-backdrop",
            src: "./assets/test-landing-3/paper-city.png",
            alt: "",
            "aria-hidden": "true",
        }),
        React.createElement("div", { className: "paper-noise", "aria-hidden": "true" }),
        React.createElement("div", { className: "cutout cutout--yellow", "aria-hidden": "true" }),
        React.createElement("div", { className: "cutout cutout--blue", "aria-hidden": "true" }),
        React.createElement(
            "nav",
            { className: "paper-nav", "aria-label": "TransitRadar" },
            React.createElement("a", { className: "wordmark", href: "./index.html" }, "TransitRadar"),
            React.createElement(
                "div",
                { className: "nav-tabs" },
                React.createElement("a", { href: "./test-landing.html" }, "Test 1"),
                React.createElement("a", { href: "./test-landing-2.html" }, "Test 2"),
                React.createElement("a", { href: "./index.html" }, "Open map")
            )
        ),
        React.createElement(
            "section",
            { className: "poster-hero" },
            React.createElement(
                "div",
                { className: "hero-copy" },
                React.createElement("p", { className: "eyebrow" }, "Pocket atlas / public transport mischief"),
                React.createElement("h1", null, "A city map that refuses to sit still."),
                React.createElement(
                    "p",
                    { className: "intro" },
                    "TransitRadar turns stations, departures and vehicles into a living street poster you can actually use."
                ),
                React.createElement(
                    "div",
                    { className: "hero-actions" },
                    React.createElement("a", { className: "primary-action", href: "./index.html" }, "Enter Berlin"),
                    React.createElement("a", { className: "secondary-action", href: "#city-launchpad" }, "Pick a ticket")
                )
            ),
            React.createElement(
                "aside",
                { className: "pasteboard", "aria-label": "Edition notes" },
                React.createElement("p", { className: "panel-kicker" }, "Field edition"),
                React.createElement("strong", null, "No. 03"),
                React.createElement("span", null, "maps, departures, vehicles, tiny civic drama"),
                React.createElement(PocketStats, null)
            )
        ),
        React.createElement(ScrapTicker, null),
        React.createElement(
            "section",
            { className: "city-launchpad", id: "city-launchpad", "aria-label": "Stadtauswahl" },
            React.createElement(
                "header",
                { className: "section-heading" },
                React.createElement("p", null, "Choose your paper route"),
                React.createElement("h2", null, "Tickets to the next city mess.")
            ),
            React.createElement(
                "div",
                { className: "ticket-grid" },
                cities.map((city, index) => React.createElement(CityTicket, { key: city.name, city, index }))
            )
        )
    );
}

ReactDOM.createRoot(document.getElementById("landing-root")).render(React.createElement(LandingPage));
