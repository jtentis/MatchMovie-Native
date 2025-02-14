import * as Linking from "expo-linking";
import { Stack, useNavigation } from "expo-router";
import "react-native-reanimated";

import React, { useEffect } from "react";

export default function RootLayoutAuths({ navigation }: { navigation: any }) {
    navigation = useNavigation();

    useEffect(() => {
        const handleDeepLink = async ({ url }: { url: string }) => {
            if (!url) return;
            const { queryParams } = Linking.parse(url);
            if (queryParams?.token) {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: "ResetPassword",
                            params: { token: queryParams.token },
                        },
                    ],
                });
            }
        };

        const subscription = Linking.addEventListener("url", handleDeepLink);

        return () => subscription.remove();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen
                name="ResetPassword"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RequestPasswordReset"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
