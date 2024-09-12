import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  useColorScheme,
  useWindowDimensions,
  Alert,
  Text,
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
} from "react-native-reanimated";
import DayCard from "@/components/dayCard/DayCard";

const dummyCardInfo = [
  {
    image: "https://thenounproject.com/icon/gender-expression-5912403/",
    weekday: "Wednesday",
    rest: "September 25",
    score: 10,
    color: "red",
  },
  {
    image: "https://thenounproject.com/icon/empathy-5912400/",
    weekday: "Tuesday",
    rest: "September 24",
    score: 22,
    color: "blue",
  },
  {
    image: "https://thenounproject.com/icon/gender-fluid-5912404/",
    weekday: "Monday",
    rest: "September 23",
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
  const [image, setImage] = useState<string | null>(null);
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
  const [weekday, rest] = formattedDate.split(", ");
  const [currentColor, setCurrentColor] = useState<string | null>(null); // RGB color as string

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
      console.error("Upload failed", error);
    }
  }, []);

  useEffect(() => {
    // getColor().then(() => {
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
    // });
  }, [hasPlayed, getColor]);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access camera is required!");
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const image = result.assets[0];

        // Resize the image to 600x600 pixels
        const resizedImage = await ImageManipulator.manipulateAsync(
          image.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // Optionally adjust compression and format
        );
        setImage(image.uri);
        setCardInfo((prevCardInfo) => {
          const updatedCardInfo = [...prevCardInfo];
          updatedCardInfo[dayIndex].image = resizedImage.uri;
          return updatedCardInfo;
        });
        setHasPlayed(true);
        uploadImage(resizedImage);
      }
    } catch (error: any) {
      Alert.alert("An error occurred", error.message);
    }
  };

  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    console.log("IMAGE", image);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const formData = new FormData();

    // Ajouter le fichier à l'objet FormData
    formData.append("file", {
      uri:
        Platform.OS === "android"
          ? image.uri
          : image.uri.replace("file://", ""), // iOS nécessite de retirer 'file://'
      type: image.mimeType,
      name: image.fileName,
    } as any);

    console.log("API URL", apiUrl);

    try {
      const response = await fetch(`${apiUrl}/uploads`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      console.log("SCORE", result.score);
      // [TODO] Only change the current card score
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
      console.log("cardInfolength", cardInfo.length);
      console.log("cardInfolength", cardInfo.length - 1);

      console.log("dayINDEX", dayIndex < cardInfo.length - 1);

      console.log(
        "SWIPE?????",
        cardInfo && e.translationX < -width.width / 2 && dayIndex > 0
      );

      if (cardInfo && e.translationX > width.width / 2) {
        // Swipe right: show the previous card
        if (dayIndex > 0) {
          console.log("SWIPE RIGHT, MOVE TO PREVIOUS CARD");
          // setDayIndex((prevIndex) => prevIndex - 1);
          translateX.value = withTiming(0, { duration: 500 });
        } else {
          console.log("RESET SWIPE RIGHT, ALREADY AT FIRST CARD");
          translateX.value = withTiming(0, { duration: 500 });
        }
      } else if (cardInfo && e.translationX < -width.width / 2) {
        // Swipe left: show the next card
        if (dayIndex < cardInfo.length - 1) {
          console.log("SWIPE LEFT, MOVE TO NEXT CARD");
          // setDayIndex((prevIndex) => prevIndex + 1);
          translateX.value = withTiming(0, { duration: 500 });
        } else {
          console.log("RESET SWIPE LEFT, ALREADY AT LAST CARD");
          translateX.value = withTiming(0, { duration: 500 });
        }
      } else {
        // Reset if swipe did not pass the threshold
        console.log("RESET SWIPE, NO CARD SWITCH");
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

  console.log(
    "cardInfo[dayIndex].weekday",
    cardInfo ? cardInfo[dayIndex].weekday : weekday
  );
  console.log("dayIndex", dayIndex);

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
          {
            <DayCard
              key={cardInfo[dayIndex].weekday}
              image={cardInfo[dayIndex].image}
              score={cardInfo[dayIndex].score}
              weekday={cardInfo[dayIndex].weekday}
              rest={cardInfo[dayIndex].rest}
              colorOfTheDay={cardInfo[dayIndex].color}
              takePhoto={takePhoto}
            />
          }
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
