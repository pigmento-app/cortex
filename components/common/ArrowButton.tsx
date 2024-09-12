import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ArrowButtonProps = {
  title: string;
  onPress: () => void;
  direction?: "left" | "right" | "up" | "down";
  style?: any;
  isLast?: boolean;
};

export default function ArrowButton({
  title,
  onPress,
  direction = "right",
  style,
  isLast = false,
}: ArrowButtonProps) {
  const getIconName = () => {
    switch (direction) {
      case "left":
        return "arrow-back";
      case "right":
        return "arrow-forward";
      case "up":
        return "arrow-up";
      case "down":
        return "arrow-down";
      default:
        return "arrow-forward";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[isLast ? styles.lastButton : styles.button, style]}
    >
      {direction === "left" && (
        <Ionicons
          name={getIconName()}
          size={20}
          color="white"
          style={styles.icon}
        />
      )}
      {direction !== "left" && (
        <Ionicons
          name={getIconName()}
          size={20}
          color={isLast ? "black" : "white"}
          style={styles.icon}
        />
      )}
      <Text style={{ fontSize: 0 }}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 50,
    height: 60,
    width: 60,
  },
  lastButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 50,
    height: 60,
    width: 60,
  },
  icon: {
    marginHorizontal: 4,
  },
});
