create index if not exists stops_stop_loc_idx
    on stops using gist (stop_loc);

create index if not exists stop_times_stop_departure_idx
    on stop_times (stop_id, departure_time);

create index if not exists stop_times_trip_sequence_idx
    on stop_times (trip_id, stop_sequence);

create index if not exists trips_service_idx
    on trips (service_id);

create index if not exists trips_route_idx
    on trips (route_id);

create index if not exists shapes_shape_sequence_idx
    on shapes (shape_id, shape_pt_sequence);

create index if not exists calendar_dates_date_idx
    on calendar_dates ("date");
