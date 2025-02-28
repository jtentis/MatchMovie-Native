import Icon from "@/components/MatchLogo";
import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

const RequestPasswordReset = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalMessage, setModalMessage] = useState("");

    const handleRequestReset = async () => {
        if (!email.trim()) {
            setModalType("alert");
            setModalMessage(
                "Email e senha não podem conter espaços em branco."
            );
            setModalVisible(true);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `${URL_LOCALHOST}/auth/request-password-reset`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setModalType("success");
                setModalMessage(data.message);
                setModalVisible(true);
            } else {
                setModalType("error");
                setModalMessage(data.message);
                setModalVisible(true);
            }
        } catch (error) {
            setModalType("error");
            setModalMessage("Não foi possível enviar o email de recuperação.");
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <FontAwesome
                    size={30}
                    name="chevron-left"
                    color={Colors.dark.text}
                />
            </Pressable>
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
                <ThemedText type="title" style={styles.textLogo}>
                    Recuperação de senha
                </ThemedText>
            </View>
            <View>
                <ThemedText style={styles.text}>
                    Seu email para recuperação
                </ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu email"
                    value={email}
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <Pressable style={styles.button} onPress={handleRequestReset}>
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
        position:'absolute',
        top: 70,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.background,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    input: {
        height: 50,
        width: Dimensions.get("window").width - 30,
        backgroundColor: Colors.dark.input,
        marginBottom: 16,
        padding: 10,
        borderRadius: 8,
        elevation: 2,
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
    textLogo: {
        color: "white",
        alignSelf: "center",
        justifyContent: "center",
        width: Dimensions.get("screen").width / 1.2,
        textAlign: "center",
        fontFamily: "CoinyRegular",
        fontWeight: 400,
        fontSize: 46,
        marginTop: 20,
    },
});

export default RequestPasswordReset;
