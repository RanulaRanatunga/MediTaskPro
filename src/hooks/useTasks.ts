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
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createTask = async (newTask: Omit<Todo, "id" | "createdAt">) => {
    try {
      const task = await todoService.create(newTask);
      dispatch(addTask(task));
      Toast.show({ type: "success", text1: "Task created!" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to create task" });
    }
  };

  const toggleComplete = async (task: Todo) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      const updated = await todoService.update(task.id, { status: newStatus });
      dispatch(updateTask(updated));
      Toast.show({
        type: "success",
        text1:
          newStatus === "Completed" ? "Task Completed! 🎉" : "Task Reopened",
      });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to update task" });
    }
  };

  const removeTask = async (id: string) => {
    try {
      await todoService.delete(id);
      dispatch(deleteTask(id));
      Toast.show({ type: "success", text1: "Task deleted" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to delete task" });
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
