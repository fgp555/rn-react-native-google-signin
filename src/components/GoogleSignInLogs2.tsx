import { useGoogleSignInLogs2 } from "@/src/hooks/useGoogleSignInLogs2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Alert, Button, ScrollView, Text, View } from "react-native";

export default function GoogleSignInLogs2() {
  const { signInWithGoogle, signOutGoogle, googleUser, loadingGoogle, logs, setLogs } = useGoogleSignInLogs2();
  const [storedUser, setStoredUser] = useState<any>(null);
  const [tokens, setTokens] = useState({ accessToken: "", refreshToken: "" });

  const getStoredData = async () => {
    try {
      const [idToken, userData] = await AsyncStorage.multiGet(["idToken", "userData"]);
      setTokens({
        accessToken: idToken[1] || "",
        refreshToken: "", // no se usa
      });
      setStoredUser(userData[1] ? JSON.parse(userData[1]) : null);
    } catch (error) {
      console.error("Error getting stored data:", error);
    }
  };

  useEffect(() => {
    getStoredData();
  }, [googleUser]);

  const login = async () => {
    await signInWithGoogle();
    await getStoredData();
  };

  const logout = async () => {
    await signOutGoogle();
    await getStoredData();
  };

  // 🟢 Copiar logs al portapapeles
  const copyLogs = async () => {
    const logText = logs.length ? JSON.stringify(logs, null, 2) : "No logs yet";
    await Clipboard.setStringAsync(logText);
    Alert.alert("✅ Copiado", "Los logs se copiaron al portapapeles");
  };

  // 🔴 Limpiar logs
  const clearLogs = () => {
    setLogs([]); // usando el setter del hook
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#111" }}
      contentContainerStyle={{ alignItems: "center", padding: 20 }}
    >
      <Text style={{ color: "#fff", fontSize: 22, marginBottom: 10 }}>🔹 Test Google Sign-In Hook</Text>

      <Button
        title={loadingGoogle ? "Connecting..." : "Sign in with Google"}
        onPress={login}
        disabled={loadingGoogle}
      />

      <View style={{ height: 10 }} />

      <Button title="Sign out" color="#d9534f" onPress={logout} />

      <View style={{ height: 20 }} />

      <Button title="🔄 Refresh stored data" onPress={getStoredData} />

      <View style={{ marginTop: 20, width: "100%", backgroundColor: "#222", padding: 10, borderRadius: 8 }}>
        <Text style={{ color: "#0f0", fontSize: 16 }}>🧠 Google User:</Text>
        <Text style={{ color: "#ccc", fontSize: 14 }}>
          {googleUser ? JSON.stringify(googleUser, null, 2) : "No Google user loaded"}
        </Text>
      </View>

      <View style={{ marginTop: 20, width: "100%", backgroundColor: "#222", padding: 10, borderRadius: 8 }}>
        <Text style={{ color: "#0ff", fontSize: 16 }}>📦 Stored User:</Text>
        <Text style={{ color: "#ccc", fontSize: 14 }}>
          {storedUser ? JSON.stringify(storedUser, null, 2) : "No stored user"}
        </Text>
      </View>

      <View style={{ marginTop: 20, width: "100%", backgroundColor: "#333", padding: 10, borderRadius: 8 }}>
        <Text style={{ color: "#ff0", fontSize: 16 }}>🔑 Tokens:</Text>
        <Text style={{ color: "#ccc", fontSize: 14 }}>Access: {tokens.accessToken || "N/A"}</Text>
        <Text style={{ color: "#ccc", fontSize: 14 }}>Refresh: {tokens.refreshToken || "N/A"}</Text>
      </View>

      {/* 🟣 Logs + botones copiar / limpiar */}
      <View style={{ marginTop: 20, width: "100%", backgroundColor: "#444", padding: 10, borderRadius: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 16 }}>🪵 Logs:</Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button title="📋 Copiar" onPress={copyLogs} color="#4CAF50" />
            <Button title="🧹 Limpiar" onPress={clearLogs} color="#f39c12" />
          </View>
        </View>

        <Text style={{ color: "#ccc", fontSize: 13, marginTop: 8 }}>
          {logs.length ? JSON.stringify(logs, null, 2) : "No logs yet"}
        </Text>
      </View>
    </ScrollView>
  );
}
