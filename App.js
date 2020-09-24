import { AppState, AsyncStorage, BackHandler, StyleSheet, Text, View, } from 'react-native';
import { Button, Icon } from 'native-base';

import { APILINK } from './Pages/URL'
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import StackPage from './Pages/ScreensPages/StackPage';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    }
  }
  render() {
    return (

      <StackPage />
    )
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    //getting teams and saving them into the AsyncStorage

    var teams = await AsyncStorage.getItem("teams");
    if (teams == null) {

      var url = APILINK + "getteams/"
      console.log(url);
      await fetch(url).then((resp) => {
        return resp.json();
      }).then(async (data) => {

        await AsyncStorage.setItem("teams", JSON.stringify(data));
      })
    }
  }
  _handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'inactive') {
      console.log('the app is closed');
    }
    if (nextAppState == 'background') {
      var user = await AsyncStorage.getItem("activeuser");
      if (user != null) {
        var currentuser = JSON.parse(user);
        var url = APILINK + "updateStatus/" + currentuser.email + "/false/"
        await fetch(url);
      }
    }
    if (nextAppState == 'active') {
      var user = await AsyncStorage.getItem("activeuser");
      if (user != null) {
        var currentuser = JSON.parse(user);
        var url = APILINK + "updateStatus/" + currentuser.email + "/true/"
        await fetch(url);
      }
    }
    this.setState({ appState: nextAppState }, () => {
      console.log(this.state.appState);
    });

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
