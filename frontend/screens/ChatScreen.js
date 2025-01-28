import React from "react";
import { View, StyleSheet } from "react-native";
import Chat from "../components/Chat";

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Chat />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingHorizontal: 10,  
   },
});

export default ChatScreen;
