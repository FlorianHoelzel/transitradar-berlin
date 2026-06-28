const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

const routes = [
    {
        id: "u1",
        line: "U1",
        product: "subway",
        direction: "Warschauer Straße",
        vehicles: 3,
        coordinates: [[13.3233, 52.4997], [13.3415, 52.4977], [13.3847, 52.4996], [13.4180, 52.4992], [13.4523, 52.5050]],
        stops: ["Uhlandstraße", "Wittenbergplatz", "Gleisdreieck", "Kottbusser Tor", "Warschauer Straße"]
    },
    {
        id: "u2",
        line: "U2",
        product: "subway",
        direction: "Pankow",
        vehicles: 4,
        coordinates: [[13.2501, 52.5257], [13.3075, 52.5096], [13.3760, 52.5096], [13.3903, 52.5124], [13.4132, 52.5219], [13.4127, 52.5321]],
        stops: ["Ruhleben", "Zoo", "Potsdamer Platz", "Stadtmitte", "Alexanderplatz", "Pankow"]
    },
    {
        id: "u5",
        line: "U5",
        product: "subway",
        direction: "Hönow",
        vehicles: 4,
        coordinates: [[13.3694, 52.5251], [13.3869, 52.5200], [13.4132, 52.5219], [13.4317, 52.5100], [13.5127, 52.4961], [13.6336, 52.5380]],
        stops: ["Hauptbahnhof", "Brandenburger Tor", "Alexanderplatz", "Frankfurter Tor", "Lichtenberg", "Hönow"]
    },
    {
        id: "u7",
        line: "U7",
        product: "subway",
        direction: "Rudow",
        vehicles: 4,
        coordinates: [[13.2937, 52.5667], [13.3274, 52.5115], [13.3427, 52.4966], [13.4180, 52.4992], [13.4477, 52.4670]],
        stops: ["Rathaus Spandau", "Bismarckstraße", "Yorckstraße", "Hermannplatz", "Rudow"]
    },
    {
        id: "u8",
        line: "U8",
        product: "subway",
        direction: "Hermannstraße",
        vehicles: 4,
        coordinates: [[13.3888, 52.5317], [13.4028, 52.5266], [13.4186, 52.5153], [13.4180, 52.4992], [13.4246, 52.4866]],
        stops: ["Rosenthaler Platz", "Alexanderplatz", "Jannowitzbrücke", "Kottbusser Tor", "Hermannstraße"]
    },
    {
        id: "s1",
        line: "S1",
        product: "suburban",
        direction: "Wannsee",
        vehicles: 4,
        coordinates: [[13.3888, 52.5486], [13.3888, 52.5317], [13.3694, 52.5251], [13.3320, 52.5072], [13.1795, 52.4210]],
        stops: ["Gesundbrunnen", "Nordbahnhof", "Hauptbahnhof", "Wannsee", "Potsdam"]
    },
    {
        id: "s3",
        line: "S3",
        product: "suburban",
        direction: "Erkner",
        vehicles: 4,
        coordinates: [[13.3320, 52.5072], [13.3694, 52.5251], [13.4317, 52.5100], [13.4697, 52.5020], [13.7520, 52.4200]],
        stops: ["Westkreuz", "Hauptbahnhof", "Ostbahnhof", "Ostkreuz", "Erkner"]
    },
    {
        id: "s7",
        line: "S7",
        product: "suburban",
        direction: "Ahrensfelde",
        vehicles: 5,
        coordinates: [[13.0660, 52.3910], [13.3320, 52.5072], [13.3694, 52.5251], [13.4132, 52.5219], [13.5650, 52.5710]],
        stops: ["Potsdam Hbf", "Westkreuz", "Hauptbahnhof", "Alexanderplatz", "Ahrensfelde"]
    },
    {
        id: "s41",
        line: "S41",
        product: "suburban",
        direction: "Ring clockwise",
        vehicles: 6,
        coordinates: [[13.4357, 52.5103], [13.4745, 52.5020], [13.4697, 52.5497], [13.3889, 52.5486], [13.3320, 52.5072], [13.4357, 52.5103]],
        stops: ["Ostkreuz", "Treptower Park", "Greifswalder Straße", "Wedding", "Westkreuz", "Ostkreuz"]
    },
    {
        id: "s42",
        line: "S42",
        product: "suburban",
        direction: "Ring counterclockwise",
        vehicles: 6,
        coordinates: [[13.3320, 52.5072], [13.3889, 52.5486], [13.4697, 52.5497], [13.4745, 52.5020], [13.4357, 52.5103], [13.3320, 52.5072]],
        stops: ["Westkreuz", "Wedding", "Greifswalder Straße", "Treptower Park", "Ostkreuz", "Westkreuz"]
    },
    {
        id: "m4",
        line: "M4",
        product: "tram",
        direction: "Hackescher Markt",
        vehicles: 4,
        coordinates: [[13.5200, 52.5650], [13.4700, 52.5450], [13.4300, 52.5350], [13.4020, 52.5240]],
        stops: ["Hohenschönhausen", "Antonplatz", "Greifswalder Straße", "Hackescher Markt"]
    },
    {
        id: "m10",
        line: "M10",
        product: "tram",
        direction: "Warschauer Straße",
        vehicles: 5,
        coordinates: [[13.3694, 52.5251], [13.3888, 52.5317], [13.3972, 52.5321], [13.4126, 52.5411], [13.4523, 52.5050]],
        stops: ["Hauptbahnhof", "Nordbahnhof", "Naturkundemuseum", "Eberswalder Straße", "Warschauer Straße"]
    },
    {
        id: "bus100",
        line: "100",
        product: "bus",
        direction: "Alexanderplatz",
        vehicles: 4,
        coordinates: [[13.3501, 52.5065], [13.3762, 52.5186], [13.3889, 52.5170], [13.4132, 52.5219]],
        stops: ["Zoo", "Reichstag", "Unter den Linden", "Alexanderplatz"]
    },
    {
        id: "bus200",
        line: "200",
        product: "bus",
        direction: "Michelangelostraße",
        vehicles: 4,
        coordinates: [[13.3501, 52.5065], [13.3760, 52.5096], [13.4132, 52.5219], [13.4500, 52.5350]],
        stops: ["Zoo", "Potsdamer Platz", "Alexanderplatz", "Michelangelostraße"]
    },
    {
        id: "m41",
        line: "M41",
        product: "bus",
        direction: "Sonnenallee",
        vehicles: 4,
        coordinates: [[13.3694, 52.5251], [13.3903, 52.5124], [13.4180, 52.4992], [13.4510, 52.4710]],
        stops: ["Hauptbahnhof", "Potsdamer Platz", "Hermannplatz", "Sonnenallee"]
    },
    {
        id: "re1",
        line: "RE1",
        product: "regional",
        direction: "Frankfurt (Oder)",
        vehicles: 3,
        coordinates: [[13.0660, 52.3910], [13.3320, 52.5072], [13.3694, 52.5251], [13.3869, 52.5200], [13.4317, 52.5100]],
        stops: ["Potsdam Hbf", "Wannsee", "Hauptbahnhof", "Friedrichstraße", "Ostbahnhof"]
    },
    {
        id: "re7",
        line: "RE7",
        product: "regional",
        direction: "Dessau",
        vehicles: 3,
        coordinates: [[13.4317, 52.5100], [13.3869, 52.5200], [13.3694, 52.5251], [13.3320, 52.5072], [13.0660, 52.3910]],
        stops: ["Ostbahnhof", "Friedrichstraße", "Hauptbahnhof", "Wannsee", "Potsdam Hbf"]
    }
];

function interpolatePosition(start, end, progress) {
    return [
        start[0] + (end[0] - start[0]) * progress,
        start[1] + (end[1] - start[1]) * progress
    ];
}

function createStopovers(route, startIndex) {
    return route.stops.slice(startIndex, startIndex + 4).map((stopName, stopIndex) => {
        const date = new Date(Date.now() + (stopIndex + 1) * 4 * 60 * 1000);

        return {
            stop: {
                name: stopName
            },
            arrival: date.toISOString()
        };
    });
}

function createVehicles() {
    const vehicles = [];

    routes.forEach(route => {
        for (let index = 0; index < route.vehicles; index += 1) {
            const segmentIndex = index % (route.coordinates.length - 1);
            const start = route.coordinates[segmentIndex];
            const end = route.coordinates[segmentIndex + 1];
            const progress = 0.25 + ((index * 0.17) % 0.6);
            const [longitude, latitude] = interpolatePosition(start, end, progress);

            vehicles.push({
                tripId: `mock-${route.id}-${index + 1}`,
                direction: route.direction,
                line: {
                    name: route.line,
                    product: route.product
                },
                location: {
                    longitude,
                    latitude
                },
                nextStopovers: createStopovers(route, segmentIndex)
            });
        }
    });

    return vehicles;
}

function createTrips() {
    const trips = {};

    routes.forEach(route => {
        for (let index = 0; index < route.vehicles; index += 1) {
            const tripId = `mock-${route.id}-${index + 1}`;

            trips[tripId] = {
                id: tripId,
                direction: route.direction,
                line: {
                    name: route.line,
                    product: route.product
                },
                polyline: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: route.coordinates
                            }
                        }
                    ]
                }
            };
        }
    });

    return trips;
}

async function saveJson(filename, data) {
    await fs.writeFile(
        path.join(DATA_DIR, filename),
        JSON.stringify(data, null, 4),
        "utf8"
    );
}

async function generateMockData() {
    const vehicles = createVehicles();
    const trips = createTrips();

    await saveJson("vehicles.json", vehicles);
    await saveJson("trips.json", trips);

    console.log(`Saved ${vehicles.length} mock vehicles.`);
    console.log(`Saved ${Object.keys(trips).length} mock trips.`);
}

generateMockData().catch(error => {
    console.error("Failed to generate mock data:", error);
});