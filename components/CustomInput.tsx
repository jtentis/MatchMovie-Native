import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    KeyboardTypeOptions,
    Pressable,
    StyleSheet,
    TextInput,
    TextInputProps,
    View
} from "react-native";
import { Colors } from "../constants/Colors"; // Ensure the import path is correct
import { ThemedText } from "./ThemedText";

type MaterialIconName = string;

interface CustomInputProps extends TextInputProps {
    label: string;
    icon: MaterialIconName;
    keyboardType?: KeyboardTypeOptions;
    isPassword?: boolean;
    togglePasswordVisibility?: () => void; // Function to toggle password visibility
    isPasswordVisible?: boolean; // Control visibility state
}

const CustomInput: React.FC<CustomInputProps> = ({ label, icon, isPassword, isPasswordVisible, togglePasswordVisibility, ...props }) => {
    return (
        <View style={styles.inputContainers}>
            <ThemedText type="default" style={styles.label}>{label}</ThemedText>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
                    secureTextEntry={isPassword ? !isPasswordVisible : false} // Toggle visibility for passwords
                    {...props}
                />
                {isPassword ? (
                    <Pressable onPress={togglePasswordVisibility}>
                        <MaterialIcons
                            name={isPasswordVisible ? "visibility" : "visibility-off"}
                            size={24}
                            color="#aaa"
                            style={styles.icon}
                        />
                    </Pressable>
                ) : (
                    <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={24} color="#aaa" style={styles.icon} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainers: {
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        color: "white",
        alignSelf: "flex-start",
        marginTop: 20,
        marginBottom: 3,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: Dimensions.get('window').width - 30,
        height: 50,
        backgroundColor: Colors.dark.input,
        paddingHorizontal: 15,
        borderRadius: 8,
        elevation: 2,
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
    },
    icon: {
        marginLeft: 10,
    },
});

export default CustomInput;
