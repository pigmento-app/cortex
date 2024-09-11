import { ActivityIndicator, StyleSheet, View, SafeAreaView, Button } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/context/authContext';

export default function AppLayout() {
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
        <View style={styles.header}>
          <Button title="Sign out" onPress={signOut} />
        </View>
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
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
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
    paddingTop: 56,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
  },
});