
import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "AIzaSyB3vGg4qHmDC9CRjlCHIKx1NmW2R-TUi4I";

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "hello! ";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);
      showMessage({
        message: "Welcome to Gemini Chat 🤖",
        description: text,
        type: "info",
        icon: "info",
        duration: 2000,
      });
      setMessages([
        {
          text,
          user: false,
        },
      ]);
    };
    startChat();
  }, []);

  const sendMessage = async () => {
    if (userInput.trim()) {
      setLoading(true);  
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = userMessage.text;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      
      setMessages((prevMessages) => [
        ...prevMessages,
        { text, user: false },
      ]);
      setLoading(false); 
      setUserInput("");  
    }
  };

  const ClearMessage = () => {
    setMessages([]);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <Text
        style={[styles.messageText, item.user && styles.userMessageText]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator size="large" color="#4caf50" />
          ) : null
        }
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micIcon} onPress={ClearMessage}>
          <FontAwesome
            name="microphone-slash"
            size={24}
            color="white"
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
          <Entypo name="controller-stop" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffff" },
  messageContainer: { padding: 10, marginVertical: 5, width: "100%", flexDirection: "row", justifyContent: "flex-start" },
  aiMessageContainer: {
    alignSelf: "flex-start", 
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginLeft: 10,
  },
  userMessageContainer: {
    alignSelf: "flex-end", 
    backgroundColor: "#4caf50",
    borderRadius: 10,
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
    padding: 10,
  },
  userMessageText: {
    color: "#fff", 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#131314",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 20,
    height: 50,
    color: "white",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});

export default Chat;
