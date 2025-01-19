import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";

// Importação do AuthProvider
import SplashScreenLogo from "@/components/SplashScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./contexts/AuthContext";

// Impede a splash screen de desaparecer antes do carregamento dos assets
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    initialRouteName: "(tabs)/index",
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        CoinyRegular: require("../assets/fonts/Coiny-Regular.ttf"),
    });

    const [isSplashVisible, setSplashVisible] = useState(true);

    useEffect(() => {
        const hideSplashScreen = async () => {
            if (loaded) {
                await SplashScreen.hideAsync();
                setSplashVisible(false);
            }
        };
        hideSplashScreen();
    }, [loaded]);

    if (isSplashVisible) {
      return <SplashScreenLogo />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(auths)" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="details" />
                        <Stack.Screen name="groups" />
                        <Stack.Screen name="history" />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </ThemeProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
