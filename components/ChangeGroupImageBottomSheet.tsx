import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { URL_LOCALHOST } from "@/constants/Url";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import React, { forwardRef, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import AlertModal from "./ModalAlert";
import ConfirmModal from "./ModalAlertConfirm";
import { ThemedText } from "./ThemedText";

type ChangeGroupBottomSheetProps = {
    groupId: number;
    currentName?: string;
    currentImage: string | null;
    onSave: (data: { name?: string; image?: string }) => void;
};

interface Group {
    id: number;
    name: string;
    image: string | null;
}

export const ChangeGroupBottomSheet = forwardRef<
    Modalize,
    ChangeGroupBottomSheetProps
>(({ groupId, currentName, currentImage, onSave }, ref) => {
    const [name, setName] = useState<string | any>(currentName);
    const [image, setImage] = useState<string | null>(currentImage);
    const [isSaving, setIsSaving] = useState(false);
    const { authToken, userId } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const navigation: any = useNavigation();
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );

    const pickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            setModalType("error");
            setModalMessage("É necessário permissão para acessar galeria!");
            setModalVisible(true);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.4,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const base64Image = `data:${result.assets[0].type};base64,${result.assets[0].base64}`;
                setImage(base64Image);
            } else {
                setModalType("error");
                setModalMessage("Nenhuma imagem selecionada!");
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            setModalType("error");
            setModalMessage("Ocorreu um erro ao selecionar imagem!");
            setModalVisible(true);
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);

        try {
            const data: { name?: string; image?: string } = {};
            if (name && name !== currentName) data.name = name;
            if (image && image !== currentImage) data.image = image;

            await onSave(data);

            setModalType("success");
            setModalMessage("Grupo atualizado com sucesso!");
            setModalVisible(true);
            // Do not close Modalize here
        } catch (error) {
            console.error("Error saving changes:", error);
            setModalType("error");
            setModalMessage("Erro ao atualizar imagem!");
            setModalVisible(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCloseAlert = () => {
        setModalVisible(false);
        (ref as React.MutableRefObject<Modalize>).current?.close();
    };

    const handleDeleteGroup = async () => {
        try {
            const response = await fetch(`${URL_LOCALHOST}/groups/${groupId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`, // Pass the token
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete group");
            }

            setModalType("success"); //modal de cofirmação só pra quem excluiu o grupo
            setModalMessage("Grupo excluido com sucesso!");
            setModalVisible(true);
            setTimeout(() => {
                (ref as React.MutableRefObject<Modalize>).current?.close();
            }, 2000);
        } catch (error) {
            console.error("Error deleting group:", error);
            setModalType("error");
            setModalMessage("Erro ao excluir o grupo!");
            setModalVisible(true);
        }
    };

    const handleCloseAlert = () => {
        setModalVisible(false);
        (ref as React.MutableRefObject<Modalize>).current?.close();
    };

    return (
        <Modalize
            ref={ref}
            adjustToContentHeight
            modalStyle={{ backgroundColor: "#343637" }}
            handleStyle={{
                width: 100,
                height: 5,
                marginTop: 30,
            }}
        >
            <Text style={styles.modalTitle}>
                Atualizar informações de grupo
            </Text>
            <View style={styles.modalContent}>
                {/* Existing UI for name and image */}
                <TextInput
                    style={styles.input}
                    placeholder="Digite o novo nome do grupo"
                    value={name}
                    onChangeText={setName}
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <View style={styles.imagePreview}>
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                            />
                        ) : (
                            <Text style={styles.image_placeholder}>
                                Nenhuma imagem selecionada
                            </Text>
                        )}
                    </View>
                    <View style={{ flex: 1, gap: 5 }}>
                        <Pressable style={styles.button} onPress={pickImage}>
                            <ThemedText
                                type={"defaultSemiBold"}
                                style={{ fontSize: Fonts.dark.buttonText }}
                            >
                                Escolha imagem
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            style={styles.button2}
                            onPress={saveChanges}
                            disabled={isSaving}
                        >
                            <ThemedText
                                type={"defaultSemiBold"}
                                style={{ fontSize: Fonts.dark.buttonText }}
                            >
                                {isSaving ? "Salvando..." : "Salvar"}
                            </ThemedText>
                        </Pressable>
                    </View>
                </View>
                <Pressable
                    style={[
                        styles.buttonDelete,
                        { backgroundColor: Colors.dark.tabIconSelected },
                    ]}
                    onPress={() => setConfirmDeleteVisible(true)}
                >
                    <ThemedText
                        type={"defaultSemiBold"}
                        style={{
                            fontSize: Fonts.dark.buttonText,
                            color: "white",
                        }}
                    >
                        Excluir Grupo
                    </ThemedText>
                </Pressable>
                <AlertModal
                    type={modalType}
                    message={modalMessage}
                    visible={modalVisible}
                    onClose={handleCloseAlert}
                />
                <ConfirmModal
                    type="alert"
                    visible={confirmDeleteVisible}
                    onConfirm={handleDeleteGroup}
                    onCancel={() => setConfirmDeleteVisible(false)}
                    message="Tem certeza que deseja excluir este grupo?"
                />
            </View>
        </Modalize>
    );
});

const styles = StyleSheet.create({
    modalContent: {
        gap: 40,
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
    imagePreview: {
        width: 200,
        height: 105,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 6,
        borderWidth: 1,
        borderColor: Colors.dark.tabIconSelected,
        borderRadius: 6,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    image_placeholder: {
        color: "white",
        flexWrap: "wrap",
        width: 100,
        textAlign: "center",
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 145,
        height: 50,
        backgroundColor: Colors.dark.background,
        borderColor: Colors.dark.tabIconSelected,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 2,
        fontSize: Fonts.dark.buttonText,
    },
    buttonDelete: {
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("screen").width - 40,
        height: 50,
        backgroundColor: Colors.dark.background,
        borderColor: Colors.dark.tabIconSelected,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 2,
        fontSize: Fonts.dark.buttonText,
    },
    button2: {
        justifyContent: "center",
        alignItems: "center",
        width: 145,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        borderRadius: 8,
        elevation: 2,
        fontSize: Fonts.dark.buttonText,
    },
});
