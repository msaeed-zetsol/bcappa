import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apply } from "../scope-functions";

export const axiosInstance = axios.create({
  baseURL: "http://bcappa-dev-apis.us-east-1.elasticbeanstalk.com/api",
  // baseURL: "http://192.168.100.53:8000/api",
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
