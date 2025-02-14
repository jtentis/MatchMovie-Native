import Icon from "@/components/MatchLogo";
import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const ResetPassword = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { token } = useLocalSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalMessage, setModalMessage] = useState("");

    const handleResetPassword = async () => {
        if (!newPassword.trim() || newPassword.length < 6) {
            setModalType("alert");
            setModalMessage("Sua nova senha deve ter pelo menos 6 caracteres.");
            setModalVisible(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setModalType("alert");
            setModalMessage("As senhas não coincidem. Tente novamente.");
            setModalVisible(true);
            return;
        }

        if (!token) {
            setModalType("error");
            setModalMessage("Token de recuperação inválido!");
            setModalVisible(true);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${URL_LOCALHOST}/auth/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, newPassword }),
                }
            );

            const data = await response.json();
            if (response.status == 201) {
                console.log(response);
                setModalType("success");
                setModalMessage(data.message);
                setModalVisible(true);
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: "(tabs)",
                                screen: "Login",
                            },
                        ],
                    });
                }, 1000);
            } else {
                setModalType("error");
                setModalMessage(data.message);
                setModalVisible(true);
            }
        } catch (error) {
            setModalType("error");
            setModalMessage("Não foi possível resetar sua senha.");
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: 16,
                }}
            >
                <Icon
                    width={150}
                    height={150}
                    fill={Colors.dark.tabIconSelected}
                />
            </View>

            <View>
                <ThemedText style={styles.text}>Nova senha</ThemedText>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua nova senha"
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        secureTextEntry={!passwordVisible}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <Pressable
                        style={styles.icon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                        <MaterialIcons
                            name={
                                passwordVisible
                                    ? "visibility"
                                    : "visibility-off"
                            }
                            size={24}
                            color={Colors.dark.text}
                        />
                    </Pressable>
                </View>

                <ThemedText style={styles.text}>Confirmar senha</ThemedText>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirme sua senha"
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        secureTextEntry={!passwordVisible}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <Pressable
                        style={styles.icon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                        <MaterialIcons
                            name={
                                passwordVisible
                                    ? "visibility"
                                    : "visibility-off"
                            }
                            size={24}
                            color={Colors.dark.text}
                        />
                    </Pressable>
                </View>

                <Pressable style={styles.button} onPress={handleResetPassword}>
                    <ThemedText
                        type={"defaultSemiBold"}
                        style={{ fontSize: 16 }}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ color: "#fff", fontSize: 16 }}>
                                Enviar
                            </Text>
                        )}
                    </ThemedText>
                </Pressable>

                <AlertModal
                    type={modalType}
                    visible={modalVisible}
                    message={modalMessage}
                    onClose={() => setModalVisible(false)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        gap: 50,
        padding: 16,
        backgroundColor: Colors.dark.background,
    },
    backButton: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.background,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 10,
        borderRadius: 8,
        color: Colors.dark.text,
    },
    text: {
        marginBottom: 5,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("window").width - 30,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 2,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.dark.input,
        borderRadius: 8,
        elevation: 2,
        height: 50,
        marginBottom: 16,
    },
    icon: {
        padding: 10,
    },
});

export default ResetPassword;
