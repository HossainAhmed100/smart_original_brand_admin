
import { decodedToken } from '@/utils/jwt';

import {
   getFromLocalStorage,
   removeFromLocalStorage,
   setToLocalStorage,
} from '@/utils/local-storage';

export const storeUserInfo = ({ accessToken }) => {
   return setToLocalStorage("access-token", accessToken);
};

export const getUserInfo = () => {
   const authToken = getFromLocalStorage("access-token");
   if (authToken) {
      const decodedData = decodedToken(authToken);
      return {
         ...decodedData,
         role: decodedData?.role?.toLowerCase(),
      };
   } else {
      return '';
   }
};

export const removeUser = () => {
   return removeFromLocalStorage("access-token");
};
