import AsyncStorage from "@react-native-async-storage/async-storage";
import useAxios from "../../data/useAxios";
import { useEffect, useState } from "react";

export type SplashResponse = {
  id: number;
  image: string;
  endDate: string;
  statusBarColor: string | undefined;
};

type SplashState = SplashLoading | SplashFound | SplashNotFound;
export type UseSplashHook = SplashState;

type SplashFound = {
  splash: SplashResponse;
  status: "found";
};

type SplashNotFound = {
  splash: null;
  status: "not found";
};

type SplashLoading = {
  splash: undefined;
  status: "loading";
};

const initialSplashState: SplashLoading = {
  splash: undefined,
  status: "loading",
};

const KEY_SPLASH = "splash";

const findLocalSplash = async (): Promise<SplashResponse | null> => {
  const response = await AsyncStorage.getItem(KEY_SPLASH);
  if (response) {
    return JSON.parse(response);
  } else {
    return null;
  }
};

export const saveSplash = (response: SplashResponse) =>
  AsyncStorage.setItem(KEY_SPLASH, JSON.stringify(response));

const isSplashExpired = (response: SplashResponse): boolean =>
  new Date() > new Date(response.endDate);

const useSplash = (): UseSplashHook => {
  const [data, start] = useAxios<SplashResponse>("/splash-screen", "get");
  const [state, setState] = useState<SplashState>(initialSplashState);

  useEffect(() => {
    if (data === undefined) return;

    if (data === null) {
      setState({ splash: null, status: "not found" });
      return;
    }

    /**
     * This is an edge-case for splash.
     * When there are no records of splash in the database, or
     * an appropriate splash is not found, the API returns empty as a
     * successful response.
     * In this case, check if the response is in fact empty or not.
     */
    if (data) {
      saveSplash(data);
      setState({ splash: data, status: "found" });
    } else {
      setState({ splash: null, status: "not found" });
    }
  }, [data]);

  useEffect(() => {
    let abortController: AbortController | null = null;
    findLocalSplash().then((local) => {
      if (local) {
        if (isSplashExpired(local)) {
          abortController = start();
        } else {
          setState({ splash: local, status: "found" });
        }
      } else {
        abortController = start();
      }
    });

    return () => abortController?.abort();
  }, []);

  return state;
};

export default useSplash;
