import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";

const TimetableList = ({ timetables, onDelete, onUpdate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timetables</Text>
      <ScrollView horizontal contentContainerStyle={styles.tableWrapper}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Subject</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Time</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Actions</Text>
          </View>
          <FlatList
            data={timetables}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.subject}</Text>
                <Text style={styles.tableCell}>{item.time}</Text>
                <Text style={styles.tableCell}>{item.date}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.updateButton} onPress={() => onUpdate(item)}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item._id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window'); // Get screen width

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    width: '100%',
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  tableWrapper: {
    flexDirection: 'row',
    overflowX: 'scroll',
  },
  table: {
    minWidth: 600, // Ensures table doesn't shrink too much on smaller screens
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    paddingVertical: 4,
    minWidth: 100, // Minimum width for each column
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    width: 160, // Fixed width for actions column
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  }
});

export default TimetableList;
