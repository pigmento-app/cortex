import LogoOnly from "@/assets/svg/LogoOnly.svg";
import ArrowButton from "@/components/common/ArrowButton";
import { useSession } from "@/context/authContext";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

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
    image: require("@/assets/images/onboarding/step2.png"),
  },
  {
    colorBottom: "#5B3A6A",
    title: "One score, every day",
    description:
      "The closer your photo is to the color, the more points you'll earn.",
    image: require("@/assets/images/onboarding/step3.png"),
  },
];

export default function Onboarding() {
  const { completeOnboarding } = useSession();
  const [step, setStep] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);

  // Gestion du défilement manuel via les boutons "Next" et "Back"
  const handleNextStep = () => {
    if (step < 3) {
      scrollViewRef.current?.scrollTo({
        x: step * screenWidth,
        animated: false,
      });
      return setStep(step + 1);
    }
    return endOnboarding();
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      scrollViewRef.current?.scrollTo({
        x: (step - 2) * screenWidth,
        animated: false,
      });
      return setStep(step - 1);
    }
  };

  const endOnboarding = () => {
    completeOnboarding();
    return router.replace("/");
  };

  // Gestion du changement d'étape lors du scroll
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentStep = Math.round(scrollPosition / screenWidth) + 1;

    if (currentStep > steps.length) {
      endOnboarding(); // Exécuter la fin de l'onboarding lorsque l'utilisateur fait défiler après la dernière étape
    } else {
      setStep(currentStep);
    }
  };

  const renderStepContent = () => (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {steps.map((item, index) => (
        <View key={index} style={{ width: screenWidth }}>
          <Image
            source={item.image}
            style={{
              width: 341,
              height: "100%",
              margin: "auto",
              marginBottom: 42,
              resizeMode: "contain",
            }}
          />
        </View>
      ))}
      {/* Ajouter un écran vide après la dernière étape pour permettre un défilement supplémentaire */}
      <View style={{ width: screenWidth }} />
    </ScrollView>
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
            onPress={handlePreviousStep}
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
              title="Complete"
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
    <SafeAreaView style={{ backgroundColor: "#EEEEEE" }}>
      <View style={styles.container}>
        <View style={styles.topbar}>
          <LogoOnly width={40} height={40} />
          <TouchableOpacity onPress={endOnboarding}>
            <Text style={{ fontSize: 16, fontWeight: "400" }}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View>
          {renderStepContent()}
          {renderBottomContent()}
        </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 34,
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
    maxWidth: "90%",
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
