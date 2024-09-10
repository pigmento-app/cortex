import { useSession } from "@/context/authContext";
import { router } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Onboarding() {
  const { completeOnboarding } = useSession();

  return (
    <View style={styles.container}>
      <Text>Onboarding</Text>
      <Text
        onPress={() => {
          completeOnboarding();
          router.replace('/');
        }}
      >
        Complete the onboarding
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});