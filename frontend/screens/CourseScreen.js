import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Button, Modal, TextInput, TouchableOpacity } from "react-native";
import CourseList from "../components/CourseList";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";


const CourseScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("student"); // Default role is student
  const [modalVisible, setModalVisible] = useState(false);
  const [courseData, setCourseData] = useState({ name: "", description: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetch("http://192.168.1.5:8000/api/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  const toggleRole = () => {
    setUserRole(userRole === "student" ? "teacher" : "student");
  };

  const handleAddCourse = () => {
    setIsUpdating(false);
    setCourseData({ name: "", description: "" }); // Clear form
    setModalVisible(true);
  };

  const handleUpdateCourse = (course) => {
    setIsUpdating(true);
    setSelectedCourse(course);
    setCourseData({ name: course.name, description: course.description });
    setModalVisible(true);
  };

  const playBeepSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/images/alert-sound.wav') // Replace with the correct path to your beep sound file
      );
      await sound.playAsync();
    };
  

  const handleSaveCourse = () => {
    // Check if course data is valid
    if (!courseData.name || !courseData.description) {
      alert("Please fill in both course name and description.");
      return;
    }

    if (isUpdating && selectedCourse) {
      // Update course logic here
      fetch(`http://192.168.1.5:8000/api/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(`Updated course: ${courseData.name}`);
          // Update the course list in frontend
          playBeepSound();
          setCourses((prevCourses) =>
            prevCourses.map((course) =>
              course._id === data._id ? data : course
            )
          );
        })
        .catch((error) => {
          console.error("Error updating course:", error);
          alert("Failed to update the course.");
        });
    } else {
      // Add course logic here
      fetch("http://192.168.1.5:8000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(`Added new course: ${courseData.name}`);
          // Update the course list in frontend
          setCourses((prevCourses) => [...prevCourses, data]);
        })
        .catch((error) => {
          console.error("Error adding course:", error);
          alert("Failed to add the course.");
        });
    }

    setModalVisible(false); // Close modal after action
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Courses</Text>
        <Button title={`Switch to ${userRole === "student" ? "Teacher" : "Student"}`} onPress={toggleRole} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <CourseList
          courses={courses}
          userRole={userRole}
          onAddCourse={handleAddCourse}
          onUpdateCourse={handleUpdateCourse}
        />
      )}

      {/* Modal for Add/Update Course */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isUpdating ? "Update Course" : "Add Course"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={courseData.name}
              onChangeText={(text) => setCourseData({ ...courseData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Course Description"
              value={courseData.description}
              onChangeText={(text) => setCourseData({ ...courseData, description: text })}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveCourse}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    width: "100%",
    marginTop: 7,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    width: "100%",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CourseScreen;
