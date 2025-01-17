import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon } from "../../components/MatchLogo";
import { useAuth } from "../contexts/AuthContext";

const EXPO_PUBLIC_BASE_NGROK = process.env.EXPO_PUBLIC_BASE_NGROK;

type RootStackParamList = {
    register: undefined;
    "(tabs)": { screen: string };
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

//TODO: CONSERTAR COMPORTAMENTO DA DIV DOS BOTOES DE LOGIN COM O TECLADO

const LoginScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalMessage, setModalMessage] = useState("");
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const [fontsLoaded] = useFonts({
        CoinyRegular: require("../../assets/fonts/Coiny-Regular.ttf"),
    });

    if (!fontsLoaded) {
        return <Text>Loading fonts...</Text>;
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setModalType("alert");
            setModalMessage(
                "Email e senha não podem conter espaços em branco."
            );
            setModalVisible(true);
        }else{
            try {
                await login(email, password);
                console.log("Login feito com sucesso!");
    
                navigation.reset({
                    index: 0,
                    routes: [{ name: "(tabs)" }],
                });
            } catch (error: any) {
                console.error("Login error:", error);
                Alert.alert("Login Error", error.message || "Erro inesperado!");
            }
        }

    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
                backgroundColor: Colors.dark.background,
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: 16,
                    marginTop: 100,
                    backgroundColor: Colors.dark.background,
                }}
            >
                <Icon
                    width={150}
                    height={150}
                    fill={Colors.dark.tabIconSelected}
                />
                <ThemedText type="title" style={styles.textLogo}>
                    Match Movie
                </ThemedText>
            </View>
            <View style={styles.container}>
                <ThemedText
                    type="default"
                    style={{ color: "white", alignSelf: "flex-start" }}
                >
                    E-mail
                </ThemedText>
                <View style={styles.inputContainers}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        value={email}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <MaterialIcons
                        name={"person"}
                        size={24}
                        color="#aaa"
                        style={styles.icon}
                    />
                </View>
                <ThemedText
                    type="default"
                    style={{
                        color: "white",
                        alignSelf: "flex-start",
                        marginTop: 10,
                    }}
                >
                    Senha
                </ThemedText>
                <View style={styles.inputContainers}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        value={password}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    ></TextInput>
                    <MaterialCommunityIcons
                        name={showPassword ? "eye" : "eye-off"}
                        size={24}
                        color="#aaa"
                        style={styles.icon}
                        onPress={toggleShowPassword}
                    />
                </View>
                <View
                    style={{
                        flex: 1 / 2,
                        flexDirection: "column",
                        backgroundColor: Colors.dark.background,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Pressable onPress={handleLogin} style={styles.buttonLogin}>
                        <ThemedText
                            type={"defaultSemiBold"}
                            style={{ fontSize: 16 }}
                        >
                            Login
                        </ThemedText>
                    </Pressable>
                    <AlertModal
                        type={modalType}
                        visible={modalVisible}
                        message={modalMessage}
                        onClose={() => setModalVisible(false)}
                    />
                    <Pressable
                        onPress={() => navigation.navigate("register")}
                        style={styles.buttonRegister}
                    >
                        <ThemedText
                            type={"defaultSemiBold"}
                            style={{ fontSize: 16 }}
                        >
                            Criar Conta
                        </ThemedText>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: Colors.dark.background,
        gap: 5,
    },
    icon: {
        position: "absolute",
        right: 0,
        paddingHorizontal: "5%",
    },
    inputContainers: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 0,
        textAlign: "center",
    },
    input: {
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
        color: Colors.dark.text,
    },
    buttonLogin: {
        justifyContent: "center",
        alignItems: "center",
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 2,
        marginTop: 100,
    },
    buttonRegister: {
        justifyContent: "center",
        alignItems: "center",
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.background,
        padding: 0,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark.tabIconSelected,
    },
    textLogo: {
        color: "white",
        alignSelf: "center",
        justifyContent: "center",
        width: 130,
        textAlign: "center",
        backgroundColor: Colors.dark.background,
        fontFamily: "CoinyRegular",
        fontWeight: 400,
        fontSize: 46,
    },
});

export default LoginScreen;
