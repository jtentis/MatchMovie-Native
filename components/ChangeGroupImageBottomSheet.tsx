import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { Modalize } from "react-native-modalize";
import AlertModal from "./ModalAlert";
import { ThemedText } from "./ThemedText";

type ChangeGroupBottomSheetProps = {
    groupId: number;
    currentName?: string;
    currentImage: string | null;
    onSave: (data: { name?: string; image?: string }) => void;
};

export const ChangeGroupBottomSheet = forwardRef<
    Modalize,
    ChangeGroupBottomSheetProps
>(({ groupId, currentName, currentImage, onSave }, ref) => {
    const [name, setName] = useState<string | any>(currentName);
    const [image, setImage] = useState<string | null>(currentImage);
    const [isSaving, setIsSaving] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");
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

    const handleCloseAlert = () => {
        setModalVisible(false);
        // Close the Modalize when the alert is closed
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
                        marginBottom: 30,
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
                                {" "}
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
                <AlertModal
                    type={modalType}
                    message={modalMessage}
                    visible={modalVisible}
                    onClose={handleCloseAlert} // Close the Modalize when alert is closed
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
