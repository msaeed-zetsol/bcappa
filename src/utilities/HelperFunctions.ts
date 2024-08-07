import AsyncStorage from '@react-native-async-storage/async-storage';
import {IFilter, apiMiddleware} from '../interface/Interface';
import {BASE_API_URL, Content_Type} from '../constants/Base_Url';
import axios from 'axios';
import {errors} from '../redux/user/userSlice';

export const apimiddleWare = async (payload: apiMiddleware) => {
  const getUserData: any = await AsyncStorage.getItem('loginUserData');
  const userData = JSON.parse(getUserData);
  let url;
  if (payload.filterParams) {
    url = `${BASE_API_URL}${payload.url}?${filterToQueryString(
      payload.filterParams,
    )}`;
  } else {
    url = `${BASE_API_URL}${payload.url}`;
  }
  const axiosPayload: any = {
    url: url,
    method: payload.method,

    headers: {
      'Content-Type': payload.contentType
        ? payload.contentType
        : Content_Type.JSON,
    },
  };
  // ---------------------------------
  if (payload.data) {
    axiosPayload.data = payload.data;
  }

  if (userData && userData.sessionToken) {
    console.log({userData: userData.sessionToken});
    axiosPayload.headers = {
      ...axiosPayload.headers,
      Authorization: `Bearer ${userData.sessionToken}`,
    };
  }

  console.log('====================================');
  console.log({axiosPayload});
  console.log('====================================');

  try {
    const response = await axios(axiosPayload);

    return response.data;
  } catch (err: any) {
    console.log('errortype:', err);
    console.log(axios.isAxiosError(err));

    if (axios.isAxiosError(err) || err.response === undefined) {
      payload.reduxDispatch(errors({message: err.message, value: true}));
    }
    if (err.response.data) {
      const {message, error, statusCode} = err.response.data;
      console.log({message});
      console.log({error});
      console.log({statusCode});
      payload.reduxDispatch(errors({message: message, value: true}));

      if (message == 'Unauthorized' || message === 'User Does Not Exits.') {
        await AsyncStorage.removeItem('loginUserData');
        payload.navigation.replace('AuthStack', {
          screen: 'LoginScreen',
        });
      }
    }
  }
};

export const createFormData = (obj: any) => {
  const formData = new FormData();
  for (const key in obj) {
    if (!!(obj as any)[key]) {
      const dKey: any = (obj as any)[key];
      formData.append(key, dKey);
    }
  }

  return formData;
};

export const filterToQueryString = (filter: IFilter[]) => {
  return filter
    .map(f => {
      return `search=${f.field}::${f.type}::${f.value}`;
    })
    .join('&');
};

export const getFirstAndLastCharsUppercase = (input: string | undefined) => {
  if (input && input.length > 0) {
    if (input.length === 1) {
      // Special case: when the input is a single character, return it twice in uppercase
      const firstChar = input.toUpperCase();
      return firstChar;
    } else {
      const firstChar = input.charAt(0).toUpperCase();
      const lastChar = input.charAt(input.length - 1).toUpperCase();
      return firstChar + lastChar;
    }
  } else {
    return '';
  }
};

export const removeEmptyProperties = (obj: any): void => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  });
};
