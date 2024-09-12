import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import CameraTabbar from "@/assets/svg/camera-tabbar.svg";
import { Fonts } from "@/constants/Fonts";
import { Ellipse, Svg } from "react-native-svg";
import { Colors } from "@/constants/Colors";

interface DayCardProps {
  image: string | null;
  score: number;
  weekday: string;
  rest: string;
  colorOfTheDay: string;
  takePhoto: () => void;
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

  return (
    <>
      <View style={styles.datesContainer}>
        <Text style={[Fonts.date, { color: Colors[theme].text }]}>
          {weekday},
        </Text>
        <Text style={[Fonts.date, { color: Colors[theme].text }]}>{rest}</Text>
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
