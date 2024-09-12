import LogoOnly from "@/assets/svg/LogoOnly.svg";
import ArrowButton from "@/components/common/ArrowButton";
import { useSession } from "@/context/authContext";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const steps = [
  {
    colorBottom: "#0D7337",
    title: "One color, every day",
    description:
      "Every day, you are notified of a random color at a random time.",
    image: require("@/assets/images/onboarding/step1.png"),
  },
  {
    colorBottom: "#7F0134",
    title: "One picture, every day",
    description:
      "Take a picture around you, trying to capture as much of the proposed color as possible.",
    // image: require("@/assets/images/onboarding/step2.png"),
  },
  {
    colorBottom: "#5B3A6A",
    title: "One score, every day",
    description:
      "The closer your photo is to the color, the more points you'll earn.",
    // image: require("@/assets/images/onboarding/step3.png"),
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
      <Image
        source={steps[step - 1].image}
        style={{
          width: "auto",
          height: "100%",
          resizeMode: "contain",
          marginLeft: "4%",
          marginRight: "4%",
        }}
      />
    </View>
  );

  const dotWidths = steps.map(() => useRef(new Animated.Value(10)).current);
  const activeDotWidth = 24;

  useEffect(() => {
    steps.forEach((_, i) => {
      Animated.timing(dotWidths[i], {
        toValue: step === i + 1 ? activeDotWidth : 10,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });
  }, [step]);

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
          <ArrowButton
            title="Back"
            onPress={() => setStep(step - 1)}
            direction="left"
            opacity={step > 1 ? 1 : 0}
          />
          <View style={styles.pagination}>
            {steps.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  i === step - 1 && styles.activeDot,
                  {
                    width: dotWidths[i],
                  },
                ]}
              />
            ))}
          </View>
          {step < 3 ? (
            <ArrowButton
              title="Next"
              onPress={handleNextStep}
              direction="right"
              opacity={1}
            />
          ) : (
            <ArrowButton
              title="Next"
              onPress={handleNextStep}
              direction="right"
              opacity={1}
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
    borderRadius: 1000,
    backgroundColor: "white",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 1000,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
