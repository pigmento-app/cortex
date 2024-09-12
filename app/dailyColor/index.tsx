import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useColorScheme, Alert } from 'react-native';
import { Colors } from "@/constants/Colors";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function DailyColor() {
  const colorScheme = useColorScheme();
  const [currentColor, setCurrentColor] = useState<string>("blue");

  const mainCircleAnimation = useRef(new Animated.Value(1)).current;
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

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
    } catch (error: any) {
      Alert.alert("Failed to fetch today's color", error.message);
      console.error("Fetch failed", error);
    }
  }, []);

  useEffect(() => {
    getColor();

    const startScaleAnimation = (animation: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1.2,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    const startTranslateAnimation1 = (animation: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 30,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    const startTranslateAnimation2 = (animation: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 40,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    const startTranslateAnimation3 = (animation: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 40,
            duration: 5500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 5500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startScaleAnimation(mainCircleAnimation);
    startTranslateAnimation1(animation1);
    startTranslateAnimation2(animation2);
    startTranslateAnimation3(animation3);
  }, [mainCircleAnimation, animation1, animation2, animation3, getColor]);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].background }]}>
      <Text style={[styles.title, { color: currentColor }]}>Daily Color</Text>
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: currentColor,
            transform: [{ scale: mainCircleAnimation }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.smallCircle,
          {
            backgroundColor: currentColor,
            transform: [{ translateY: animation1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.topCircle,
          {
            backgroundColor: currentColor,
            transform: [{ translateY: animation2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bottomCircle,
          {
            backgroundColor: currentColor,
            transform: [{ translateY: animation3 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 100,
  },
  smallCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    opacity: 0.5,
    position: 'absolute',
    top: '-3%',
    left: '-5%',
  },
  topCircle: {
    width: 300,
    height: 300,
    borderRadius: 200,
    opacity: 0.4,
    position: 'absolute',
    top: '-10%',
    right: '-30%',
  },
  bottomCircle: {
    width: 600,
    height: 600,
    borderRadius: 300,
    opacity: 0.2,
    position: 'absolute',
    bottom: '-45%',
    right: '-50%',
  }
});