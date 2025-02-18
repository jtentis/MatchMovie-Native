import CustomInput from "@/components/CustomInput";
import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardTypeOptions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Icon } from "../../components/MatchLogo";

const RegisterScreen = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalMessage, setModalMessage] = useState<string>("");
    const [formData, setFormData]: any = useState({
        name: "",
        second_name: "",
        user: "",
        email: "",
        password: "",
        cpf: "",
        location: "",
    });
    const [fontsLoaded] = useFonts({
        CoinyRegular: require("../../assets/fonts/Coiny-Regular.ttf"),
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleRegister = async () => {
        const { conf_password, ...dataToSend } = formData;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        const validateCPF = (cpf: string): boolean => {
            cpf = cpf.replace(/[^\d]+/g, "");

            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

            let sum = 0;
            let remainder;

            for (let i = 0; i < 9; i++)
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            remainder = (sum * 10) % 11;
            if (remainder >= 10) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(9))) return false;

            sum = 0;
            for (let i = 0; i < 10; i++)
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            remainder = (sum * 10) % 11;
            if (remainder >= 10) remainder = 0;
            return remainder === parseInt(cpf.charAt(10));
        };
        
        const validationRules = [
            {
                condition:
                    !formData.name ||
                    !formData.second_name ||
                    !formData.user ||
                    !formData.email ||
                    !formData.password ||
                    !formData.conf_password ||
                    !formData.cpf ||
                    !formData.location,
                message: "Todos os campos devem ser preenchidos!",
            },
            {
                condition:
                    typeof formData.name !== "string" ||
                    typeof formData.second_name !== "string",
                message: "Nome e sobrenome não devem conter números.",
            },
            {
                condition: !emailRegex.test(formData.email),
                message: "Endereço de email inválido.",
            },
            {
                condition: formData.password.length < 6,
                message: "Senha deve conter no mínimo 6 dígitos!",
            },
            {
                condition: formData.user.length < 4,
                message: "O nome de usuário deve conter no mínimo 4 dígitos!",
            },
            {
                condition: formData.password !== conf_password,
                message: "Senhas não coincidem!",
            },
            {
                condition: !validateCPF(formData.cpf),
                message: "CPF inválido!",
            },
        ];
        
        const failedValidation = validationRules.find((rule) => rule.condition);

        if (failedValidation) {
            setModalMessage(failedValidation.message);
            setModalType("error");
            setModalVisible(true);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${URL_LOCALHOST}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            // console.log(dataToSend);

            if (response.ok) {
                setModalMessage("Usuário criado com sucesso!");
                setModalType("success");
                setModalVisible(true);
                setTimeout(() => {
                    navigation.navigate("(auths)", { screen: "Login" });
                }, 500);
            } else {
                const errorData = await response.json();
                // console.log(errorData);

                if (errorData.message) {
                    setModalMessage(errorData.message);
                }

                setModalType("error");
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário.", error);
            setModalMessage("Erro ao cadastrar usuário.");
            setModalType("error");
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
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
                    {[
                        {
                            label: "Nome",
                            field: "name",
                            placeholder: "Digite seu nome",
                            icon: "person",
                        },
                        {
                            label: "Sobrenome",
                            field: "second_name",
                            placeholder: "Digite seu sobrenome",
                            icon: "person",
                        },
                        {
                            label: "Usuário",
                            field: "user",
                            placeholder: "Digite seu usuário",
                            icon: "account-circle",
                        },
                        {
                            label: "E-mail",
                            field: "email",
                            placeholder: "Digite seu e-mail",
                            icon: "email",
                            keyboardType:
                                "email-address" as KeyboardTypeOptions,
                        },
                        {
                            label: "Senha",
                            field: "password",
                            placeholder: "Digite sua senha",
                            icon: "lock",
                            isPassword: true,
                        },
                        {
                            label: "Confirmação de Senha",
                            field: "conf_password",
                            placeholder: "Confirme sua senha",
                            icon: "lock-outline",
                            isPassword: true,
                        },
                        {
                            label: "CPF",
                            field: "cpf",
                            placeholder: "Digite seu CPF",
                            icon: "badge",
                            keyboardType: "numeric" as KeyboardTypeOptions,
                        },
                        {
                            label: "Endereço (CEP)",
                            field: "location",
                            placeholder: "Digite seu CEP",
                            icon: "location-on",
                            keyboardType: "numeric" as KeyboardTypeOptions,
                        },
                    ].map(
                        ({ label, field, icon, isPassword, ...inputProps }) => (
                            <CustomInput
                                key={field}
                                label={label}
                                icon={icon}
                                value={formData[field]}
                                onChangeText={(value) =>
                                    handleChange(field, value)
                                }
                                isPassword={isPassword}
                                isPasswordVisible={isPasswordVisible}
                                togglePasswordVisibility={
                                    isPassword
                                        ? togglePasswordVisibility
                                        : undefined
                                }
                                {...inputProps}
                                {...inputProps}
                            />
                        )
                    )}

                    <Pressable style={styles.button} onPress={handleRegister}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ color: "#fff", fontSize: 16 }}>
                                Registrar
                            </Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
            <AlertModal
                type={modalType}
                visible={modalVisible}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
            />
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
    title: {
        fontFamily: "CoinyRegular",
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
    button: {
        width: "100%",
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 40,
    },
});
export default RegisterScreen;
