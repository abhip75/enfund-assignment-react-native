import { StyleSheet, View, Button } from 'react-native';
import React, { useState } from 'react';
import TimeTableScreen from "@/screens/TimetableScreen";

export default function HomeScreen() {
  const [role, setRole] = useState('student');

  return (
    <View style={styles.container}>
      <TimeTableScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 60, 
    paddingHorizontal: 10, 
  },
});
