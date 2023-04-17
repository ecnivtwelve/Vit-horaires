// In App.js in a new project

import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar
} from 'react-native';

import MapView, { Marker, AnimatedRegion, Animated } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

// add vitobus_stops.json at '../data/vitobus_stops.json';
let stops = require('../data/vitobus_stops.json');

function MapStopsView({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Arrêts de bus',
      headerTransparent: false,
    });
  }, [navigation]);

  function renderStops(lineStops, lineImage, lineLetter) {
    let dsc = `Ligne ${lineLetter}`;

    if (lineLetter.length > 1) {
      dsc = `Lignes ${lineLetter}`;
    }

    return lineStops.map((stop, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: parseFloat(stop.coordinates.split(', ')[0].replace(',', '.')),
          longitude: parseFloat(stop.coordinates.split(', ')[1].replace(',', '.')),
        }}
        title={stop.name}
        description={dsc}
        image={lineImage}
        onCalloutPress={() => {
          // open modal
          navigation.navigate('StopView', {
            stop: stop,
            line: lineLetter,
            image: lineImage
          })
        }}
      />
    ));
  }

  let allStops = {
    A: [],
    B: [],
    C: [],
    A_B: [],
    A_B_C: []
  };

  for (let stop in stops) {
    let stopItem = stops[stop];
    let lines = stopItem.lines;

    if (lines == 'A') {
      allStops.A.push(stopItem);
    }
    else if (lines == 'B') {
      allStops.B.push(stopItem);
    }
    else if (lines == 'C') {
      allStops.C.push(stopItem);
    }
    else if (lines == 'A_B') {
      allStops.A_B.push(stopItem);
    }
    else if (lines == 'A_B_C') {
      allStops.A_B_C.push(stopItem);
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: 48.123078,
          longitude: -1.211569,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        {renderStops(allStops['A'], require('../assets/images/line_a.png'), 'A')}
        {renderStops(allStops['B'], require('../assets/images/line_b.png'), 'B')}
        {renderStops(allStops['C'], require('../assets/images/line_c.png'), 'C')}

        {renderStops(allStops['A_B'], require('../assets/images/line_a_b.png'), 'A, et B')}
        {renderStops(allStops['A_B_C'], require('../assets/images/line_a_b_c.png'), 'A, B, et C')}
      </MapView>
    </View>
  );
}

export default MapStopsView;