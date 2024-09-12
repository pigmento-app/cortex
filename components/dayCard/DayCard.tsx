import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Platform,
} from "react-native";
import CameraTabbar from "@/assets/svg/camera-tabbar.svg";
import { Fonts } from "@/constants/Fonts";
import { Ellipse, Svg } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import { Smartphone } from "lucide-react-native";

let Accelerometer: { addListener: (arg0: (data: { x: number; y: number; z: number; }) => void) => any; setUpdateInterval: (arg0: number) => void; } | null = null;
if (Platform.OS !== 'web') {
  Accelerometer = require('expo-sensors').Accelerometer;
}

interface DayCardProps {
  image: string | null;
  score: number;
  weekday: string;
  rest: string;
  colorOfTheDay: string;
  takePhoto: () => void;
}

function lightenColor(color: string, factor: number): string {
  const rgb = color.match(/\d+/g);
  if (!rgb) return color;

  const [r, g, b] = rgb.map(Number);
  const newR = Math.min(255, r + (255 - r) * factor);
  const newG = Math.min(255, g + (255 - g) * factor);
  const newB = Math.min(255, b + (255 - b) * factor);

  return `rgb(${newR}, ${newG}, ${newB})`;
}

export default function DayCard({
  image,
  score,
  weekday,
  rest,
  colorOfTheDay,
  takePhoto,
}: DayCardProps) {
  const theme = useColorScheme() ?? "light";
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const [subscription, setSubscription] = useState<any>(null);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => {
      Animated.spring(flipAnimation, {
        toValue: isFlipped ? 0 : 180,
        friction: 12,
        tension: 6,
        useNativeDriver: true,
      }).start();
      setIsFlipped(!isFlipped);
  };

  const handleShake = (data: { x: number; y: number; z: number }) => {
    const totalForce = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
    if (totalForce > 2) {
      flipCard();
    }
  };
  
  const subscribe = () => {
    if (Accelerometer) {
      setSubscription(
        Accelerometer.addListener(handleShake)
      );
      Accelerometer.setUpdateInterval(100);
    }
  };

  const unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500, // Slower animation
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1500, // Slower animation
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 1000, // Slower animation
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 1000, // Slower animation
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (image && !isFlipped) {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500, // Duration of the fade-in effect
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 500, // Duration of the fade-out effect
        useNativeDriver: true,
      }).start();
    }
  }, [image, isFlipped]);

  const pulseOpacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const shakeRotate = shakeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const pulseScale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const lightenedColor = lightenColor(colorOfTheDay, 0.8);

  return (
    <>
      <View style={styles.datesContainer}>
        <Text style={[Fonts.date, styles.weekday, { color: Colors[theme].text }]}>
          {weekday},
        </Text>
        <Text style={[Fonts.date, { color: Colors[theme].text }]}>{rest}</Text>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={flipCard} style={styles.flipCardContainer}>
          <Animated.View
            style={[
              styles.flipCard,
              {
                transform: [
                  { perspective: 1000 }, // Add perspective for 3D effect
                  { rotateY: image ? frontInterpolate : "0deg" },
                ],
                zIndex: isFlipped ? 0 : 1,
                backgroundColor: "#E3E3E3", // Use lightened color for the front side
              },
            ]}
          >
            {!image && (
              <View style={styles.takePhotoContainer}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={styles.takePhotoBtn}
                >
                  <CameraTabbar width={24} height={24} />
                  <Text style={styles.takePhotoBtnText}>Take a picture</Text>
                </TouchableOpacity>
              </View>
            )}
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </Animated.View>
          {image && (
            <Animated.View
            style={[
              styles.flipCard,
              styles.flipCardBack,
              {
                transform: [
                  { perspective: 1000 },
                  { rotateY: backInterpolate },
                ],
                zIndex: isFlipped ? 1 : 0,
                backgroundColor: lightenedColor,
              },
            ]}
          >
            <View style={styles.backContent}>
              <Text style={[styles.backTitle, { color: colorOfTheDay }]}>
                Fact about the {"\n"}
                <Text style={{ fontWeight: 'bold' }}>Royal Blue color</Text>
              </Text>
              <Text style={[styles.backText, { color: colorOfTheDay }]}>
                Royal Blue, created in the 18th century for Queen Charlotte, symbolizes wealth and prestige, often used to represent royalty.
              </Text>
            </View>
          </Animated.View>
          )}
        </TouchableOpacity>
        <Animated.View style={[styles.textInfoContainer, { opacity: textOpacity }]}>
          <Animated.Text style={[styles.explanatoryText, { opacity: pulseOpacity }]}>
            Tap or shake to reveal a fun fact
          </Animated.Text>
          <Animated.View style={[styles.shakeIconContainer, { transform: [{ rotate: shakeRotate }, { scale: pulseScale }] }]}>
            <Smartphone color={"#888"} size={24} />
          </Animated.View>
        </Animated.View>
      </View>
      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Svg height="40" width="40">
            <Ellipse
              cx="20"
              cy="20"
              rx="20"
              ry="20"
              fill={colorOfTheDay || "gray"}
            />
          </Svg>
          {image && (
            <Text style={[Fonts.info, { color: Colors[theme].text }]}>
              Score {score} %
            </Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  datesContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  weekday: {
    fontWeight: "bold",
    marginBottom: -12,
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  btnContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  flipCardContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  flipCard: {
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    position: "absolute",
    borderRadius: 10, // Ensure the same border-radius for both sides
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipCardBack: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Ensure the same border-radius for both sides
  },
  takePhotoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  takePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  takePhotoBtnText: {
    color: "#111",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  backContent: {
    flex: 1,
    padding: 32,
  },
  backTitle: {
    fontSize: 22,
  },
  backText: {
    marginTop: 20,
    fontSize: 18,
    opacity: 0.8,
  },
  explanatoryText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 14,
  },
  textInfoContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  shakeIconContainer: {
    marginTop: 10,
  },
});