import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Icon } from "./MatchLogo";

const SplashScreenLogo = () => {
    const [fontsLoaded] = useFonts({
        CoinyRegular: require("../assets/fonts/Coiny-Regular.ttf"),
    });

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    return (
        <View style={styles.container}>
            <Icon
                fill="#D46162"
                viewBox={"0 0 38 35"}
                width={204}
                height={200}
            />
            <Text style={styles.appName}>Match Movie</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
    },
    appName: {
        marginTop: 20,
        fontSize: 56,
        maxWidth: Dimensions.get('window').width / 1.7,
        textAlign: 'center',
        flexWrap:'wrap',
        color: "white",
        fontFamily: "CoinyRegular",
    },
});

export default SplashScreenLogo;
