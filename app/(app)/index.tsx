import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  useColorScheme,
  useWindowDimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Colors } from "@/constants/Colors";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import DayCard from "@/components/dayCard/DayCard";
import { useLocalSearchParams } from "expo-router";

const dummyCardInfo = [
  {
    image: "",
    weekday: "Wednesday",
    rest: "September 11",
    score: 10,
    color: "red",
  },
  {
    image: "",
    weekday: "Tuesday",
    rest: "September 10",
    score: 22,
    color: "blue",
  },
  {
    image: "",
    weekday: "Monday",
    rest: "September 09",
    score: 90,
    color: "green",
  },
];

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [cardInfo, setCardInfo] = useState<
    | {
        image: string | null;
        weekday: string;
        rest: string;
        score: number;
        color: string;
      }[]
  >(dummyCardInfo);
  const [score, setScore] = useState<number>(0);
  const theme = useColorScheme() ?? "light";
  const date = new Date();
  const [dayIndex, setDayIndex] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full name of the day (e.g., Tuesday)
    month: "long", // Full name of the month (e.g., September)
    day: "numeric", // Numeric day (e.g., 11)
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  const { currentColor } = useLocalSearchParams();


  const [weekday, rest] = formattedDate.split(", ");

  useEffect(() => {
    if (!hasPlayed) {
      // If the user has never played, add a card for today
      const todaysCard = {
        image: "", // No image yet
        weekday,
        rest,
        score: 0, // No score yet
        color: currentColor || "gray", // Default color
      };
      setCardInfo([todaysCard, ...dummyCardInfo]); // Add today's card as the first one
      setDayIndex(0); // Make sure today's card is the first one shown
    }
  }, [hasPlayed, currentColor]);


  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const imageTmp = result.assets[0];

        // Resize the image to 600x600 pixels
        const resizedImage = await ImageManipulator.manipulateAsync(
          imageTmp.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        setCardInfo((prevCardInfo) => {
          // Safeguard: ensure `prevCardInfo` exists and has a valid `dayIndex`
          if (prevCardInfo && prevCardInfo[dayIndex]) {
            const updatedCardInfo = [...prevCardInfo];
            updatedCardInfo[dayIndex] = {
              ...updatedCardInfo[dayIndex], // Keep other properties intact
              image: imageTmp.uri, // Update only the image
            };
            return updatedCardInfo;
          }
          return prevCardInfo;
        });

        setHasPlayed(true);
        uploadImage(resizedImage);
      }
    } catch (error: any) {
      Alert.alert("An error occurred", error.message);
    }
  };

  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const formData = new FormData();

    formData.append("file", {
      uri:
        Platform.OS === "android"
          ? image.uri
          : image.uri.replace("file://", ""), // iOS nécessite de retirer 'file://'
      type: image.mimeType,
      name: image.fileName,
    } as any);

    try {
      const response = await fetch(`${apiUrl}/uploads`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setCardInfo((prevCardInfo) => {
        // Safeguard: ensure `prevCardInfo` exists and has a valid `dayIndex`
        if (prevCardInfo && prevCardInfo[dayIndex]) {
          const updatedCardInfo = [...prevCardInfo];
          updatedCardInfo[dayIndex] = {
            ...updatedCardInfo[dayIndex], // Keep other properties intact
            score: result.score, // Update only the image
          };
          return updatedCardInfo;
        }
        return prevCardInfo;
      });
      setScore(result.score);
    } catch (error: any) {
      Alert.alert("Upload failed", error.message);
      console.error("Upload failed", error);
    }
  };

  const width = useWindowDimensions();
  const translateX = useSharedValue(0);
  const direction = useSharedValue(0);
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const isSwipeRight = e.translationX > 0;
      direction.value = isSwipeRight ? 1 : -1;
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (cardInfo && e.translationX > width.width / 2) {
        if (dayIndex > 0) {
          translateX.value = withTiming(0, { duration: 500 });
          runOnJS(setDayIndex)(dayIndex - 1);
        } else {
          translateX.value = withTiming(0, { duration: 500 });
        }
      } else if (cardInfo && e.translationX < -width.width / 2) {
        if (dayIndex < cardInfo.length - 1) {
          translateX.value = withTiming(0, { duration: 500 });
          runOnJS(setDayIndex)(dayIndex + 1);
        } else {
          translateX.value = withTiming(0, { duration: 500 });
        }
      } else {
        translateX.value = withTiming(0, { duration: 500 });
      }
    });

  const animatedStyles = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      Math.abs(translateX.value),
      [0, width.width],
      [0, 10]
    );
    return {
      transform: [
        { translateX: translateX.value },
        {
          scale: 1 - dayIndex * 0.05,
        },
        {
          translateY: dayIndex * -30,
        },
        {
          rotateZ: `${direction.value * rotateZ}deg`,
        },
      ],
      opacity: 1,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={[
          styles.safeAreaView,
          { backgroundColor: Colors[theme].background },
        ]}
      >
        <Animated.View
          style={[
            styles.mainContainer,
            animatedStyles,
            { backgroundColor: Colors[theme].background },
          ]}
        >
          <DayCard
            key={cardInfo[dayIndex].weekday}
            image={cardInfo[dayIndex].image}
            score={cardInfo[dayIndex].score}
            weekday={cardInfo[dayIndex].weekday}
            rest={cardInfo[dayIndex].rest}
            colorOfTheDay={Array.isArray(currentColor) ? currentColor[0] : currentColor}
            takePhoto={takePhoto}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "green",
  },
  datesContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    backgroundColor: "#E3E3E3",
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
  leftAction: { width: 50, height: 50, backgroundColor: "crimson" },
  rightAction: { width: 50, height: 50, backgroundColor: "purple" },
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    height: 50,
    backgroundColor: "papayawhip",
    alignItems: "center",
  },
});
