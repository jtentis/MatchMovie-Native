import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../contexts/AuthContext";

type RootStackParamList = {
    "(auths)": { screen: "Login" };
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// const EXPO_PUBLIC_BASE_NGROK = process.env.EXPO_PUBLIC_BASE_NGROK;
const EXPO_PUBLIC_BASE_NGROK = URL_LOCALHOST;

export default function ProfileScreen() {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const defaultImage = require("../../assets/images/no-image.png");
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [userUpdate, setUserUpdate] = useState(false);
    const [username, setUsername] = useState("");
    const [second_name, setSecond_name] = useState("");
    const [modalMessage, setModalMessage] = useState<string>("");
    const { userId, logout, handleTokenExpiration, authToken } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fontsLoaded] = useFonts({
        CoinyRegular: require("../../assets/fonts/Coiny-Regular.ttf"),
    });
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState<string>("");

    const fetchUserData = async () => {
        console.log("Token", authToken);

        if (!userId) {
            console.log("Sem ID");
            setError("Sem ID");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Pegando dados do usuário: ", userId);
            const response = await fetch(
                `${EXPO_PUBLIC_BASE_NGROK}/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            console.log("Status:", response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    handleTokenExpiration();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "(auths)" }],
                    });
                    return;
                }
                throw new Error("Failed to fetch user data.");
            }
            const data = await response.json();
            setUser(data);
            setProfilePicture(data.profilePicture);

            // console.log("Dados do usuário:", data);
            if (data.profilePicture) console.log("imagem aqui!");
        } catch (err) {
            console.error("Erro:", err);
            setError("Erro.");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    let isRefreshing = false;

    const onRefresh = () => {
        if (isRefreshing) {
            console.log("Already refreshing, skipping...");
            return;
        }

        isRefreshing = true;
        setRefreshing(true);
        fetchUserData().finally(() => {
            isRefreshing = false;
        });
    };

    const handleSaveProfile = async () => {
        if (!name.trim() && !username.trim() && !second_name.trim()) {
            setModalType("alert");
            setModalMessage("Preencha ao menos um campo para salvar.");
            setModalVisible(true);
            return;
        }

        setIsSaving(true);

        try {
            const updatedFields: any = {};
            if (name.trim()) updatedFields.name = name.trim();
            if (username.trim()) updatedFields.user = username.trim();
            if (second_name.trim())
                updatedFields.second_name = second_name.trim();
            const response = await fetch(
                `${EXPO_PUBLIC_BASE_NGROK}/users/${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json", // Ensure JSON content type
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(updatedFields),
                }
            );

            console.log("Response Status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error Response:", errorData);
                throw new Error(
                    errorData.message || "Falha ao salvar o perfil."
                );
            }

            // const updatedUser = await response.json();
            setName("");
            setUsername("");
            setSecond_name("");
            // setUser(updatedUser); // Update the UI with new user data
            setModalType("success");
            setModalMessage("Perfil salvo com sucesso.");
            setModalVisible(true);
        } catch (err) {
            console.error("Falha ao salvar o perfil.", err);
            setModalType("error");
            setModalMessage("Falha ao salvar o perfil.");
            setModalVisible(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            console.log("User logged out.");
            navigation.reset({
                index: 0,
                routes: [{ name: "(auths)" }],
            });
        } catch (error) {
            console.error("Logout error:", error);
            setModalType("error");
            setModalMessage("Erro ao deslogar, tente novamente!");
            setModalVisible(true);
        }
    };

    const pickImage = async () => {
        // Ask for permissions
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            setModalType("error");
            setModalMessage("Permissão para acessar galeria é necessária!");
            setModalVisible(true);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const base64Image = `data:${result.assets[0].type};base64,${result.assets[0].base64}`;
                setProfilePicture(base64Image);
                uploadProfilePicture(base64Image);
            } else {
                setModalType("error");
                setModalMessage("Nenhuma imagem selecionada!");
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            setModalType("error");
            setModalMessage("Erro ao selecionar imagem!");
            setModalVisible(true);
        }
    };

    const uploadProfilePicture = async (base64Image: string) => {
        try {
            const response = await fetch(
                `${EXPO_PUBLIC_BASE_NGROK}/users/${userId}/upload-profile-picture`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        profilePicture: base64Image,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload profile picture");
            }

            setModalType("success");
            setModalMessage("Imagem atualizada com sucesso!");
            setModalVisible(true);
        } catch (error) {
            console.error(error);
            setModalType("error");
            setModalMessage("Erro ao atualizar imagem!");
            setModalVisible(true);
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    if (error) {
        return (
            <View>
                <Text>{error}</Text>
            </View>
        );
    }

    const fullName: string =
        String(user.name).charAt(0).toUpperCase() +
        String(user.name).slice(1) +
        " " +
        String(user.second_name).charAt(0).toUpperCase() +
        String(user.second_name).slice(1);

    const favoriteCountLength = user.favorites.length || 0;
    const watchedCountLength = user.watched.length || 0;

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    style={styles.refresh}
                    colors={["#D46162"]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            contentContainerStyle={{
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
                <TouchableOpacity
                    onPress={pickImage}
                    style={{
                        backgroundColor: "transparent",
                        position: "absolute",
                        right: 30,
                        top: 25,
                        borderRadius: 100,
                    }}
                >
                    <FontAwesome size={22} name="pencil" color={"#FFFFFF"} />
                </TouchableOpacity>
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
                    source={
                        profilePicture ? { uri: profilePicture } : defaultImage
                    }
                    style={styles.profileImage}
                />
                <ThemedText type="defaultSemiBold" style={{}}>
                    {fullName}
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
                    <ThemedText style={styles.fontQuant}>
                        {favoriteCountLength}
                    </ThemedText>
                </Pressable>
                <Pressable style={styles.markAsBox}>
                    <ThemedText style={styles.fontMark}>ASSISTIDOS</ThemedText>
                    <ThemedText style={styles.fontQuant}>
                        {watchedCountLength}
                    </ThemedText>
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
                        flexDirection: "row",
                        backgroundColor: Colors.dark.background,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <View
                        style={{
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
                            style={styles.inputHalf}
                            placeholder={user.name}
                            value={name}
                            onChangeText={setName}
                            selectionColor={Colors.dark.tabIconSelected}
                            placeholderTextColor={Colors.dark.textPlaceHolder}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "column",
                            backgroundColor: Colors.dark.background,
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}
                    >
                        <ThemedText type="default" style={{ color: "white" }}>
                            Sobrenome
                        </ThemedText>
                        <TextInput
                            style={styles.inputHalf}
                            placeholder={user.second_name}
                            value={second_name}
                            onChangeText={setSecond_name}
                            selectionColor={Colors.dark.tabIconSelected}
                            placeholderTextColor={Colors.dark.textPlaceHolder}
                        />
                    </View>
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
                        placeholder={user.user}
                        value={username}
                        onChangeText={setUsername}
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
                <Pressable
                    style={styles.button}
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                >
                    <ThemedText
                        type="defaultSemiBold"
                        style={{ color: "white" }}
                    >
                        {isSaving ? "Salvando..." : "Salvar perfil"}
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
                {/* {showModal && <TinyModal text={modalText} />} */}
            </View>
        </ScrollView>
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
    profileImage: {
        width: 180,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#ccc",
        borderWidth: 1,
        borderColor: Colors.dark.tabIconSelected
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    inputHalf: {
        width: 175,
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
        paddingHorizontal: 40,
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
    refresh: {
        color: Colors.dark.tabIconSelected,
        backgroundColor: Colors.dark.input,
    },
});
