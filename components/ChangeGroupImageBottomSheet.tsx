import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Modalize } from "react-native-modalize";
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

    const pickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                "Permission Required",
                "Permission to access the gallery is required."
            );
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
                Alert.alert(
                    "No Image Selected",
                    "Please select an image to update."
                );
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert(
                "Error",
                "An error occurred while selecting the image."
            );
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);

        try {
            const data: { name?: string; image?: string } = {};
            if (name && name !== currentName) data.name = name;
            if (image && image !== currentImage) data.image = image;

            await onSave(data);

            Alert.alert("Success", "Group updated successfully!");
            (ref as React.MutableRefObject<Modalize>).current?.close();
        } catch (error) {
            console.error("Error saving changes:", error);
            Alert.alert("Error", "Failed to update the group.");
        } finally {
            setIsSaving(false);
        }
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
                <View style={{ flex: 1, flexDirection: "row", gap: 10, marginBottom: 30 }}>
                    <View style={styles.imagePreview}>
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                            />
                        ) : (
                            <Text style={styles.image_placeholder}> Nenhuma imagem selecionada</Text>
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
    image_placeholder:{
        color:'white',
        flexWrap:'wrap',
        width:100,
        textAlign:'center'
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
