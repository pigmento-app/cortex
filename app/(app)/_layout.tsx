import {
  ActivityIndicator,
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import { Redirect, Stack } from "expo-router";
import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fonts } from "@/constants/Fonts";

export default function AppLayout() {
  const colorScheme = useColorScheme();

  const { session, isOnboard, isLoading, signOut } = useSession();

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (!isOnboard) {
    return <Redirect href="/onboarding" />;
  }

  if (!session) {
    return <Redirect href="/auth/signIn" />;
  }

  return (
    <>
      <SafeAreaView
        style={[
          styles.header,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        <Text
          style={[Fonts.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Pigmento.
        </Text>
        <Button
          title="Sign out"
          onPress={signOut}
          color={Colors[colorScheme ?? "light"].text}
        />
      </SafeAreaView>
      <View style={styles.content}>
        <TabLayout />
      </View>
    </>
  );
}

function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background, // Set tab bar background color
          borderTopWidth: 0, // Remove the top border
          elevation: 0, // Remove shadow on Android
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
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
  },
});
