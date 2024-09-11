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
import { ThemedView } from "@/components/ThemedView";
import Camera from "@/assets/svg/camera.svg";
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
      setImage(image.uri);
      uploadImage(image); // Appel à la fonction d'upload
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
            <Text style={[Fonts.info, { color: Colors[theme].text }]}>
              Couleur du jour
            </Text>
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
    padding: 0,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoContainer: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnContainer: {
    marginVertical: 20,
    flex: 1, // Takes the available vertical space
    justifyContent: "center",
  },
  takePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
  },
  takePhotoBtnText: {
    color: "#111",
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  colorCountsContainer: {
    marginTop: 20,
  },
  colorCountText: {
    color: "#000",
    fontSize: 14,
  },
});
