import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { useColorScheme } from "react-native";
import React from "react";
import crashlytics from "@react-native-firebase/crashlytics";

if (!__DEV__) {
  crashlytics().setCrashlyticsCollectionEnabled(true);
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
