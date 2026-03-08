import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../api/todoService";

interface TodoState {
  tasks: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  tasks: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Todo[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Todo>) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Todo>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.tasks[index] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} = todoSlice.actions;
export default todoSlice.reducer;
