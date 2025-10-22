// version1.tsx

import { Link } from "expo-router";
import React, { Button, View } from "react-native";
import GoogleSignInLogs1 from "../components/GoogleSignInLogs1";

export default function Version1Screen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Link href="/" push asChild>
        <Button title="Go to version2" />
      </Link>

      <GoogleSignInLogs1 />
    </View>
  );
}
