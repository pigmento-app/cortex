import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { ThemedView } from "@/components/ThemedView";
import CameraTabbar from "@/assets/svg/camera-tabbar.svg";
import { Fonts } from "@/constants/Fonts";
import { Ellipse, Svg } from "react-native-svg";
import { Colors } from "@/constants/Colors";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [colorCounts, setColorCounts] = useState<{
    [key: string]: number;
  } | null>(null);
  const [score, setScore] = useState<number>(0);
  const theme = useColorScheme() ?? "light";
  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full name of the day (e.g., Tuesday)
    month: "long", // Full name of the month (e.g., September)
    day: "numeric", // Numeric day (e.g., 11)
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  const [weekday, rest] = formattedDate.split(", ");
  const [currentColor, setCurrentColor] = useState<string | null>(null); // RGB color as string

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
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
      uploadImage(resizedImage);
    }
  };

  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    console.log("IMAGE", image);

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

    try {
      const response = await fetch(`${apiUrl}/uploads`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      console.log(result.score);
      setScore(result.score);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

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
    } catch (error) {
      console.error("Upload failed", error);
    }
  }, []);

  useEffect(() => {
    getColor();
  }, [getColor]);

  return (
    <View
      style={[
        styles.safeAreaView,
        { backgroundColor: Colors[theme].background },
      ]}
    >
      <ThemedView
        style={[
          styles.mainContainer,
          { backgroundColor: Colors[theme].background },
        ]}
      >
        <View style={styles.datesContainer}>
          <Text style={[Fonts.date, { color: Colors[theme].text }]}>
            {weekday},
          </Text>
          <Text style={[Fonts.date, { color: Colors[theme].text }]}>
            {rest}
          </Text>
        </View>
        <View style={[styles.btnContainer]}>
          {!image && (
            <TouchableOpacity onPress={takePhoto} style={[styles.takePhotoBtn]}>
              <CameraTabbar width={24} height={24} />
              <Text style={styles.takePhotoBtnText}>Prendre une photo</Text>
            </TouchableOpacity>
          )}
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Svg height="40" width="40">
              {/* Set the cx, cy to 20 and rx, ry to 20 for a 40px circle */}
              <Ellipse
                cx="20"
                cy="20"
                rx="20"
                ry="20"
                fill={currentColor || "gray"}
              />
            </Svg>
            {image && (
              <Text style={[Fonts.info, { color: Colors[theme].text }]}>
                Score {score} %
              </Text>
            )}
          </View>
          <Text style={Fonts.info}>{score} points</Text>
        </View>
        <Text style={[Fonts.info, { color: Colors[theme].text }]}>
          {score} points
        </Text>
        <View
          style={[
            styles.btnContainer,
            { backgroundColor: Colors[theme].background },
          ]}
        >
          <TouchableOpacity
            onPress={takePhoto}
            style={[
              styles.takePhotoBtn,
              {
                borderWidth: 2,
                borderColor: theme === "dark" ? "white" : "black",
              },
            ]}
          >
            <Camera width={24} height={24} />
            <Text style={styles.takePhotoBtnText}>Prendre une photo</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
      </ThemedView>
    </View>
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
});
