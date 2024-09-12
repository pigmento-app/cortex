import LogoOnly from "@/assets/svg/LogoOnly.svg";
import ArrowButton from "@/components/common/ArrowButton";
import { useSession } from "@/context/authContext";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const steps = [
  {
    colorBottom: "#0D7337",
    title: "One color, every day",
    description:
      "Every day, you are notified of a random color at a random time.",
  },
  {
    colorBottom: "#7F0134",
    title: "One picture, every day",
    description:
      "Take a picture around you, trying to capture as much of the proposed color as possible.",
  },
  {
    colorBottom: "#5B3A6A",
    title: "One score, every day",
    description:
      "The closer your photo is to the color, the more points you'll earn.",
  },
];

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

  const renderStepContent = () => (
    <View>
      <Text>{`Step ${step}`}</Text>
    </View>
  );

  const renderBottomContent = () => (
    <View
      style={{
        ...styles.bottomContainer,
        backgroundColor: steps[step - 1].colorBottom,
      }}
    >
      <View style={styles.onBoardingBottom}>
        <View style={styles.onBoardingTitle}>
          <Text style={styles.title}>{steps[step - 1].title}</Text>
          <Text style={styles.description}>{steps[step - 1].description}</Text>
        </View>
      </View>
      <View>
        <View style={styles.navContainer}>
          {step > 1 ? (
            <ArrowButton
              title="Back"
              onPress={() => setStep(step - 1)}
              direction="left"
            />
          ) : (
            <View style={{ width: 40 }} />
          )}
          <View style={styles.pagination}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={step === i + 1 ? styles.activeDot : styles.dot}
              />
            ))}
          </View>
          {step < 3 ? (
            <ArrowButton
              title="Next"
              onPress={handleNextStep}
              direction="right"
            />
          ) : (
            <ArrowButton
              title="Next"
              onPress={handleNextStep}
              direction="right"
              isLast={true}
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    // TODOREVIEW SA : add dark mode (background)
    <SafeAreaView style={{ backgroundColor: "#EEEEEE" }}>
      <View style={styles.container}>
        <View style={styles.topbar}>
          <LogoOnly />
          <TouchableOpacity onPress={endOnboarding}>
            <Text style={{ fontSize: 16, fontWeight: 400 }}>Skip</Text>
          </TouchableOpacity>
        </View>
        {renderStepContent()}
        {renderBottomContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "#EEEEEE",
    height: "100%",
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 24,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 320,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 32,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    maxWidth: 200,
    color: "white",
  },
  description: {
    fontSize: 18,
    color: "#EEEEEE",
  },
  navContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
