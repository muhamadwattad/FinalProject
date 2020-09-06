import React, { Component } from 'react';
import { StyleSheet, Text, View, BackHandler, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import { Button, Icon } from 'native-base';
import LoginPage from '../DefaultPages/LoginPage';
import SignupPage from '../DefaultPages/SignupPage';
import MainDrawerPage from './MainDrawerPage';

export default class StackPage extends Component {
  render() {
    return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginPage}
            options={{
              title: "Login",
              headerShown: false,
            }}
          />
          <Stack.Screen name="Into" component={MainDrawerPage}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen name="Signup" component={SignupPage}
            options={{
              headerShown: true,
              title: ''
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

    );
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
