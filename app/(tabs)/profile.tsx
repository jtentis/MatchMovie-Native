import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { Pressable } from "expo-router/build/views/Pressable";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

type RootStackParamList = {
    "(auths)": { screen: "Login" };
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const EXPO_PUBLIC_BASE_NGROK = process.env.EXPO_PUBLIC_BASE_NGROK;

export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const token = SecureStore.getItemAsync("authToken");
    const [modalMessage, setModalMessage] = useState<string>("");
    const { userId } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Explicitly typed
    const [fontsLoaded] = useFonts({
        CoinyRegular: require("../../assets/fonts/Coiny-Regular.ttf"),
    });

    useEffect(() => {
        const fetchUserData = async () => {
          console.log("Starting fetchUserData...");
      
          const tokenBearer = await SecureStore.getItemAsync("authToken");
          console.log("Retrieved token:", tokenBearer);
      
          if (!userId) {
            console.log("User ID is missing.");
            setError("User ID is missing.");
            setIsLoading(false);
            return;
          }
      
          try {
            console.log("Fetching user data for userId:", userId);
      
            const response = await fetch(`${EXPO_PUBLIC_BASE_NGROK}/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${tokenBearer}`,
              },
            });
      
            console.log("Response status:", response.status);
      
            if (!response.ok) {
              throw new Error("Failed to fetch user data.");
            }
      
            const data = await response.json();
            setUser(data);
            console.log("Fetched user data:", data);
          } catch (err) {
            console.error("Error fetching user data:", err);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchUserData();
      }, [userId]);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!fontsLoaded) {
        return <Text>Loading fonts...</Text>;
    }

    const handleSaveProfile = async () => {
        console.log("user", user);
    };

    const handleLogout = async () => {
        try {
            console.log("token", token);

            await SecureStore.deleteItemAsync("authToken");
            console.log("token deleted");

            setModalMessage("Usuário desconectado com sucesso!");
            setModalType("success");
            setModalVisible(true);

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "(auths)" }],
                });
            }, 1500);
        } catch (error) {
            console.error("Erro ao desconectar:", error);

            setModalMessage("Erro ao desconectar usuário.");
            setModalType("error");
            setModalVisible(true);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.dark.background,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: "100%",
                    height: 80,
                    marginTop: "16%",
                    backgroundColor: Colors.dark.background,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingHorizontal: 16,
                }}
            >
                <ThemedText type="title">Perfil</ThemedText>
                <FontAwesome
                    size={22}
                    name="pencil"
                    color={"#FFFFFF"}
                    style={{
                        backgroundColor: "transparent",
                        position: "absolute",
                        right: 30,
                        top: 25,
                        borderRadius: 100,
                    }}
                />
            </View>
            <View
                style={{
                    flex: 4,
                    flexDirection: "column",
                    backgroundColor: Colors.dark.background,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={require("@/assets/images/foto_perfil.png")}
                ></Image>
                <ThemedText type="defaultSemiBold" style={{}}>
                    teste
                </ThemedText>
            </View>
            <View
                style={{
                    width: 360,
                    height: 160,
                    backgroundColor: Colors.dark.background,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Pressable style={styles.markAsBox}>
                    <ThemedText style={styles.fontMark}>FAVORITOS</ThemedText>
                    <ThemedText style={styles.fontQuant}>4</ThemedText>
                </Pressable>
                <Pressable style={styles.markAsBox}>
                    <ThemedText style={styles.fontMark}>ASSISTIDOS</ThemedText>
                    <ThemedText style={styles.fontQuant}>10</ThemedText>
                </Pressable>
            </View>
            <View
                style={{
                    flex: 3,
                    backgroundColor: Colors.dark.background,
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginBottom: 30,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: Colors.dark.background,
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <ThemedText type="default" style={{ color: "white" }}>
                        Nome
                    </ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Little Cachorrinho"
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: Colors.dark.background,
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <ThemedText type="default" style={{ color: "white" }}>
                        Usuário
                    </ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="little.cachorrinho"
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                    />
                </View>
            </View>
            <View
                style={{
                    flex: 1 / 2,
                    flexDirection: "row",
                    backgroundColor: Colors.dark.background,
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginBottom: 40,
                    gap: 10,
                }}
            >
                <Pressable style={styles.button}>
                    <ThemedText
                        type="defaultSemiBold"
                        onPress={handleSaveProfile}
                        style={{ color: "white" }}
                    >
                        Salvar Perfil
                    </ThemedText>
                </Pressable>
                <Pressable style={styles.button2} onPress={handleLogout}>
                    <ThemedText
                        type="defaultSemiBold"
                        style={{ color: "white" }}
                    >
                        Sair
                    </ThemedText>
                </Pressable>
                <AlertModal
                    type={modalType}
                    message={modalMessage}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
        marginTop: 5,
        color: Colors.dark.text,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 175,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 2,
    },
    button2: {
        justifyContent: "center",
        alignItems: "center",
        width: 175,
        height: 50,
        backgroundColor: Colors.dark.background,
        padding: 0,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark.tabIconSelected,
    },
    backButton: {
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.8,
        marginTop: 32,
    },
    markAsBox: {
        marginTop: 20,
        paddingVertical: 25,
        paddingHorizontal: 38,
        borderWidth: 1,
        borderColor: Colors.dark.tabIconSelected,
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
    },
    fontMark: {
        fontSize: 18,
        fontFamily: "CoinyRegular",
    },
    fontQuant: {
        fontSize: 16,
        fontFamily: "CoinyRegular",
        color: Colors.dark.tabIconSelected,
    },
});
