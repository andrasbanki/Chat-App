import React, { Component } from 'react';
import { View, Button, StyleSheet} from 'react-native';

export default class Chat extends Component {

  render() {
    let name = this.props.route.params.name;
    let backgroundColor = this.props.route.params.backgroundColor;
    this.props.navigation.setOptions({ title: name });
    
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: `${backgroundColor}`}}>
        <Button
          title="Go to Start"
          onPress={() => this.props.navigation.navigate("Start")}
         /> 
      </View>
    )
  }
}