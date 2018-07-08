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


export class CreateRoomScreen extends React.Component {

  constructor(){
    super();
    this.state = {
      imageSource: null,
      bgImage:require('./../images/bg2.jpg'),
      roomName: "",
      displayName: "",
      hostport: 'http://localhost:3000/'
    }
  }

  static navigationOptions = {
    title: 'Create Room',
    header: null
  };
  createRoom(){
    console.log("sending room info");
    // fetch(this.state.hostport+'createRoom/'+this.state.roomName+'/'+this.state.displayName)
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   console.log(responseJson);
    //   if (responseJson.msg=="yes") {
    //     this.props.navigation.navigate('EditingScreen',
    //     {
    //       roomName: this.state.roomName,
    //       displayName: this.state.displayName
    //     })
    //   } else {
    //     // used roomName
    //     alert("The room name is used!");
    //   }
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
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
            placeholder='Your Room Name'
            placeholderTextColor='rgba(255,255,255,0.5)'
            selectionColor='white'
            onChangeText={(roomName) => this.setState({roomName})}
            value={this.state.roomName}
          />
          <TextInput
            style={styles.input}
            placeholder='Your Display Name'
            placeholderTextColor='rgba(255,255,255,0.5)'
            selectionColor='white'
            onChangeText={(displayName) => this.setState({displayName})}
            value={this.state.displayName}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={()=>this.createRoom()}>
            <Text style={styles.text}>Create</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
export default CreateRoomScreen;

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
