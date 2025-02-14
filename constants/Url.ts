import Constants from "expo-constants";

// Define local and production URLs
const LOCAL_DEV_URL = `http://${Constants.expoConfig?.hostUri?.split(":").shift()}:3000`;
const PROD_URL = `https://matchmovie-api-production.up.railway.app`;

const isDev = __DEV__ || !process.env.EXPO_PUBLIC_EAS_BUILD_PROFILE;

// console.log("🚀 Expo Constants:", Constants.expoConfig);
// console.log("🌍 Expo Manifest2:", Constants.manifest2);
// console.log("🔧 EAS Build Profile:", process.env.EXPO_PUBLIC_EAS_BUILD_PROFILE);
// console.log("🛠 __DEV__ value:", __DEV__);
// console.log("✅ Using API URL:", isDev ? LOCAL_DEV_URL : PROD_URL);

export const URL_LOCALHOST = PROD_URL;
