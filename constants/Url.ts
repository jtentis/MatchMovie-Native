import Constants from "expo-constants";

const uri =
    Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":3000")
export const URL_LOCALHOST = `http://${uri}`;