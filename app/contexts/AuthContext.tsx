import * as SecureStore from "expo-secure-store";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextData {
  authToken: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const EXPO_PUBLIC_BASE_NGROK = process.env.EXPO_PUBLIC_BASE_NGROK;
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
    // setAuthToken(null);
    try {
      const response = await fetch(`${EXPO_PUBLIC_BASE_NGROK}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 201) {
        const data = await response.json();
        const { accessToken, userId } = data;

        await SecureStore.setItemAsync("authToken", accessToken);
        await SecureStore.setItemAsync("userId", userId.toString());

        // Update context state/
        setAuthToken(accessToken);
        setUserId(userId.toString());
      } else if (response.status == 404) {
        throw new Error("Erro de login. API não conectada!");
      } else{
        throw new Error("Erro de login. Verifique suas credenciais!");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userId");
    setAuthToken(null);
    setUserId(null);
  };

  const isAuthenticated = !!authToken;

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout, isAuthenticated }}>
      {children}
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
