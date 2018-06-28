import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  ImageBackground
} from 'react-native';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-native';

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

export const Saturate = ({ contrast, saturation, brightness, children }) => {
    //console.log('ran');
    //debugger;
    return (<Node
            shader={shaders.Saturate}
            uniforms={{ contrast, saturation, brightness, t: children }}
        />
    )};

export default class Example extends Component {
  constructor(){
    super();
    this.state = {
      contrast: 1,
      saturation: 1,
      brightness: 1
    }
  }
    changeContrast() {
      console.log(" change contrast");
      this.setState({
        contrast: 2
      });
    }
    render() {
      const { navigate } = this.props.navigation;
      const { navigation } = this.props;
      const { brightness, contrast, saturation } = this.state;
      const filter = {
        contrast: contrast,
        saturation: 1,
        brightness: 1
        }
        return (
          <View>
            <Surface style={{width:'90%',height:'80%'}}
            onPress={this.changeContrast.bind(this)}>
                <Saturate {...filter}>
                    {require('./../images/test.jpg')}
                </Saturate>
            </Surface>
            <TouchableOpacity onPress={this.changeContrast.bind(this)}>
              <Text>Done</Text>
            </TouchableOpacity>
            </View>
        );
    }
}
