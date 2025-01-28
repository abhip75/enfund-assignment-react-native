

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text, Alert, Modal, ScrollView, TextInput } from "react-native";
import * as FileSystem from 'expo-file-system'; // Import FileSystem for saving files
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage replacement
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

const TimetableScreen = () => {
  const [timetables, setTimetables] = useState([]);
  const [newTimetable, setNewTimetable] = useState({
    subject: "",
    time: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTeacher, setIsTeacher] = useState(true); // Default is teacher view

  useEffect(() => {
    fetchTimetables();
    registerForPushNotifications();
  }, []);

   // Request push notification permissions
   const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission required", "We need permission to send notifications.");
    }
  };

  // Function to handle sending a notification
  const sendNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Timetable Alert",
        body: message,
      },
      trigger: null, // Trigger the notification immediately
    });
  };


  const playBeepSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/images/alert-sound.wav') // Replace with the correct path to your beep sound file
    );
    await sound.playAsync();
  };


  const fetchTimetables = () => {
    setLoading(true);
    fetch("http://192.168.1.5:8000/api/timetables")
      .then((response) => response.json())
      .then((data) => {
        // Replace localStorage with AsyncStorage
        AsyncStorage.getItem('assignedTimetables')
          .then((storedData) => {
            const savedAssignedTimetables = JSON.parse(storedData) || [];
            const updatedTimetables = data.map((item) => {
              if (savedAssignedTimetables.includes(item._id)) {
                item.assigned = true;
              }
              return item;
            });
            setTimetables(updatedTimetables);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Alert.alert("Error", "Failed to load timetables.");
            console.error(error);
          });
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Failed to load timetables.");
        console.error(error);
      });
  };

  const handleAddTimetable = () => {
    if (!newTimetable.subject || !newTimetable.time || !newTimetable.date) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    fetch("http://192.168.1.5:8000/api/timetables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTimetable),
    })
      .then((response) => response.json())
      .then((data) => {
        setTimetables((prev) => [...prev, data]);
        setNewTimetable({ subject: "", time: "", date: "" });
        setLoading(false);
        setModalVisible(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Failed to add timetable.");
        console.error(error);
      });
  };

  const handleDeleteTimetable = (id) => {
    setLoading(true);
    fetch(`http://192.168.1.5:8000/api/timetables/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTimetables((prev) => prev.filter((item) => item._id !== id));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Failed to delete timetable.");
        console.error(error);
      });
  };

  const handleUpdateTimetable = () => {
    if (!newTimetable.subject || !newTimetable.time || !newTimetable.date) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    fetch(`http://192.168.1.5:8000/api/timetables/${newTimetable._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTimetable),
    })
      .then((response) => response.json())
      .then((data) => {
        setTimetables((prev) =>
          prev.map((item) =>
            item._id === data._id ? { ...item, ...data } : item
          )
        );
        setLoading(false);
        setModalVisible(false);
        setIsUpdating(false);
        sendNotification(`Timetable updated: ${newTimetable.subject} at ${newTimetable.time}`);
        playBeepSound();
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Failed to update timetable.");
        console.error(error);
      });
  };

  // const handleUpdateTimetable = () => {
  //   if (!newTimetable.subject || !newTimetable.time || !newTimetable.date) {
  //     Alert.alert("Validation Error", "Please fill in all fields.");
  //     return;
  //   }

  //   setLoading(true);
  //   fetch(`http://192.168.1.5:8000/api/timetables/${newTimetable._id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(newTimetable),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setTimetables((prev) =>
  //         prev.map((item) =>
  //           item._id === data._id ? { ...item, ...data } : item
  //         )
  //       );
  //       setLoading(false);
  //       setModalVisible(false);
  //       setIsUpdating(false);
        
  //       // Trigger Firebase notification on timetable update
  //       messaging().sendMessage({
  //         to: '',  // Replace with actual FCM token or the recipient's token
  //         notification: {
  //           title: 'Timetable Updated',
  //           body: `Timetable updated for ${newTimetable.subject} at ${newTimetable.time}`,
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       Alert.alert("Error", "Failed to update timetable.");
  //       console.error(error);
  //     });
  // };
 
  const openModalForUpdate = (item) => {
    setNewTimetable(item);
    setIsUpdating(true);
    setModalVisible(true);
  };


  const handleDownloadTimetable = () => {
    const timetableData = timetables
      .filter(item => item.assigned) // Only include assigned timetables
      .map(item => `${item.subject} | ${item.time} | ${item.date}`)
      .join("\n");
  
    const path = FileSystem.documentDirectory + 'timetable.txt';
    
    FileSystem.writeAsStringAsync(path, timetableData)
      .then(() => {
        Alert.alert("Success", `Timetable saved to file!`);
        
        // Attempt to share the file
        if (Sharing.isAvailableAsync()) {
          Sharing.shareAsync(path);
        } else {
          Alert.alert("Sharing not available", "You can't share the file right now.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to save timetable.");
        console.error(error);
      });
  };
  

  const handleAssignTimetable = (id) => {
    setTimetables(prevTimetables => {
      const updatedTimetables = prevTimetables.map(item =>
        item._id === id ? { ...item, assigned: true } : item
      );
      const assignedTimetables = updatedTimetables.filter(item => item.assigned).map(item => item._id);
      
      // Use AsyncStorage instead of localStorage
      AsyncStorage.setItem('assignedTimetables', JSON.stringify(assignedTimetables));
      
      return updatedTimetables;
    });

    Alert.alert("Success", "Timetable has been assigned.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={isTeacher ? "Switch to Student View" : "Switch to Teacher View"}
          onPress={() => setIsTeacher(!isTeacher)}
          style={styles.toggleButton}
        />
        {isTeacher && (
          <Button
            title="Add Timetable"
            onPress={() => {
              setNewTimetable({ subject: "", time: "", date: "" });
              setIsUpdating(false);
              setModalVisible(true);
            }}
          />
        )}
      </View>

      {!isTeacher && (
        <View style={styles.addButtonContainer}>
          <Button
            title="Download Timetable"
            onPress={handleDownloadTimetable}
            style={styles.addButton}
          />
        </View>
      )}

      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          <ScrollView>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Subject</Text>
                <Text style={styles.tableHeaderText}>Time</Text>
                <Text style={styles.tableHeaderText}>Date</Text>
                {isTeacher && <Text style={styles.tableHeaderText}>Actions</Text>}
              </View>
              {timetables.filter(item => isTeacher ? true : item.assigned).map((item) => (
                <View key={item._id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.subject}</Text>
                  <Text style={styles.tableCell}>{item.time}</Text>
                  <Text style={styles.tableCell}>{item.date}</Text>
                  {isTeacher && (
                    <View style={styles.actions}>
                      <Button
                        title="Edit"
                        onPress={() => openModalForUpdate(item)}
                        color="blue"
                      />
                      <Button
                        title="Delete"
                        onPress={() => handleDeleteTimetable(item._id)}
                        color="red"
                      />
                      <Button
                        title="Assign"
                        onPress={() => handleAssignTimetable(item._id)}
                        color="green"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
              Add Timetable
          </Text>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={newTimetable.subject}
              onChangeText={(text) => setNewTimetable({ ...newTimetable, subject: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={newTimetable.time}
              onChangeText={(text) => setNewTimetable({ ...newTimetable, time: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={newTimetable.date}
              onChangeText={(text) => setNewTimetable({ ...newTimetable, date: text })}
            />
            <View style={styles.buttonContainer}>
              <Button
                title={loading ? "Saving..." : isUpdating ? "Update" : "Add"}
                onPress={isUpdating ? handleUpdateTimetable : handleAddTimetable}
                disabled={loading}
              />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
            </View>
          </View>
        </View>
      </Modal>

      {loading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
    marginTop: 3
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  toggleButton: {
    marginBottom: 16,
    gap: 2
  },
  addButtonContainer: { marginBottom: 16 },
  tableContainer: {
    width: "100%",
    overflowX: "auto", // Enable horizontal scrolling
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 1000, // Keep the width of the table large
    marginTop: 20
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderBottomWidth: 1,
   borderColor: "#ccc",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
 },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 200,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
   alignItems: "center",
   backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
   gap: 3,
    marginBottom: 12
  },
});

export default TimetableScreen;
