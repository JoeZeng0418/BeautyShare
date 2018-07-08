import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  ImageBackground,
  Slider,
  CameraRoll,
  Dimensions
} from 'react-native';
import SocketIOClient from 'socket.io-client';
// import CameraRollExtended from 'react-native-store-photos-album'


import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-native';

import ImagePicker from 'react-native-image-picker';


// options to choose when rendering the selecting menu
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from Library',
  quality: 1
};

const shaders = Shaders.create({
    Saturate: {
        frag: GLSL`
    precision highp float;
    varying vec2 uv;
    uniform sampler2D t;
    uniform float contrast, saturation, brightness;
    const vec3 L = vec3(0.2125, 0.7154, 0.0721);
    void main() {
      vec4 c = texture2D(t, uv);
      vec3 brt = c.rgb * brightness;
      gl_FragColor = vec4(mix(
      vec3(0.5),
      mix(vec3(dot(brt, L)), brt, saturation),
      contrast), c.a);
  }
  `
    }
});
var take = null;
export const Saturate = ({ contrast, saturation, brightness, children }) => {
  //debugger;
  return (<Node
          shader={shaders.Saturate}
          uniforms={{ contrast, saturation, brightness, t: children }}
      />
  )};

class EditingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.roomName}`,
    headerRight: (
      <Button
      onPress={
        ()=> take.savePhoto()
      }
        title="Save"
        color="#fff"
      />
    ),
    headerStyle: {
      backgroundColor: 'rgba(40,44,52,1)',
      borderBottomWidth: 0,
    },
  });
  constructor(props){
    super(props);

    this.state = {
      hostport: 'http://localhost:3000/',
      contrast: 1,
      saturation: 1,
      brightness: 1,
      imageSource: null,
      imageWidth: '100%',
      imageHeight: '100%',
      showContrast: false,
      showSaturation: false,
      showBrightness: false,
      hasImage: false,
    };
    this.socket = SocketIOClient(this.state.hostport);
    this.socket.emit('createNickname', this.props.navigation.state.params.displayName);
    this.socket.emit('enterRoom', this.props.navigation.state.params.roomName);
    // Client side to receive message
    this.socket.on('message', (message) => {
      alert(message);
    });
    this.socket.on('imageReady', (imageFilename) => {
      var _uri = this.state.hostport+"images/"+imageFilename;
      Image.getSize(_uri, (width, height) => {
        // determine the shape of the image for precise display
        var w = null;
        var h = null;
        var ratio = height/width
        if (width<height) {
          h = '100%';
          // w = ((100/ratio).toFixed(2)).toString()+"%";
          w = Dimensions.get('window').height*0.85/ratio;
        } else {
          w = '100%';
          h = Dimensions.get('window').width*ratio;
        }
        this.setState({
          imageSource: {uri: _uri},
          imageHeight: h,
          imageWidth: w,
          hasImage: true,
        })
      });
    });
    this.socket.on('modifyImage', (json) => {
      this.setState({
        contrast: json.contrast,
        saturation: json.saturation,
        brightness: json.brightness
      });
    });
  }
  doneEditing(str){
    if (str=="contrast") {
      this.setState({
        showContrast: false
      });
    } else if (str=="saturation") {
      this.setState({
        showSaturation: false
      });
    } else if (str=="brightness") {
      this.setState({
        showBrightness: false
      });
    }
  }
  cancelEditing(str){
    if (str=="contrast") {
      this.setState({
        showContrast: false
      });
    } else if (str=="saturation") {
      this.setState({
        showSaturation: false
      });
    } else if (str=="brightness") {
      this.setState({
        showBrightness: false
      });
    }
  }
  showEditor(str){
    if (str=="contrast") {
      this.setState({
        showContrast: true
      });
    } else if (str=="saturation") {
      this.setState({
        showSaturation: true
      });
    } else if (str=="brightness") {
      this.setState({
        showBrightness: true
      });
    }
  }
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
        const data = new FormData();
        data.append('roomName', this.props.navigation.state.params.roomName); // you can append anyone.
        data.append('photo', {
          uri: response.uri,
          type: 'image/jpeg', // or photo.type
          name: 'test'
        });
        fetch(this.state.hostport+"upload", {
          method: 'post',
          body: data
        }).then((response) => response.json()).then((responseJson) => {
          if (responseJson.msg=="ok") {
            this.socket.emit('imageReady', responseJson.imageFilename);
          }
          // this.setState({
          //   imageSource: source,
          //   hasImage: true,
          // });
        });
      }
    });
  }
  savePhoto(){
    // alert(CameraRoll.saveToCameraRoll);
    // CameraRoll.saveToCameraRoll('https://pbs.twimg.com/profile_images/712703916358537217/mcOketun_400x400.jpg', 'photo').then(function(result) {
    //   console.log('save succeeded ' + result);
    //   alert("saved");
    // }).catch(function(error) {
    //   console.log('save failed ' + error);
    //   alert(error);
    // });
    alert("saved");
    // CameraRollExtended.saveToCameraRoll({uri: 'https://pbs.twimg.com/profile_images/712703916358537217/mcOketun_400x400.jpg', album: 'Test'}, 'photo')
  }
  sendImageChange(){
      this.socket.emit('modifyImage', {
        contrast: this.state.contrast,
        saturation: this.state.saturation,
        brightness: this.state.brightness
      });
  }
  render() {
    take = this;
    const filter = {
      contrast: this.state.contrast,
      saturation: this.state.saturation,
      brightness: this.state.brightness
    };
    return (
      <View style={styles.container}>
        <View style={styles.imageBox}>
          <TouchableOpacity style={{width:'100%',height:'100%',
          backgroundColor: 'rgba(40,44,52,1)',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0}}
          disabled={this.state.hasImage}
          onPress={this.selectPhoto.bind(this)}>
            {!this.state.hasImage&&<Image ref="imageSize" style={styles.image}
              source={require('./../images/add_image.png')}
            />}
            <Surface style={{width:this.state.imageWidth,height:this.state.imageHeight}}>
                <Saturate {...filter}>
                    {this.state.imageSource}
                </Saturate>
            </Surface>
          </TouchableOpacity>
        </View>
        <View style={styles.editorBox}>
          {(!this.state.showContrast&&!this.state.showBrightness&&!this.state.showSaturation&&this.state.hasImage)&&
            <View style={{justifyContent:'center',width:'90%',alignItems:'center'}}>
              <View style={{justifyContent: 'space-between',flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity style={styles.optionButton} onPress={
                  ()=>this.showEditor("contrast")
                }>
                  <Text style={styles.text}>Contrast</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={
                  ()=>this.showEditor("saturation")
                }>
                  <Text style={styles.text}>Saturation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={
                  ()=>this.showEditor("brightness")
                }>
                  <Text style={styles.text}>Brightness</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          {this.state.showContrast&&<View style={{justifyContent:'center',width:'90%',alignItems:'center'}}>
            <Slider
              style={{ width: '90%'}}
              step={0.05}
              minimumValue={0}
              maximumValue={2}
              value={this.state.contrast}
              onValueChange={val=>this.setState({contrast: val})}
              onSlidingComplete={val=>this.sendImageChange()}
              minimumTrackTintColor='rgba(255,255,255,1)'
              maximumTrackTintColor='rgba(255,255,255,0.3)'
            />
            <View style={{justifyContent: 'space-between',flexDirection: 'row', width: '100%'}}>
              <TouchableOpacity style={styles.editingButton} onPress={
                ()=>this.cancelEditing("contrast")
              }>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editingButton} onPress={
                ()=>this.doneEditing("contrast")
              }>
                <Text style={styles.text}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>}
          {this.state.showSaturation&&<View style={{justifyContent:'center',width:'90%',alignItems:'center'}}>
            <Slider
              style={{ width: '90%' }}
              step={0.05}
              minimumValue={0}
              maximumValue={2}
              value={this.state.saturation}
              onValueChange={val=>this.setState({saturation: val})}
              onSlidingComplete={val=>this.sendImageChange()}
              minimumTrackTintColor='rgba(255,255,255,1)'
              maximumTrackTintColor='rgba(255,255,255,0.3)'
            />
            <View style={{justifyContent: 'space-between',flexDirection: 'row', width: '100%'}}>
              <TouchableOpacity style={styles.editingButton} onPress={
                ()=>this.cancelEditing("saturation")
              }>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editingButton} onPress={
                ()=>this.doneEditing("saturation")
              }>
                <Text style={styles.text}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>}
          {this.state.showBrightness&&<View style={{justifyContent:'center',width:'90%',alignItems:'center'}}>
            <Slider
              style={{ width: '90%' }}
              step={0.05}
              minimumValue={0}
              maximumValue={2}
              value={this.state.brightness}
              onValueChange={val=>this.setState({brightness: val})}
              onSlidingComplete={val=>this.sendImageChange()}
              minimumTrackTintColor='rgba(255,255,255,1)'
              maximumTrackTintColor='rgba(255,255,255,0.3)'
            />
            <View style={{justifyContent: 'space-between',flexDirection: 'row', width: '100%'}}>
              <TouchableOpacity style={styles.editingButton} onPress={
                ()=>this.cancelEditing("brightness")
              }>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editingButton} onPress={
                ()=>this.doneEditing("brightness")
              }>
                <Text style={styles.text}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>}

        </View>
      </View>
    );
  }
}
export default EditingScreen;

const styles = StyleSheet.create({
  bg: {
    position:'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(40,44,52,1)',
  },
  log: {
    position: 'absolute',
    right: 80,
    top: 30,
  },
  imageBox: {
    height: '85%',
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  editorBox: {
    height: '15%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  editingButton: {
    maxWidth: 100,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    // marginTop: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  optionButton: {
    maxWidth: 200,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode:'contain',
    position: 'absolute'
  },

});
