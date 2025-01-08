import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useState } from "react";
import { Alert, KeyboardType, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Icon } from "../../components/MatchLogo";

const RegisterScreen = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const EXPO_PUBLIC_BASE_NGROK = process.env.EXPO_PUBLIC_BASE_NGROK;
    // const EXPO_PUBLIC_JWT_SECRET = process.env.EXPO_PUBLIC_JWT_SECRET;
    const [formData, setFormData]: any = useState({
        name: "",
        second_name: "",
        user: "",
        email: "",
        password: "",
        cpf: "",
        location: "",
        location_number: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle form submission
    const handleRegister = async () => {
        const { conf_password, ...dataToSend } = formData;

        // Basic validation
        if (
            !formData.name ||
            !formData.second_name ||
            !formData.email ||
            !formData.password ||
            !formData.conf_password ||
            !formData.cpf ||
            !formData.location ||
            !formData.location_number
        ) {
            Alert.alert("Error", "Todos os campos devem ser preenchidos.");
            return;
        }

        if (
            typeof formData.name !== "string" ||
            typeof formData.second_name !== "string"
        ) {
            Alert.alert(
                "Error",
                "Nome and Sobrenome não devem conter números."
            );
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert("Error", "Endereço de email inválido.");
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert("Error", "A senha deve conter 6 no mínimo dígitos.");
            return;
        }

        if (formData.password !== conf_password) {
            Alert.alert("Erro", "Senhas não coincidem.");
            return;
        }

        const validateCPF = (cpf: string): boolean => {
            cpf = cpf.replace(/[^\d]+/g, ""); // Remove non-numeric characters

            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
                return false; // Invalid CPF if it contains all identical digits
            }

            let sum = 0;
            let remainder;

            // Validate first checksum digit
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) {
                remainder = 0;
            }
            if (remainder !== parseInt(cpf.charAt(9))) {
                return false;
            }

            // Validate second checksum digit
            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) {
                remainder = 0;
            }
            if (remainder !== parseInt(cpf.charAt(10))) {
                return false;
            }

            return true;
        };

        if (!validateCPF(formData.cpf)) {
            Alert.alert("Erro", "CPF inválido.");
            return;
        }

        try {
            const response = await fetch(`${EXPO_PUBLIC_BASE_NGROK}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
            console.log(dataToSend);

            if (response.ok) {
                Alert.alert("Success", "User registered successfully!");
                navigation.navigate("(auths)", { screen: "login" });
            } else {
                const errorData = await response.json();
                Alert.alert(
                    "Error",
                    errorData.message || "Registration failed."
                );
                console.log(errorData);
            }
        } catch (error) {
            console.error("Error registering user:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    return (
        <>
            <View style={styles.header}>
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
                <View style={styles.iconContainer}>
                    <Icon
                        width={130}
                        height={130}
                        fill={Colors.dark.tabIconSelected}
                    />
                    <ThemedText type="default" style={styles.title}>
                        Registre-se!
                    </ThemedText>
                </View>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.formContainer}>
                    {}
                    {[
                        {
                            label: "Nome",
                            field: "name",
                            placeholder: "Digite seu nome",
                            keyboardType:"default"
                        },
                        {
                            label: "Sobrenome",
                            field: "second_name",
                            placeholder: "Digite seu sobrenome",
                            keyboardType:"default"
                        },
                        {
                            label: "Usuário",
                            field: "user",
                            placeholder: "Digite seu usuário",
                            keyboardType:"default"
                        },
                        {
                            label: "E-mail",
                            field: "email",
                            placeholder: "Digite seu e-mail",
                            keyboardType:"email-adress"
                        },
                        {
                            label: "Senha",
                            field: "password",
                            placeholder: "Digite sua senha",
                            secureTextEntry: true,
                        },
                        {
                            label: "Confirmação de Senha",
                            field: "conf_password",
                            placeholder: "Confirme sua senha",
                            secureTextEntry: true,
                        },
                        {
                            label: "CPF",
                            field: "cpf",
                            placeholder: "Digite seu CPF",
                            keyboardType:"numeric"
                        },
                    ].map(({ label, field, keyboardType, ...inputProps }) => (
                        <View key={field} style={styles.inputGroup}>
                            <ThemedText type="default" style={styles.label}>
                                {label}
                            </ThemedText>
                            <TextInput
                                style={styles.input}
                                value={formData[field]}
                                onChangeText={(value) =>
                                    handleChange(field, value)
                                }
                                keyboardType={keyboardType as KeyboardType}
                                selectionColor={Colors.dark.tabIconSelected}
                                placeholderTextColor={
                                    Colors.dark.textPlaceHolder
                                }
                                {...inputProps}
                            />
                        </View>
                    ))}

                    {}
                    <ThemedText
                        type="default"
                        style={styles.label}
                    >
                        Endereço
                    </ThemedText>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <TextInput
                            style={[styles.inputSmall, styles.size]}
                            selectionColor={Colors.dark.tabIconSelected}
                            value={formData.location}
                            onChangeText={(value) =>
                                handleChange("location", value)
                            }
                            placeholderTextColor={Colors.dark.textPlaceHolder}
                            placeholder="Digite seu Endereço"
                            keyboardType="default"
                        />
                        <TextInput
                            style={[styles.input, styles.inputFlex]}
                            value={formData.location_number}
                            onChangeText={(value) =>
                                handleChange("location_number", value)
                            }
                            placeholder="Número"
                            selectionColor={Colors.dark.tabIconSelected}
                            placeholderTextColor={Colors.dark.textPlaceHolder}
                            keyboardType="numeric"
                        />
                    </View>

                    {}
                    <Pressable style={styles.button} onPress={handleRegister}>
                        <ThemedText
                            type="defaultSemiBold"
                            style={styles.buttonText}
                        >
                            Registrar
                        </ThemedText>
                    </Pressable>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 2 / 4,
        flexDirection: "row",
        backgroundColor: Colors.dark.background,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 60,
        left: 0,
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.background,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    iconContainer: {
        alignItems: "center",
        marginTop: "10%",
    },
    inputSmall: {
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 10,
        color: Colors.dark.text,
    },
    size: {
        width: 240,
        height: 50,
    },
    title: {
        fontFamily: "Coiny-Regular",
        fontWeight: "400",
        fontSize: 32,
        padding: 20,
        color: Colors.dark.text,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    formContainer: {
        alignItems: "center",
        paddingHorizontal: 16,
    },
    inputGroup: {
        alignSelf: "stretch",
        marginVertical: 10,
    },
    label: {
        color: "white",
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        color: Colors.dark.text,
    },
    inputRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 10,
    },
    inputFlex: {
        flex: 1,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 40,
    },
    buttonText: {
        color: "white",
    },
});
export default RegisterScreen;
