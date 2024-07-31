import { useCallback, useState } from "react";
import { errors } from "../redux/user/userSlice";
import { StackActions, useNavigation } from "@react-navigation/native";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "../axios/axiosConfig";
import { useAppDispatch } from "./hooks";
import { apply } from "../utilities/scope-functions";

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
  start: (config?: AxiosRequestConfig<any>) => AbortController,
  loading: boolean
];

type ErrorMessagesMap = Record<string, string>;

const errorMessage = (it: string | string[]) =>
  typeof it === "string" ? it : it.join(",");

const useAxios = <O>(
  url: string,
  method: Method | string,
  errorMap?: ErrorMessagesMap
): useAxiosHook<O> => {
  const [data, setData] = useState<O | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatcher = useAppDispatch();

  const navigateToLoginIf = useCallback(
    (isUnauthorized: boolean) => {
      if (isUnauthorized) {
        AsyncStorage.removeItem("loginUserData");
        navigation.dispatch(
          StackActions.replace("AuthStack", {
            screen: "LoginScreen",
          })
        );
      }
    },
    [navigation]
  );

  const dispatch = useCallback(
    (msg: string) => {
      dispatcher(errors({ message: msg, value: true }));
    },
    [dispatcher]
  );

  /**
   * Displays an error message to the user via a modal dialog.
   * Maps and displays the provided error messages if any are supplied.
   * If the API call is canceled, the function exits without displaying an error.
   *
   * @param {AxiosError} error - The error object caught from an Axios API call.
   */
  const handleAxiosError = (error: AxiosError<ApiError>) => {
    if (error.response) {
      apply(errorMessage(error.response.data.message), (it) => {
        if (it.includes("Duplicate entry")) {
          dispatch(
            "It looks like something went wrong on our side. Please try again in a little bit."
          );
        } else {
          dispatch(errorMap?.[it] ?? it);
        }
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

  const start = useCallback(
    (config?: AxiosRequestConfig<any>) => {
      const controller = new AbortController();
      setLoading(true);
      setData(undefined);
      axiosInstance<O, AxiosResponse<O>>({
        url: url,
        method: method,
        signal: controller.signal,
        ...config,
      })
        .then((response) => {
          setLoading(false);
          setData(response.data);
        })
        .catch((error) => {
          setLoading(false);
          setData(null);
          if (axios.isAxiosError(error)) {
            handleAxiosError(error);
          } else {
            handleUnexpectedError();
          }
        });
      return controller;
    },
    [url, method]
  );

  return [data, start, loading];
};

export default useAxios;
