//import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
//import * as SplashScreen from 'expo-splash-screen';
//import { useColorScheme } from 'react-native';

// app/_layout.tsx
import { Stack } from 'expo-router';

import '../i18n'; // <-- Execute the translation configuration on boot!

export default function RootLayout() {
  return (
    // headerShown: false removes the default ugly top header bar
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}