import { Colors } from "@/constants/Colors";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface ConfirmModalProps {
    type: "error" | "success" | "alert";
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    type,
    visible,
    onConfirm,
    onCancel,
    message,
}) => {
    const getIcon = () => {
        switch (type) {
            case "error":
                return "error-outline";
            case "success":
                return "check-circle-outline";
            case "alert":
                return "warning-amber";
            default:
                return "info";
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "error":
                return "#FF0000"; // Red for error
            case "success":
                return "#4CAF50"; // Green for success
            case "alert":
                return "#FFC107"; // Amber for alert
            default:
                return "#000000"; // Default black
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <MaterialIcons
                        name={getIcon()}
                        size={50}
                        color={getIconColor()}
                        style={styles.icon}
                    />
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.yesButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonText}>Sim</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.noButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonText}>Não</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
        width: "80%",
        backgroundColor: "#434343",
        borderRadius: 10,
        padding: 20,
        paddingHorizontal: 30,
        alignItems: "center",
    },
    icon: {
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "500",
        color: Colors.dark.text,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        alignItems: "center",
    },
    yesButton: {
        backgroundColor: Colors.dark.tabIconSelected,
        marginRight: 5,
    },
    noButton: {
        backgroundColor: Colors.dark.input,
        marginLeft: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
