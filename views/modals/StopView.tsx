// In App.js in a new project

import * as React from 'react';
import {
    View,
    Text,
    Button,
    Image,
    StatusBar,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {useState, useEffect} from 'react';

import { useTheme } from '@react-navigation/native';

import MapView, { Marker, AnimatedRegion, Animated } from 'react-native-maps';

let time = require('../../data/vitobus_time.json');

function StopView({ route, navigation }) {
  const { stop, line, image } = route.params;
  const colors = useTheme().colors;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: stop.name,
      headerRight: () => (
        <Button
          onPress={() => navigation.goBack()}
          title="Fermer"
        />
      ),
      headerLeft: () => (
        <Image 
          source={image}
          style={{ width: 26, height: 26, marginLeft: 10 }}
        />
      )
    });
  }, [navigation]);

  let usedStopName = stop.name;
  // remove spaces
  usedStopName = usedStopName.replace(/\s/g, '');

  let usedStops = line;
  let lineStopName = 'Ligne ' + line;
  if (usedStops.length > 1) {
    lineStopName = 'Lignes ' + line;
  }

  let lineList = usedStops.split(',');
  // remove "et" and spaces from lineList
  lineList = lineList.map((line) => {
    return line.replace('et', '').replace(/\s/g, '');
  });

  return (
    <View>
      <StatusBar barStyle={'light-content'} />

      <ScrollView style={{ padding: 24 }}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{ color: colors.text, fontWeight: 700, fontSize: 24 }}>
            {stop.name}
          </Text>
          <Text style={{ color: colors.text, opacity: 0.5 }}>
            {lineStopName}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 150,
    marginTop: 24,
    borderRadius: 10,
  },
});

export default StopView;