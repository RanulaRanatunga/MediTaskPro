import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "@/src/screens/DashboardScreen";
import AddTaskScreen from "@/src/screens/AddTaskScreen";
import TaskDetailScreen from "@/src/screens/TaskDetailScreen";
import { Todo } from "@/src/api/todoService";

type RootStackParamList = {
  Dashboard: undefined;
  AddTask: { task?: Todo } | undefined;
  TaskDetail: { task: Todo };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "MediTask Pro" }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: "New Task" }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: "Task Detail" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
