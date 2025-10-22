// components/OAuthGoogleSignIn.tsx
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";
import { useGoogleSignInLogs1 } from "../hooks/useGoogleSignInLogs1";

export default function GoogleSignInLogs1() {
  const { user, loading, logs, signIn, signOut, getProfile, clearLogs } = useGoogleSignInLogs1();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {user ? (
          <>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Welcome, {user.user.name}</Text>

            {user.user.photo && (
              <Image
                source={{ uri: user.user.photo }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: 10,
                }}
              />
            )}

            <Text style={{ marginBottom: 20 }}>{user.user.email}</Text>

            <View style={{ width: "60%", gap: 10 }}>
              <Button title="Get Profile" onPress={getProfile} />
              <Button title="Sign Out" onPress={signOut} color="#DB4437" />
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Sign in with Google</Text>

            <GoogleSigninButton
              style={{ width: 220, height: 55 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
              disabled={loading}
            />
          </>
        )}
      </View>

      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Button title="Clear Logs" onPress={clearLogs} color="#DB4437" />
      </View>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>🪵 Logs:</Text>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          padding: 10,
        }}
      >
        <Text selectable style={{ fontFamily: "monospace", fontSize: 12 }}>
          {/* {JSON.stringify(logs, null, 2)} */}
          {logs}
        </Text>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}
