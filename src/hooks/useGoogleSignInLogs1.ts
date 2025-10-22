// src\hooks\useGoogleSignInLogs1.ts
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!;

export interface GoogleUser {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string;
}

GoogleSignin.configure({ webClientId, iosClientId, offlineAccess: true });

export function useGoogleSignInLogs1() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string>("🪵 Logs will appear here");
  const [token, setToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  const appendLog = (label: string, data: any) => {
    const json = JSON.stringify(data, Object.getOwnPropertyNames(data), 2);
    setLogs((prev) => `${prev}\n\n${label}:\n${json}`);
  };

  const clearLogs = () => setLogs("🪵 Logs will appear here");

  // 🔹 Verificar sesión activa al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        appendLog("Current user", currentUser);
      }
    };
    loadUser();
  }, []);

  // 🔹 Iniciar sesión con Google
  const signIn = async () => {
    try {
      setLoading(true);
      setLogs("⏳ Signing in...");

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      setToken(tokens.accessToken);
      appendLog("Full response", response);

      if (isSuccessResponse(response)) {
        setUser(response.data);
        setGoogleUser(response.data.user as GoogleUser);
        appendLog("Sign-in successful", response.data);
      } else {
        appendLog("Sign-in canceled", response);
      }
    } catch (error: any) {
      appendLog("Sign-in error", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            appendLog("SIGN_IN_CANCELLED", error);
            break;
          case statusCodes.IN_PROGRESS:
            appendLog("IN_PROGRESS", error);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            appendLog("PLAY_SERVICES_NOT_AVAILABLE", error);
            break;
          default:
            appendLog("Unknown error", error);
        }
      } else {
        appendLog("General error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener perfil actual
  const getProfile = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setGoogleUser(currentUser.user as GoogleUser);
        appendLog("Profile fetched", currentUser);
      } else {
        appendLog("No active session", {});
      }
    } catch (error) {
      appendLog("Error fetching profile", error);
    }
  };

  // 🔹 Cerrar sesión
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      appendLog("Signed out successfully", { ok: true });
    } catch (error) {
      appendLog("Error signing out", error);
    }
  };

  return {
    user,
    loading,
    logs,
    token,
    googleUser,
    signIn,
    getProfile,
    signOut,
    clearLogs,
  };
}
