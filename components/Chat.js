import React from "react";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View, Platform, KeyboardAvoidingView, } from 'react-native';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCqg2TAXnEGT0XAoQsYVLIgVBGfXsGUxoo",
        authDomain: "chat-app-4de57.firebaseapp.com",
        projectId: "chat-app-4de57",
        storageBucket: "chat-app-4de57.appspot.com",
        messagingSenderId: "541428318015",
        appId: "1:541428318015:web:c56d5bd278aaafbf22dd8a",
      });
    } 

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      backgroundColor: this.props.route.params.backgroundColor,
      image: null,
      location: null, 
    };    
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
        // Authenticates user via Firebase
        this.authUnsubscribe = firebase.auth()
        .onAuthStateChanged(async (user) => {
        if (!user) {
          await firebase.auth().signInAnonymously();
        }
        this.setState({
          uid: user.uid,
          user: {
            _id: user.uid,
            name: name,
            avatar: 'https://placeimg.com/140/140/any',
          },
          messages: [],
        });
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
        }); 
      } else {
          console.log('offline');
          this.setState({ isConnected: false});
          this.getMessages();
        }
    });
  }  

  componentWillUnmount() {
    this.unsubscribe();
  }

  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });  
    } catch (error) {
      console.log(error.message);
    }
  };

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));      
    } catch (error) {
      console.log(error.message);
    }
  }

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

   addMessage() {
    const message = this.state.messages[0];
    //console.log(message);
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text || '',
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    })
  };

  onSend = (messages = []) => {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      },
    );
  }

  renderBubble(props) {
    let backgroundColor = this.state.backgroundColor;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  renderInputToolbar = props => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView (props) {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}