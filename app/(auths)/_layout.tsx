import { Stack } from 'expo-router';
import 'react-native-reanimated';

import React from 'react';

export const unstable_settings = {
  initialRouteName: "login",
};

export default function RootLayoutAuths() {

  return (
    <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
