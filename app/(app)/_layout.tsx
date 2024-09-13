import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Button,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Redirect } from "expo-router";
import { Tabs } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyColor from "../dailyColor";
// CONSTANTS
import { Colors } from "@/constants/Colors";
// ICONS
import PigmentoLogo from "@/assets/svg/logo-pigmento.svg";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, isOnboard, isLoading, signOut } = useSession();
  const [showDailyColor, setShowDailyColor] = useState(true);
  const [currentColor, setCurrentColor] = useState<string>("blue");
  const [isColorLoading, setIsColorLoading] = useState<boolean>(true);

  const getColor = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/colors`, {
        method: "GET",
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setCurrentColor(result.color);
      setIsColorLoading(false);
    } catch (error: any) {
      // Alert.alert("Failed to fetch today's color", error.message);
      console.log("Fetch failed", error);
    }
  }, []);

  useEffect(() => {
    getColor();

    const timer = setTimeout(() => {
      setShowDailyColor(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [getColor]);


  if (isLoading || isColorLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (!isOnboard) {
    return <Redirect href="/onboarding" />;
  }

  if (!session) {
    return <Redirect href="/auth/signIn" />;
  }

  if (showDailyColor) {
    return (
      <TouchableWithoutFeedback onPress={() => setShowDailyColor(false)}>
        <View style={{ flex: 1 }}>
          <DailyColor currentColor={currentColor} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <GestureHandlerRootView>
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          flex: 1,
          paddingHorizontal: 34,
        }}
      >
        <SafeAreaView
          style={[
            styles.header,
            { backgroundColor: Colors[colorScheme ?? "light"].background },
          ]}
        >
          <PigmentoLogo width={40} height={40} />
          <Button
            title="Sign out"
            onPress={signOut}
            color={Colors[colorScheme ?? "light"].text}
          />
        </SafeAreaView>
        <View style={styles.content}>
          <TabLayout currentColor={currentColor} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

function TabLayout({ currentColor }: { currentColor: string }) {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
        initialParams={{ currentColor }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Gallery",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 34,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
});
