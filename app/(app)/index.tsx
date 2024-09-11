import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Button,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import Camera from "@/assets/svg/camera.svg";
import { Fonts } from "@/constants/Fonts";
import { Ellipse, Svg } from "react-native-svg";
import fs from "fs";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [colorCounts, setColorCounts] = useState<{
    [key: string]: number;
  } | null>(null);
  const [score, setScore] = useState<number>(0);

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

      console.log(result.score);
      setScore(result.score);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ThemedView style={styles.mainContainer}>
        <View>
          <Text style={[Fonts.title, styles.mainTitle]}>Pigmento.</Text>
          <View style={styles.infoContainer}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Svg height="40" width="40">
                {/* Set the cx, cy to 20 and rx, ry to 20 for a 40px circle */}
                <Ellipse cx="20" cy="20" rx="20" ry="20" fill="red" />
              </Svg>
              <Text style={Fonts.info}>Couleur du jour</Text>
            </View>
            <Text style={Fonts.info}>{score} points</Text>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={takePhoto} style={styles.takePhotoBtn}>
            <Camera width={24} height={24} />
            <Text style={styles.takePhotoBtnText}>Prendre une photo</Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.image} />}

          {/* {colorCounts && (
            <View style={styles.colorCountsContainer}>
              {Object.entries(colorCounts).map(([color, count]) => (
                <Text key={color} style={styles.colorCountText}>
                  {color}: {count} pixels
                </Text>
              ))}
            </View>
          )} */}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "#111",
    flex: 1,
    padding: 0,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    paddingHorizontal: 20,
  },
  mainTitle: {
    alignSelf: "center",
  },
  infoContainer: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnContainer: {
    backgroundColor: "#111",
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
