import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../store";
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} from "../store/todoSlice";
import { todoService, Todo } from "../api/todoService";
import Toast from "react-native-toast-message";
import crashlytics from "@react-native-firebase/crashlytics";

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.todo,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Completed"
  >("All");

  const fetchTasks = async () => {
    try {
      dispatch(setLoading(true));
      const data = await todoService.getAll();
      dispatch(setTasks(data));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError("Failed to load tasks"));
      crashlytics().recordError(err as Error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createTask = async (newTask: Omit<Todo, "id" | "createdAt">) => {
    try {
      await todoService.create(newTask);
      Toast.show({ type: "success", text1: "Task created!" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to create task" });
      crashlytics().recordError(err as Error);
    }
  };

  const toggleComplete = async (task: Todo) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await todoService.update(task.id, { status: newStatus });
      Toast.show({
        type: "success",
        text1: newStatus === "Completed" ? "Task Completed!" : "Task Reopened",
      });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to update task" });
      crashlytics().recordError(err as Error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await todoService.delete(id);
      Toast.show({ type: "success", text1: "Task deleted" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to delete task" });
      crashlytics().recordError(err as Error);
    }
  };

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((t) => filterStatus === "All" || t.status === filterStatus);

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    fetchTasks,
    createTask,
    toggleComplete,
    removeTask,
  };
};
