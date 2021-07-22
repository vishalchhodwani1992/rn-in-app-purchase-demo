/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
} from 'react-native';

import HomeNavigator from './src/Navigation';

class App extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <HomeNavigator/>
      </View>
    );
  }
}

console.disableYellowBox = true;

export default App;
