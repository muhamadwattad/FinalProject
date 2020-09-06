import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, BackHandler, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import { Button, Icon } from 'native-base';

import StackPage from './Pages/ScreensPages/StackPage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <StackPage />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
