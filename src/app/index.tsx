import { Link } from "expo-router";
import { Button, View } from "react-native";
import GoogleSignInLogs2 from "../components/GoogleSignInLogs2";

export default function IndexScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Link href="./version1" push asChild><Button title="Go to version1" /></Link>
      <GoogleSignInLogs2 />
    </View>
  );
}
