import axios from "axios";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";

const BASE_URL = "https://60a21a08745cd70017576014.mockapi.io/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isOnline = (await NetInfo.fetch()).isConnected;
    if (!isOnline) {
      Toast.show({
        type: "error",
        text1: "No Internet Connection",
        text2: "Changes will sync when you are back online",
        position: "bottom",
      });
      return Promise.reject(error);
    }
    if (error.response?.status >= 500) {
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Please try again later",
      });
    } else if (error.code === "ECONNABORTED") {
      Toast.show({ type: "error", text1: "Request Timeout" });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
