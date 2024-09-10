import { ThemedView } from "@/components/ThemedView";
import { Fonts } from "@/constants/Fonts";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ThemedView style={styles.mainContainer}>
        <View>
          <Text style={[Fonts.title, styles.mainTitle]}>Pigmento.</Text>
          <View style={styles.infoContainer}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            ></View>
          </View>
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
