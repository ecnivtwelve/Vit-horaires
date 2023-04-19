const { parse } = require('csv-parse/sync')
const fs = require('fs');

// read the file stops.txt from /07-gtfs-urbain-vitre-septembre22-v01
const stops = parse(fs.readFileSync('./07-gtfs-urbain-vitre-septembre22-v01/stops.txt'), {
    columns: true,
    skip_empty_lines: true,
    ltrim: true,
    bom: true
});

// read stop_times.txt from /07-gtfs-urbain-vitre-septembre22-v01
const stop_times = parse(fs.readFileSync('./07-gtfs-urbain-vitre-septembre22-v01/stop_times.txt'), {
    columns: true,
    skip_empty_lines: true,
    ltrim: true,
    bom: true
});

const trips = parse(fs.readFileSync('./07-gtfs-urbain-vitre-septembre22-v01/trips.txt'), {
    columns: true,
    skip_empty_lines: true,
    ltrim: true,
    bom: true
});

let vitobus_stops = [];

function findLines(stop_id) {
    // find all entries in stop_times with stop_id = stop_id
    let lines = stop_times.filter(stop_time => stop_time.stop_id === stop_id);

    let line_ids = [];

    // for each line
    lines.forEach(line => {
        // get first item of line array
        let line_id = line.trip_id;
        // get what's between { and _1}
        line_id = line_id.substring(line_id.indexOf('{') + 1, line_id.indexOf('_1}'));

        // check if line_id is already in line_ids
        if (!line_ids.includes(line_id)) {
            // if not, add it
            line_ids.push(line_id);
        }
    });

    return line_ids;
}

// for each stop
stops.forEach(stop => {
    // GETTING THE NAME
    let name = stop.stop_name;

    // GETTING LINES
    let lines = findLines(stop.stop_id).join('_');

    // if lines are empty, skip this stop
    if (lines === '') {
        return;
    }

    // CREATION
    // check if stop exists in vitobus_stops
    vitobus_stops = vitobus_stops.filter(vitobus_stop => vitobus_stop.name !== name);

    vitobus_stops.push({
        id: stop.stop_id,
        name: name,
        coordinates: stop.stop_lat + ', ' + stop.stop_lon,
        lines: lines
    });
});

let vitobus_stops_time = [];

// for each stop time
stop_times.forEach(stop_time => {
    // get first item of line array
    let line_id = stop_time.trip_id;
    // get what's between { and _1}
    line_id = line_id.substring(line_id.indexOf('{') + 1, line_id.indexOf('_1}'));

    // get stop name
    let stop_name = stops.find(stop => stop.stop_id === stop_time.stop_id).stop_name;

    // get trip name
    let trip_name = trips.find(trip => trip.trip_id === stop_time.trip_id).trip_headsign;

    vitobus_stops_time.push({
        line: line_id,
        stop_id: stop_time.stop_id,
        stop_name: stop_name,
        time: stop_time.arrival_time,
        trip_name: trip_name
    })
});

let vitobus_time = {};

// for each time
vitobus_stops_time.forEach(time => {
    // if line does not exist in vitobus_time
    if (!vitobus_time.hasOwnProperty(time.line)) {
        // create it
        vitobus_time[time.line] = {};
    }

    // if stop does not exist in vitobus_time[line]
    if (!vitobus_time[time.line].hasOwnProperty(time.stop_id)) {
        // create it
        vitobus_time[time.line][time.stop_id] = {};
    }

    // if trip does not exist in vitobus_time[line][stop]
    if (!vitobus_time[time.line][time.stop_id].hasOwnProperty(time.trip_name)) {
        // create it
        vitobus_time[time.line][time.stop_id][time.trip_name] = [];
    }

    // add time to vitobus_time[line][stop][trip]
    vitobus_time[time.line][time.stop_id][time.trip_name].push(time.time);
});

// write the file stops.json
fs.writeFileSync('./vitobus_stops.json', JSON.stringify(vitobus_stops, null, 2));
fs.writeFileSync('./vitobus_time.json', JSON.stringify(vitobus_time, null, 2));
