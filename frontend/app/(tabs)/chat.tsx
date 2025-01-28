import { StyleSheet, View } from 'react-native';
import ChatScreen from "@/screens/ChatScreen";

export default function MessageScreen() {
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 30,
      },
  });