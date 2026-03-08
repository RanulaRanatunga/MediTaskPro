import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { getDb } from "../utils/firebaseConfig";
import NetInfo from "@react-native-community/netinfo";
import { store } from "../store";
import { setTasks, addTask, updateTask, deleteTask } from "../store/todoSlice";

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed";
  createdAt: string;
}

const getTodosRef = () => collection(getDb(), "todos");

async function isOnline() {
  const state = await NetInfo.fetch();
  return state.isConnected;
}

export const todoService = {
  getAll: async (): Promise<Todo[]> => {
    try {
      if (await isOnline()) {
        const snapshot = await getDocs(getTodosRef());
        const tasks = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Todo,
        );
        store.dispatch(setTasks(tasks));
        return tasks;
      } else {
        return store.getState().todo.tasks || [];
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  },
  getById: async (id: string): Promise<Todo> => {
    try {
      if (await isOnline()) {
        const docRef = doc(getDb(), "todos", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("Todo not found");
        return { id: docSnap.id, ...docSnap.data() } as Todo;
      } else {
        const localTasks = store.getState().todo.tasks || [];
        const todo = localTasks.find((t: Todo) => t.id === id);
        if (!todo) throw new Error("Todo not found offline");
        return todo;
      }
    } catch (error) {
      console.error("Error fetching todo:", error);
      throw error;
    }
  },
  create: async (todo: Omit<Todo, "id" | "createdAt">): Promise<Todo> => {
    try {
      const newTodo = {
        ...todo,
        createdAt: new Date().toISOString(),
      };
      const newRef = doc(getTodosRef());
      const id = newRef.id;
      const localTodo = { ...newTodo, id };
      store.dispatch(addTask(localTodo));
      if (await isOnline()) {
        await setDoc(newRef, newTodo);
        return localTodo;
      } else {
        return localTodo;
      }
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  },
  update: async (id: string, updates: Partial<Todo>): Promise<Todo> => {
    try {
      store.dispatch(updateTask({ id, changes: updates }));
      if (await isOnline()) {
        const docRef = doc(getDb(), "todos", id);
        await updateDoc(docRef, updates);
        const updatedSnap = await getDoc(docRef);
        return { id, ...updatedSnap.data() } as Todo;
      } else {
        const localTasks = store.getState().todo.tasks || [];
        const updatedTodo = localTasks.find((t: Todo) => t.id === id);
        return updatedTodo as Todo;
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      store.dispatch(deleteTask(id));
      if (await isOnline()) {
        const docRef = doc(getDb(), "todos", id);
        await deleteDoc(docRef);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  },
  subscribe: (callback: (todos: Todo[]) => void) => {
    return onSnapshot(
      getTodosRef(),
      (snapshot) => {
        const todos = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Todo,
        );
        store.dispatch(setTasks(todos));
        callback(todos);
      },
      (error) => {
        console.error("Snapshot error:", error);
      },
    );
  },
};
