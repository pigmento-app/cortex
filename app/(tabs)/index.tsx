import React, { useState } from 'react';
import { Image, StyleSheet, Button, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [colorCounts, setColorCounts] = useState<{ [key: string]: number } | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result)
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Button title="Take Photo" onPress={takePhoto} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {colorCounts && (
          <View>
            {Object.entries(colorCounts).map(([color, count]) => (
              <Text key={color}>
                {color}: {count} pixels
              </Text>
            ))}
          </View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
