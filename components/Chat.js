import React from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View, Platform, KeyboardAvoidingView, } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const firebaseConfig = {
  apiKey: "AIzaSyCqg2TAXnEGT0XAoQsYVLIgVBGfXsGUxoo",
  authDomain: "chat-app-4de57.firebaseapp.com",
  projectId: "chat-app-4de57",
  storageBucket: "chat-app-4de57.appspot.com",
  messagingSenderId: "541428318015",
  appId: "1:541428318015:web:c56d5bd278aaafbf22dd8a",
};

export default class Chat extends React.Component {

  constructor(props) {
    super(props);
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
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = firebase.firestore().collection('messages');
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

  async getMessages() {
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

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));      
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
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
      text: message.text || null,
      user: message.user,
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
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    })
  };

  onSend(messages = []) {
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
      return (
        <InputToolbar {...props} />
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}