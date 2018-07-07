import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ImageBackground
} from 'react-native';



class HomeScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      bgImage:require('./../images/bg1.jpg'),
    }
  }
  static navigationOptions = {
    title: 'Home',
    header: null
  };
  render() {
    const filter = {
      contrast: this.state.contrast,
      saturation: 1,
      brightness: 1
    }
    return (
      <ImageBackground source={this.state.bgImage}
        style={styles.bg}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={
            ()=>this.props.navigation.navigate('CreateRoomScreen')
          }>
            <Text style={styles.text}>Create Room</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={
            ()=>this.props.navigation.navigate('EnterRoomScreen')
          }>
            <Text style={styles.text}>Enter Room</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
export default HomeScreen;
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  button: {
    // width: '50%',
    maxWidth: 300,
    minWidth: 200,
    height: 60,
    // backgroundColor: 'skyblue',
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#fff',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }
});
