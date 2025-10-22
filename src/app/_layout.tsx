import { Stack, usePathname } from "expo-router";

export default function RootLayout() {
  const pathname = usePathname();
  console.log("pathname", pathname);
  return <Stack />;
}
