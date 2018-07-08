/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import HomeScreen from './src/components/HomeScreen';
import EditingScreen from './src/components/EditingScreen';
import CreateRoomScreen from './src/components/CreateRoomScreen';
import EnterRoomScreen from './src/components/EnterRoomScreen';

const AppStack = StackNavigator(
  {
    HomeScreen: { screen: HomeScreen },
    CreateRoomScreen: { screen: CreateRoomScreen },
    EnterRoomScreen: { screen: EnterRoomScreen },
    EditingScreen: { screen: EditingScreen },
  },
  {
    initialRouteName: 'CreateRoomScreen',
    // initialRouteName: '',
    navigationOptions: {
      headerStyle: {
        // backgroundColor: '#FF876C',
        backgroundColor: 'transparent',
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null
    },
  }
);

export default class App extends Component<Props> {
  constructor(){
    super();
  }
  render() {
    return (
      <AppStack/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
