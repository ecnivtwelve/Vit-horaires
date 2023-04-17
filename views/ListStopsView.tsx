// In App.js in a new project

import * as React from 'react';
import {
    View,
    Text,
    Button
  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '@react-navigation/native';

function ListStopsView({ navigation }) {
  const colors = useTheme().colors;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      <View>

        <View>
          <Text>Ligne A</Text>
        </View>

      </View>

    </View>
  );
}

export default ListStopsView;