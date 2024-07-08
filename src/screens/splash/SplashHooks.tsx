import AsyncStorage from "@react-native-async-storage/async-storage";
import { apimiddleWare } from "../../utilities/HelperFunctions";

export type SplashResponse = {
  id: number;
  image: string;
  endDate: string;
  statusBarColor: string | undefined;
};

const KEY_SPLASH = "splash";

const findSplash = async (): Promise<SplashResponse | null> => {
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

const fetchSplash = async (dispatch: any): Promise<SplashResponse | null> => {
  try {
    const response = await apimiddleWare({
      url: "/splash-screen",
      method: "get",
      reduxDispatch: dispatch,
    });

    if (response) {
      saveSplash(response);
      return response;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getSplash = async (dispatch: any) => {
  const local = await findSplash();
  if (local) {
    if (isSplashExpired(local)) {
      return fetchSplash(dispatch);
    } else {
      return local;
    }
  } else {
    return fetchSplash(dispatch);
  }
};
