import React from 'react';
import { ImageBackground, View, Text, KeyboardAvoidingView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const backgroundImage = require('../assets/BackgroundImage.png')

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '' ,
      backgroundColor: '#FFF'
    }
  }

  render() {
    
    return (
    <ImageBackground source={backgroundImage} style={styles.bgimage}>
      <View style={styles.container}>
        <View style={styles.box1}>
          <Text style={styles.title}>Chat App</Text>
        </View>
        <View style={styles.box2}> 
          <TextInput
            style={styles.name}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder='Your name'
          />
          <Text style={styles.bgColorText}>Choose Background Color:</Text>
          <View style={styles.bgColor}>
            <TouchableOpacity style={styles.color1}
              onPress={() => this.setState({ backgroundColor: '#090C08' })}
            />
            <TouchableOpacity style={styles.color2}
              onPress={() => this.setState({ backgroundColor: '#474056' })}
            />
            <TouchableOpacity style={styles.color3}
              onPress={() => this.setState({ backgroundColor: '#8A95A5' })}
            />
            <TouchableOpacity style={styles.color4}
              onPress={() => this.setState({ backgroundColor: '#B9C6AE' })}>
            <Text style={styles.buttonText}Start Chatting></Text>
            </TouchableOpacity>    
          </View>
          <TouchableOpacity
              style={{ 
                backgroundColor: this.state.backgroundColor, 
                height: 50,  
                width: '90%',
                justifyContent: 'center'
              }}
              onPress={() => {
                this.props.navigation.navigate('Chat', { name: this.state.name, backgroundColor: this.state.backgroundColor })}}>
               <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
      </View>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },  

  bgimage: {
    flex: 1,
    justifyContent: "center",
    resizeMode: 'cover'
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    top : 80,
  },

  box1: {
    flex: 55,
  },

  box2: {
    backgroundColor: '#FFFFFF',
    flex: 45,
    height: '44%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 20,
    marginVertical: 20,
  },

  name: {
    width: '90%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  bgColorText: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    opacity: 100,
  },

  bgColor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  // button: {
  //   height: 50,
  //   width: '90%',
  //   backgroundColor: '#757083',
  //   justifyContent: 'center',
  // },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: 'white',
    textAlign: 'center',

  },
});
