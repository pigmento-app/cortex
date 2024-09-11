import { useState, useEffect } from "react";
import { StyleSheet, View, Image, FlatList, ActivityIndicator, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const IMAGE = "https://via.placeholder.com/150";

export default function Gallery() {
  const colorScheme = useColorScheme();

  const [images, setImages] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // requête API
        // const response = await fetch("https://api");
        // const data = await response.json();
        // setImages(data.images);

        // simulation
        const totalImages = 50;
        const allImages = Array.from({ length: totalImages }, (_, i) => `${IMAGE}?img=${i + 1}`);
        setImages(allImages);
      } catch (error) {
        console.error("Erreur lors du chargement des images :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const numColumns = 3;
  const fullRows = Math.floor(images.length / numColumns);
  let numberElementsLastRow = images.length - (fullRows * numColumns);

  if (numberElementsLastRow !== 0) {
    while (numberElementsLastRow !== numColumns) {
      images.push(null);
      numberElementsLastRow++;
    }
  }

  const renderImage = ({ item }: { item: string | null }) => {
    return (
      <View style={styles.imageContainer}>
        {item ? (
          <Image
            source={{ uri: item }}
            style={styles.image}
          />
        ) : (
          null        
        )}
      </View>
    );
  };

  return (
    <SafeAreaView  style={[styles.safeAreaView, { backgroundColor: Colors[colorScheme ?? "light"].background }]}>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => item ? item : `empty-${index}`}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        ListFooterComponent={
          loading ? (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: 2,
  },
  imageContainer: {
    flex: 1,
    margin: 2,
    aspectRatio: 1,
    backgroundColor: 'transparent',
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    resizeMode: 'cover',
  },
  spinnerContainer: {
    marginVertical: 20,
  },
});