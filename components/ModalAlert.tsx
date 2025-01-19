import { Colors } from "@/constants/Colors";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface AlertModalProps {
    type: "error" | "success" | "alert";
    visible: boolean;
    onClose: () => void;
    message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
    type,
    visible,
    onClose,
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

    const getMessage = () => {
        switch (type) {
            case "error":
                return message;
            case "success":
                return message;
            case "alert":
                return message;
            default:
                return "";
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <MaterialIcons
                        name={getIcon()}
                        size={50}
                        color={getIconColor()}
                        style={styles.icon}
                    />
                    <Text style={styles.message}>{getMessage()}</Text>
                    <Text style={styles.buttonText} onPress={onClose}>
                        OK
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

export default AlertModal;

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
        marginBottom: 40,
        fontWeight: "500",
        color: Colors.dark.text,
    },
    button: {
        backgroundColor: "transparent",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: "flex-end",
    },
    buttonText: {
        color: Colors.dark.tabIconSelected,
        alignSelf:'flex-end',
        fontSize: 16,
        fontWeight: '700',
        padding: 20,
        position: 'absolute',
        bottom: 0,
        right: 5
    },
});
