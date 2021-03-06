import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ImageBackground,
  TextInput
} from 'react-native';

// options to choose when rendering the selecting menu
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from Library',
  quality: 1
};


export class EnterRoomScreen extends React.Component {

  constructor(){
    super();
    this.state = {
      imageSource: null,
      bgImage:require('./../images/bg2.jpg'),
    }
  }

  static navigationOptions = {
    title: 'Enter Room',
    header: null
  };
  enterRoom(){
    this.props.navigation.navigate('EditingScreen',
    {
      roomName: this.state.roomName,
      displayName: this.state.displayName
    })
  }
  render() {
    return (
      <ImageBackground source={this.state.bgImage}
        style={styles.bg}
      >
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder='Room Name'
            placeholderTextColor='rgba(255,255,255,0.5)'
            selectionColor='white'
          />
          <TextInput
            style={styles.input}
            placeholder='Your Display Name'
            placeholderTextColor='rgba(255,255,255,0.5)'
            selectionColor='white'
          />
          <TouchableOpacity
            style={styles.button}
            onPress={()=>this.enterRoom()}>
            <Text style={styles.text}>Create</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
export default EnterRoomScreen;

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
    marginTop: 60,
    borderWidth: 1,
    borderColor: '#fff'
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  input: {
    color: 'white',
    maxWidth: 300,
    minWidth: 200,
    height: 50,
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: '#fff',
    paddingLeft: 10,
    fontSize: 20,
    borderRadius: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 30,
    opacity: 0.8
  }
});
