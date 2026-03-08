import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTasks } from "../hooks/useTasks";
import { Todo } from "../api/todoService";
import { theme } from "../constants/theme";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  TaskDetail: { task: Todo };
};

const TaskDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, "TaskDetail">>();
  const task = route.params.task;
  const { toggleComplete, removeTask } = useTasks();
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme[colorScheme];

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {task.description}
      </Text>
      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: colors.text }]}>Priority:</Text>
        <Text
          style={{ color: theme.priority[task.priority], fontWeight: "bold" }}
        >
          {task.priority}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor:
              task.status === "Completed" ? colors.success : colors.warning,
          },
        ]}
        onPress={() => toggleComplete(task)}
      >
        <Text style={styles.toggleText}>
          {task.status === "Completed"
            ? "Mark as Pending"
            : "Mark as Completed"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("AddTask", { task })}
      >
        <Ionicons name="pencil" size={20} color="#fff" />
        <Text style={styles.buttonText}>Edit Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash" size={20} color="#fff" />
        <Text style={styles.buttonText}>Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: { fontWeight: "600" },
  toggleButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  toggleText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});

export default TaskDetailScreen;
