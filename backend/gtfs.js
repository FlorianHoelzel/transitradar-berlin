import { query } from "./db.js";

const BERLIN_TIME_ZONE = process.env.TRANSIT_TIME_ZONE || "Europe/Berlin";

function cleanStopName(name = "") {
    return name
        .replace(/\s+\(Berlin\)$/i, "")
        .replace(/\s+Bhf$/i, " Bhf")
        .trim();
}

function normalizeLimit(value, fallback, max) {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }

    return Math.min(parsed, max);
}

function productFromRoute(lineName = "", routeType = "") {
    if (
        lineName.startsWith("ICE") ||
        lineName.startsWith("IC") ||
        lineName.startsWith("EC")
    ) {
        return "express";
    }

    if (
        lineName.startsWith("RE") ||
        lineName.startsWith("RB") ||
        lineName.startsWith("RJ") ||
        lineName === "FEX"
    ) {
        return "regional";
    }

    if (lineName.startsWith("S")) {
        return "suburban";
    }

    if (lineName.startsWith("U")) {
        return "subway";
    }

    if (String(routeType) === "900") {
        return "tram";
    }

    if (String(routeType) === "1000") {
        return "ferry";
    }

    if (String(routeType) === "700") {
        return "bus";
    }

    if (String(routeType).startsWith("1")) {
        return "regional";
    }

    return "bus";
}

function emptyProducts() {
    return {
        subway: false,
        suburban: false,
        tram: false,
        bus: false,
        ferry: false,
        express: false,
        regional: false
    };
}

function productsFromLines(lines = []) {
    return lines.reduce((products, line) => {
        products[productFromRoute(line.name, line.routeType)] = true;
        return products;
    }, emptyProducts());
}

function lineFromRow(row) {
    return {
        id: row.route_id,
        name: row.route_short_name || row.route_long_name || "",
        product: productFromRoute(row.route_short_name || row.route_long_name || "", row.route_type)
    };
}

function iso(value) {
    return value instanceof Date ? value.toISOString() : value;
}

function getServiceDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: BERLIN_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function getLocalTimeSeconds() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: BERLIN_TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).formatToParts(new Date());

    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));

    return (
        Number(values.hour) * 3600 +
        Number(values.minute) * 60 +
        Number(values.second)
    );
}

const activeServicesSql = `
    active_services as (
        select c.service_id
        from calendar c
        where $1::date between c.start_date and c.end_date
        and (
            case extract(isodow from $1::date)::int
                when 1 then c.monday
                when 2 then c.tuesday
                when 3 then c.wednesday
                when 4 then c.thursday
                when 5 then c.friday
                when 6 then c.saturday
                when 7 then c.sunday
            end
        )::text = 'available'

        union

        select cd.service_id
        from calendar_dates cd
        where cd.date = $1::date
        and cd.exception_type::text = 'added'

        except

        select cd.service_id
        from calendar_dates cd
        where cd.date = $1::date
        and cd.exception_type::text = 'removed'
    )
`;

export async function getStops({ results = 1000 }) {
    const limit = normalizeLimit(results, 1000, 5000);

    const { rows } = await query(
        `
        with candidate_stops as (
            select
                s.stop_id,
                s.stop_name,
                st_y(s.stop_loc::geometry) as latitude,
                st_x(s.stop_loc::geometry) as longitude
            from stops s
            where s.location_type::text = 'stop'
            and s.stop_loc is not null
            order by s.stop_name nulls last
            limit $1
        )
        select
            cs.stop_id,
            cs.stop_name,
            cs.latitude,
            cs.longitude,
            coalesce(
                json_agg(distinct jsonb_build_object(
                    'route_id', r.route_id,
                    'route_short_name', r.route_short_name,
                    'route_long_name', r.route_long_name,
                    'route_type', r.route_type::text
                )) filter (where r.route_id is not null),
                '[]'
            ) as lines
        from candidate_stops cs
        left join stop_times st on st.stop_id = cs.stop_id
        left join trips t on t.trip_id = st.trip_id
        left join routes r on r.route_id = t.route_id
        group by cs.stop_id, cs.stop_name, cs.latitude, cs.longitude
        order by cs.stop_name nulls last
        `,
        [limit]
    );

    return rows.map(row => {
        const lines = row.lines.map(line => ({
            name: line.route_short_name || line.route_long_name || "",
            routeType: line.route_type
        })).filter(line => line.name);

        return {
            type: "stop",
            id: row.stop_id,
            name: cleanStopName(row.stop_name),
            location: {
                type: "location",
                latitude: Number(row.latitude),
                longitude: Number(row.longitude)
            },
            products: productsFromLines(lines),
            lines: [...new Set(lines.map(line => line.name))].sort((a, b) => {
                return a.localeCompare(b, "de-DE", { numeric: true });
            })
        };
    });
}

export async function getDeparturesForStop(stopId, { results = 20, duration = 60 }) {
    const limit = normalizeLimit(results, 20, 200);
    const durationMinutes = normalizeLimit(duration, 60, 24 * 60);
    const serviceDate = getServiceDate();
    const nowSeconds = getLocalTimeSeconds();

    const { rows } = await query(
        `
        with ${activeServicesSql},
        matching_stops as (
            select stop_id
            from stops
            where stop_id = $2
            or stop_id like '%:' || $2 || ':%'
            or stop_id like '%:' || $2
        )
        select
            st.trip_id,
            t.trip_headsign,
            r.route_id,
            r.route_short_name,
            r.route_long_name,
            r.route_type::text,
            ($1::date + st.departure_time) at time zone $6 as planned_when
        from stop_times st
        join matching_stops ms on ms.stop_id = st.stop_id
        join trips t on t.trip_id = st.trip_id
        join active_services a on a.service_id = t.service_id
        join routes r on r.route_id = t.route_id
        where extract(epoch from st.departure_time) >= $3
        and extract(epoch from st.departure_time) <= $3 + ($4 * 60)
        order by st.departure_time
        limit $5
        `,
        [serviceDate, stopId, nowSeconds, durationMinutes, limit, BERLIN_TIME_ZONE]
    );

    return rows.map(row => {
        const plannedWhen = iso(row.planned_when);

        return {
            tripId: row.trip_id,
            line: lineFromRow(row),
            direction: row.trip_headsign || "",
            when: plannedWhen,
            plannedWhen,
            delay: 0
        };
    });
}

export async function getTrip(tripId) {
    const serviceDate = getServiceDate();

    const { rows } = await query(
        `
        select
            t.trip_id,
            t.trip_headsign,
            t.shape_id,
            r.route_id,
            r.route_short_name,
            r.route_long_name,
            r.route_type::text
        from trips t
        join routes r on r.route_id = t.route_id
        where t.trip_id = $1
        limit 1
        `,
        [tripId]
    );

    if (rows.length === 0) {
        return null;
    }

    const trip = rows[0];

    const [stopoversResult, shapeResult] = await Promise.all([
        query(
            `
            select
                s.stop_id,
                s.stop_name,
                st_y(s.stop_loc::geometry) as latitude,
                st_x(s.stop_loc::geometry) as longitude,
                ($2::date + st.arrival_time) at time zone $3 as arrival,
                ($2::date + st.departure_time) at time zone $3 as departure
            from stop_times st
            join stops s on s.stop_id = st.stop_id
            where st.trip_id = $1
            order by st.stop_sequence
            `,
            [tripId, serviceDate, BERLIN_TIME_ZONE]
        ),
        query(
            `
            select
                st_x(shape_pt_loc::geometry) as longitude,
                st_y(shape_pt_loc::geometry) as latitude
            from shapes
            where shape_id = $1
            order by shape_pt_sequence
            `,
            [trip.shape_id]
        )
    ]);

    const line = lineFromRow(trip);
    const stopovers = stopoversResult.rows.map(row => {
        const arrival = iso(row.arrival);
        const departure = iso(row.departure);

        return {
            stop: {
                id: row.stop_id,
                name: cleanStopName(row.stop_name),
                location: {
                    type: "location",
                    latitude: Number(row.latitude),
                    longitude: Number(row.longitude)
                }
            },
            arrival,
            departure,
            plannedArrival: arrival,
            plannedDeparture: departure
        };
    });

    const coordinates = shapeResult.rows.map(row => [
        Number(row.longitude),
        Number(row.latitude)
    ]);

    const polyline = {
        type: "FeatureCollection",
        features: coordinates.length > 1
            ? [{
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates
                }
            }]
            : []
    };

    return {
        trip: {
            id: trip.trip_id,
            tripId: trip.trip_id,
            direction: trip.trip_headsign || "",
            line,
            stopovers,
            polyline
        }
    };
}

export async function getRadarMovements({ north, south, east, west, results = 300 }) {
    const limit = normalizeLimit(results, 300, 1500);
    const serviceDate = getServiceDate();
    const nowSeconds = getLocalTimeSeconds();

    const { rows } = await query(
        `
        with ${activeServicesSql},
        upcoming as (
            select distinct on (st.trip_id)
                st.trip_id,
                t.trip_headsign,
                r.route_id,
                r.route_short_name,
                r.route_long_name,
                r.route_type::text,
                st_y(s.stop_loc::geometry) as latitude,
                st_x(s.stop_loc::geometry) as longitude,
                ($1::date + st.arrival_time) at time zone $8 as arrival,
                ($1::date + st.departure_time) at time zone $8 as departure
            from stop_times st
            join trips t on t.trip_id = st.trip_id
            join active_services a on a.service_id = t.service_id
            join routes r on r.route_id = t.route_id
            join stops s on s.stop_id = st.stop_id
            where extract(epoch from st.departure_time) between $2 and $2 + 1800
            and st_y(s.stop_loc::geometry) between $3 and $4
            and st_x(s.stop_loc::geometry) between $5 and $6
            order by st.trip_id, st.departure_time
        )
        select *
        from upcoming
        order by departure
        limit $7
        `,
        [
            serviceDate,
            nowSeconds,
            Number(south),
            Number(north),
            Number(west),
            Number(east),
            limit,
            BERLIN_TIME_ZONE
        ]
    );

    return {
        movements: rows.map(row => {
            const arrival = iso(row.arrival);
            const departure = iso(row.departure);

            return {
                tripId: row.trip_id,
                direction: row.trip_headsign || "",
                line: lineFromRow(row),
                location: {
                    type: "location",
                    latitude: Number(row.latitude),
                    longitude: Number(row.longitude)
                },
                nextStopovers: [{
                    stop: {
                        location: {
                            type: "location",
                            latitude: Number(row.latitude),
                            longitude: Number(row.longitude)
                        }
                    },
                    arrival,
                    departure,
                    plannedArrival: arrival,
                    plannedDeparture: departure
                }]
            };
        })
    };
}
