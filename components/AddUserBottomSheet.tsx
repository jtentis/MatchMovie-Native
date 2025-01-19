import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { URL_LOCALHOST } from "@/constants/Url";
import React, { forwardRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Modalize } from "react-native-modalize";
import AlertModal from "./ModalAlert";
import { ThemedText } from "./ThemedText";

type AddUserBottomSheetProps = {
    groupId: number;
    onUserAdded: (newUser: any) => void;
};

export const AddUserBottomSheet = forwardRef<Modalize, AddUserBottomSheetProps>(
    ({ groupId, onUserAdded }, ref) => {
        const [username, setUsername] = useState("");
        const [isAdding, setIsAdding] = useState(false);
        const { authToken } = useAuth();
        const [modalVisible, setModalVisible] = useState(false);
        const [modalType, setModalType] = useState<
            "error" | "success" | "alert"
        >("alert");
        const [modalMessage, setModalMessage] = useState<string>("");

        const addUserToGroup = async () => {
            if (!username.trim()) {
                setModalType("error");
                setModalMessage("Digite um username!");
                setModalVisible(true);
                return;
            }

            try {
                setIsAdding(true);

                const userResponse = await fetch(
                    `${URL_LOCALHOST}/users/username/${username}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                if (!userResponse.ok) {
                    throw new Error("Username not found");
                }

                const {
                    id: userId,
                    name,
                    second_name,
                    user,
                } = await userResponse.json();

                const response = await fetch(
                    `${URL_LOCALHOST}/groups/${groupId}/users/${userId}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to add user to group");
                }

                const newUser = {
                    id: Date.now(),
                    userId,
                    groupId,
                    user: { id: userId, name, second_name, user },
                };

                onUserAdded(newUser);
                setUsername("");
                (ref as React.MutableRefObject<Modalize>).current?.close();
            } catch (error: any) {
                console.error("Error adding user to group:", error.message);
                alert(error.message);
            } finally {
                setIsAdding(false);
            }
        };

        return (
            <Modalize
                ref={ref}
                adjustToContentHeight
                childrenStyle={{ height: 200 }}
                modalStyle={{ backgroundColor: "#343637" }}
                handleStyle={{
                    width: 100,
                    height: 5,
                    marginTop: 30,
                }}
            >
                <Text style={styles.modalTitle}>
                    Adicionar pessoas no grupo
                </Text>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escreva o username do usuário"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                    />
                    <Pressable
                        style={styles.button}
                        onPress={addUserToGroup}
                        disabled={isAdding}
                    >
                        <ThemedText
                            type={"defaultSemiBold"}
                            style={{ fontSize: Fonts.dark.buttonText }}
                        >
                            {isAdding ? "Adicionando..." : "Adicionar"}
                        </ThemedText>
                    </Pressable>
                    <AlertModal
                    type={modalType}
                    message={modalMessage}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
                </View>
            </Modalize>
        );
    }
);

const styles = StyleSheet.create({
    modalContent: {
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        alignSelf: "center",
        marginTop: 40,
        color: "white",
    },
    input: {
        width: 350,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
        color: Colors.dark.text,
    },
    button: {
        right: 20,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        borderRadius: 8,
        elevation: 2,
        fontSize: Fonts.dark.buttonText,
    },
});
