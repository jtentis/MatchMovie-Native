import TinyModal from "@/components/ModalAlertTiny";
import { URL_LOCALHOST } from "@/constants/Url";
import * as SecureStore from "expo-secure-store";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextData {
    authToken: string | null;
    userId: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    handleTokenExpiration: () => void;
    showModal: (message: string) => void;
}

const EXPO_PUBLIC_BASE_NGROK = URL_LOCALHOST;
// const EXPO_PUBLIC_BASE_NGROK = process.env.EXPO_PUBLIC_BASE_NGROK;
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [modalText, setModalText] = useState<string>("");
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalBigVisible, setModalBigVisible] = useState(false);
    const [modalBigType, setModalBigType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalBigMessage, setModalBigMessage] = useState<string>("")

    const showModal = (message: string) => {
        setModalMessage(message);
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 1500);
    };

    useEffect(() => {
        const loadAuthData = async () => {
            const storedToken = await SecureStore.getItemAsync("authToken");
            const storedUserId = await SecureStore.getItemAsync("userId");

            if (storedToken && storedUserId) {
                setAuthToken(storedToken);
                setUserId(storedUserId);
            }
        };

        loadAuthData();
    }, []);

    const login = async (email: string, password: string) => {
        if (!email || !password) {
            setModalBigType("error");
            setModalBigMessage("Preencha todos os campos!");
            setModalBigVisible(true);
        }
        try {
            const response = await fetch(
                `${EXPO_PUBLIC_BASE_NGROK}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (response.status === 201) {
                const data = await response.json();
                const { accessToken, userId } = data;

                await SecureStore.setItemAsync("authToken", accessToken);
                await SecureStore.setItemAsync("userId", userId.toString());

                // atualizar context
                showModal("Login efetuado com sucesso!");
                setAuthToken(accessToken);
                setUserId(userId.toString());
            } else if (response.status == 404) {
                console.log(response);
                throw new Error("Erro de login. API não conectada!");
            } else {
                throw new Error("Erro de login. Verifique suas credenciais!");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const handleTokenExpiration = async () => {
        alert("Your session has expired. Please log in again.");
        logout();
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("userId");
        showModal("Logout efetuado com sucesso!");
        setAuthToken(null);
        setUserId(null);
    };

    const isAuthenticated = !!authToken;

    return (
        <AuthContext.Provider
            value={{
                authToken,
                userId,
                login,
                logout,
                isAuthenticated,
                handleTokenExpiration,
                showModal,
            }}
        >
            {children}
            {modalVisible && (
                <TinyModal
                    text={modalMessage}
                    onClose={() => setModalVisible(false)}
                />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
