import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../App";

const todosRef = collection(db, "todos");

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed";
  createdAt: string;
}

export const todoService = {
  getAll: async (): Promise<Todo[]> => {
    try {
      const snapshot = await getDocs(todosRef);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Todo,
      );
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  },
  getById: async (id: string): Promise<Todo> => {
    try {
      const docRef = doc(db, "todos", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Todo not found");
      return { id: docSnap.id, ...docSnap.data() } as Todo;
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
      const docRef = await addDoc(todosRef, newTodo);
      return { id: docRef.id, ...newTodo };
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  },
  update: async (id: string, updates: Partial<Todo>): Promise<Todo> => {
    try {
      const docRef = doc(db, "todos", id);
      await updateDoc(docRef, updates);
      return { id, ...updates } as Todo; // Partial, but assuming caller provides needed fields
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, "todos", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  },
  subscribe: (callback: (todos: Todo[]) => void) => {
    return onSnapshot(todosRef, (snapshot) => {
      const todos = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Todo,
      );
      callback(todos);
    });
  },
};

// import axiosInstance from "./axiosInstance";

// export interface Todo {
//   id: string;
//   title: string;
//   description: string;
//   priority: "Low" | "Medium" | "High";
//   status: "Pending" | "Completed";
//   createdAt: string;
// }

// export const todoService = {
//   getAll: async (): Promise<Todo[]> => {
//     const response = await axiosInstance.get<Todo[]>("/todo");
//     return response.data;
//   },

//   getById: async (id: string): Promise<Todo> => {
//     const response = await axiosInstance.get<Todo>(`/todo/${id}`);
//     return response.data;
//   },

//   create: async (todo: Omit<Todo, "id" | "createdAt">): Promise<Todo> => {
//     const response = await axiosInstance.post<Todo>("/todo", {
//       ...todo,
//       createdAt: new Date().toISOString(),
//     });
//     return response.data;
//   },

//   update: async (id: string, todo: Partial<Todo>): Promise<Todo> => {
//     const response = await axiosInstance.put<Todo>(`/todo/${id}`, todo);
//     return response.data;
//   },

//   delete: async (id: string): Promise<void> => {
//     await axiosInstance.delete(`/todo/${id}`);
//   },
// };
