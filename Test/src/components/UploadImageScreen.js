import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  ImageBackground
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

// options to choose when rendering the selecting menu
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from Library',
  quality: 1
};


export class UploadImageScreen extends React.Component {

  constructor(){
    super();
    this.state = {
      imageSource: null,
      bgImage:require('./../images/bg2.jpg'),
    }
  }

  static navigationOptions = {
    title: 'Select Photo',
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Home"
        color="#fff"
      />
    ),
    // header: null
  };
  // select photo, called when
  selectPhoto(){
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
    */
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        // this.setState({
        //   imageSource: source
        // });
        this.props.navigation.navigate('EditingScreen', {
          imageSource: source
        });
      }
    });
  }
  render() {
    return (
      <ImageBackground source={this.state.bgImage}
        style={styles.bg}
      >
        <View style={styles.container}>
          <Image style={styles.image}
            source={this.state.imageSource == null ? require('./../images/add_image.png') :
            this.state.imageSource}
          />
          <TouchableOpacity style={styles.button} onPress={this.selectPhoto.bind(this)}>
            <Text style={styles.text}>Select</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
export default UploadImageScreen;

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
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#fff'
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 30,
    opacity: 0.8
  }
});
