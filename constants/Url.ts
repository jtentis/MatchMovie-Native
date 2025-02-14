import { EXPO_PUBLIC_URL_RAILWAY } from '@env';

import Constants from "expo-constants";

const uri =
    Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":3000")
export const URL_LOCALHOST = EXPO_PUBLIC_URL_RAILWAY;