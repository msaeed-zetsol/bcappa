import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://bcappa-dev-apis.us-east-1.elasticbeanstalk.com/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
  const userJSON = await AsyncStorage.getItem("loginUserData");
  if (userJSON) {
    const user = JSON.parse(userJSON);
    config.headers.Authorization = `Bearer ${user.sessionToken}`;
  }
  return config;
});
