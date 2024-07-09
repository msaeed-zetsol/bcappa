import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { errors } from "../redux/user/userSlice";
import { StackActions, useNavigation } from "@react-navigation/native";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "./axiosConfig";

type ApiError = {
  statusCode: number;
  error: string;
  message: string | Array<string>;
  timestamp: string;
  path: string;
};

/**
 * Type Parameter `O` refers to output/Response of the API call.
 * The response of an API call can be null or undefined.
 * `undefined` means that API hasn't finished yet.
 * `null` means API has finished executing but no valid response was returned.
 */
type useAxiosHook<O> = [
  data: O | null | undefined,
  start: () => void,
  abort: () => void
];

const useAxios = <O>(config: AxiosRequestConfig<any>): useAxiosHook<O> => {
  const [data, setData] = useState<O | null | undefined>(undefined);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // it can be used to cancel the API call
  const controller = useMemo(() => new AbortController(), []);

  const popUpToLogin = () => {
    AsyncStorage.removeItem("loginUserData");
    navigation.dispatch(
      StackActions.replace("AuthStack", {
        screen: "LoginScreen",
      })
    );
  };

  const handleAxiosError = (error: AxiosError<ApiError>) => {
    if (error.response) {
      const remoteMessage = error.response.data.message;
      let localMessage = null;
      if (typeof remoteMessage === "string") {
        localMessage = remoteMessage;
      } else {
        localMessage = remoteMessage.join(",");
      }
      dispatch(errors({ message: localMessage, value: true }));

      if (localMessage.includes("Unauthorized" || "User Does Not Exits.")) {
        popUpToLogin();
      }
    } else {
      dispatch(errors({ message: error.message, value: true }));
    }
  };

  const handleUnexpectedError = () => {
    dispatch(errors({ message: "Something went wrong.", value: true }));
    popUpToLogin();
  };

  const start = useCallback(() => {
    axiosInstance<O, AxiosResponse<O>>({ ...config, signal: controller.signal })
      .then((response) => setData(response.data))
      .catch((error) => {
        setData(null);
        if (axios.isAxiosError(error)) {
          handleAxiosError(error);
        } else {
          handleUnexpectedError();
        }
      });
  }, [config, controller]);

  return [data, start, () => controller.abort()];
};

export default useAxios;
