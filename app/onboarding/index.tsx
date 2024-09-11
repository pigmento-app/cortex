import { useSession } from "@/context/authContext";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const { completeOnboarding } = useSession();
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (step < 3) {
      return setStep(step + 1);
    }

    return endOnboarding();
  };

  const endOnboarding = () => {
    completeOnboarding();
    return router.replace("/");
  };

  let colorBottom = "";
  let title = "";
  let description = "";

  const renderStepContent = () => {
    switch (step) {
      case 1:
        colorBottom = "red";
        title = "Step 1";
        description = "This is the first step";
        return (
          <View>
            <Text>Step 1</Text>
          </View>
        );
      case 2:
        title = "Step 2";
        description = "This is the second step";
        colorBottom = "blue";
        return <Text>Step 2</Text>;
      case 3:
        title = "Step 3";
        description = "This is the third step";
        colorBottom = "green";
        return <Text>Step 3</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: "violet",
          height: "100%",
        }}
      >
        <View style={styles.topbar}>
          <Text style={styles.title}>Pigmento.</Text>
          <Button title="Skip" onPress={endOnboarding} />
        </View>
        {renderStepContent()}

        <View
          style={{
            backgroundColor: colorBottom,
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 291,
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 24,
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 36,
          }}
        >
          <View style={styles.onBoardingBottom}>
            <View style={styles.onBoardingTitle}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {step > 1 ? (
                <Button title="Back" onPress={() => setStep(step - 1)} />
              ) : (
                <View style={{ width: 40 }} />
              )}

              <View style={styles.pagination}>
                <View style={step === 1 ? styles.activeDot : styles.dot} />
                <View style={step === 2 ? styles.activeDot : styles.dot} />
                <View style={step === 3 ? styles.activeDot : styles.dot} />
              </View>
              <Button title="Next" onPress={handleNextStep} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 24,
  },
  onBoardingBottom: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  onBoardingTitle: {
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "gray",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
  },
  activeDot: {
    width: 24,
    height: 10,
    borderRadius: 4,
    backgroundColor: "white",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 1000,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
