import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useState } from "react";
import {
    Alert,
    Button,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Modalize } from "react-native-modalize";

type ChangeGroupBottomSheetProps = {
    groupId: number;
    currentName: string;
    currentImage: string | null;
    onSave: (data: { name?: string; image?: string }) => void;
};

export const ChangeGroupBottomSheet = forwardRef<
    Modalize,
    ChangeGroupBottomSheetProps
>(({ groupId, currentName, currentImage, onSave }, ref) => {
    const [name, setName] = useState<string>(currentName);
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
                marginTop: 10,
            }}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Group</Text>

                {/* Group Name Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter new group name"
                    value={name}
                    onChangeText={setName}
                />

                {/* Image Preview */}
                <View style={styles.imagePreview}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Text>No image selected</Text>
                    )}
                </View>

                {/* Buttons */}
                <Button title="Pick Image" onPress={pickImage} />
                <Button
                    title={isSaving ? "Saving..." : "Save Changes"}
                    onPress={saveChanges}
                    disabled={isSaving}
                />
            </View>
        </Modalize>
    );
});

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
        color: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 16,
        width: "100%",
        backgroundColor: "#fff",
    },
    imagePreview: {
        width: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 16,
    },
    image: { width: "100%", height: "100%", borderRadius: 8 },
});
