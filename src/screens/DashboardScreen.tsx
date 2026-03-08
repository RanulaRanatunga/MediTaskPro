import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Dimensions,
} from "react-native";
import { useTasks } from "../hooks/useTasks";
import { theme } from "../constants/theme";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Todo } from "../api/todoService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect } from "react";
import { todoService } from "../api/todoService";
import { useDispatch } from "react-redux";
import { setTasks } from "../store/todoSlice";

const { width } = Dimensions.get("window");

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme[colorScheme];
  const {
    tasks,
    loading,
    fetchTasks,
    setSearchQuery,
    setFilterStatus,
    removeTask,
    allTasks,
  } = useTasks();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = todoService.subscribe((todos) => {
      dispatch(setTasks(todos));
    });
    return unsubscribe;
  }, []);

  const completed = allTasks.filter((t) => t.status === "Completed").length;
  const progress =
    allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => removeTask(id)}
    >
      <Ionicons name="trash" size={28} color="#fff" />
    </TouchableOpacity>
  );

  const renderTask = ({ item }: { item: Todo }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={[
          styles.taskCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => navigation.navigate("TaskDetail", { task: item })}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: theme.priority[item.priority] },
            ]}
          />
        </View>
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
        <Ionicons
          name={
            item.status === "Completed" ? "checkmark-circle" : "time-outline"
          }
          size={20}
          color={item.status === "Completed" ? colors.success : colors.warning}
          style={styles.statusIcon}
        />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Good Morning, Dr. Nimal
        </Text>
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline" size={18} color="#fff" />
            <Text style={styles.offlineText}>
              Offline – Changes will sync later
            </Text>
          </View>
        )}
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterRow}>
          {(["All", "Pending", "Completed"] as const).map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.filterChip}
              onPress={() => setFilterStatus(s)}
            >
              <Text style={{ color: colors.text }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Today’s Summary
          </Text>
          <Text style={[styles.summaryBig, { color: colors.primary }]}>
            {completed} / {allTasks.length} Completed
          </Text>
          <Text style={[styles.progressText, { color: colors.text }]}>
            Progress: {progress}%
          </Text>
          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchTasks} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks found</Text>
          }
        />
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("AddTask")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  greeting: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  offlineBanner: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  offlineText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
  searchInput: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 15 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  summaryCard: {
    backgroundColor: "#007AFF10",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  summaryTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  summaryBig: { fontSize: 32, fontWeight: "bold" },
  progressText: { fontSize: 16, marginTop: 8 },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: { height: "100%", backgroundColor: "#007AFF", borderRadius: 6 },
  taskCard: { padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  taskHeader: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "600", flex: 1 },
  description: { fontSize: 14, marginVertical: 8 },
  priorityDot: { width: 14, height: 14, borderRadius: 7 },
  statusIcon: { position: "absolute", top: 12, right: 12 },
  deleteAction: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16 },
});

export default DashboardScreen;
