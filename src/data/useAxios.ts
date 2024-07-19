import { useCallback, useState } from "react";
import { errors } from "../redux/user/userSlice";
import { StackActions, useNavigation } from "@react-navigation/native";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "./axiosConfig";
import { useAppDispatch } from "../hooks/hooks";
import { apply } from "../scope-functions";

type ApiError = {
  statusCode: number;
  error: string;
  message: string | string[];
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
  start: () => AbortController
];

const errorMessage = (it: string | string[]) =>
  typeof it === "string" ? it : it.join(",");

const useAxios = <O>(config: AxiosRequestConfig<any>): useAxiosHook<O> => {
  const [data, setData] = useState<O | null | undefined>(undefined);
  const navigation = useNavigation();
  const dispatcher = useAppDispatch();

  const navigateToLoginIf = (isUnauthorized: boolean) =>
    useCallback(() => {
      if (isUnauthorized) {
        AsyncStorage.removeItem("loginUserData");
        navigation.dispatch(
          StackActions.replace("AuthStack", {
            screen: "LoginScreen",
          })
        );
      }
    }, [navigation]);

  const dispatch = (msg: string) =>
    useCallback(() => {
      dispatcher(errors({ message: msg, value: true }));
    }, [dispatcher]);

  const handleAxiosError = (error: AxiosError<ApiError>) => {
    if (error.response) {
      apply(errorMessage(error.response.data.message), (it) => {
        dispatch(it);
        navigateToLoginIf(
          it.includes("Unauthorized" || "User Does Not Exits.")
        );
      });
    } else {
      dispatch(error.message);
    }
  };

  const handleUnexpectedError = () => {
    dispatch("Something went wrong.");
    navigateToLoginIf(true);
  };

  const start = useCallback(() => {
    const controller = new AbortController();
    setData(undefined);
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
    return controller;
  }, [config]);

  return [data, start];
};

export default useAxios;
