import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { ThemeProvider } from "@/providers/theme";
import { AuthProvider } from "@/providers/auth";
import Toast from "react-native-toast-message";
import { ErrorBoundary } from "./error-boundary";
import { useColors } from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <>
                <RootLayoutNav />
                <Toast />
              </>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const Colors = useColors();

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          color: Colors.text,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
