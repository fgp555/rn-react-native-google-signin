// src\hooks\useGoogleSignInLogs2.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!;

export const useGoogleSignInLogs2 = () => {
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const addLog = (message: string, data?: any) => {
    const newLog = {
      timestamp: new Date().toISOString(),
      message,
      data: data ?? null,
    };
    setLogs((prev) => [...prev, newLog]);
    console.log(message, data || "");
  };

  useEffect(() => {
    GoogleSignin.configure({ webClientId, iosClientId, offlineAccess: true });
    addLog("✅ Google Signin configured", { webClientId, iosClientId });
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      addLog("🚀 Starting Google Sign-In");

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const resSignin = await GoogleSignin.signIn();

      if (!isSuccessResponse(resSignin)) {
        addLog("❌ Google Sign-In failed or cancelled", resSignin);
        return;
      }

      const { idToken, user } = resSignin.data;
      setGoogleUser(user);
      addLog("✅ Google user signed in", user);

      // Guardar solo datos locales para pruebas
      await AsyncStorage.multiSet([
        ["idToken", idToken ?? ""],
        ["userData", JSON.stringify(user)],
      ]);

      addLog("💾 Tokens and user stored locally", { idToken, user });
    } catch (error: any) {
      addLog("🔥 Google Sign-In error", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            addLog("User cancelled sign-in");
            break;
          case statusCodes.IN_PROGRESS:
            addLog("Sign-in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            addLog("Play services not available or outdated");
            break;
          default:
            addLog("Unknown Google Sign-In error", error.code);
        }
      }
    } finally {
      setLoadingGoogle(false);
      addLog("🏁 Google Sign-In process finished");
    }
  };

  const signOutGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      setGoogleUser(null);
      await AsyncStorage.multiRemove(["idToken", "userData"]);
      addLog("👋 Signed out from Google");
    } catch (error) {
      addLog("Error during Google sign-out", error);
    }
  };

  return { signInWithGoogle, signOutGoogle, googleUser, loadingGoogle, logs, setLogs };
};
