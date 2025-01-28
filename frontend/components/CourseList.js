import React from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";


const CourseList = ({ courses, userRole, onUpdateCourse, onAddCourse }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id.toString()}
        ListHeaderComponent={userRole === "teacher" && (
          <View style={styles.addButtonContainer}>
            <Button title="Add Course" onPress={onAddCourse} />
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.description}</Text>
            {userRole === "teacher" && (
              <View style={styles.actionsCell}>
                <Button title="Update" onPress={() => onUpdateCourse(item)} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  tableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  tableCell: { flex: 1, textAlign: "center", fontSize: 14, color: "#333" },
  actionsCell: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButtonContainer: {
    marginBottom: 10,
    alignItems: "center",
    marginTop: 10,
  },
});

export default CourseList;
