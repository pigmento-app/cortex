import { StyleSheet, View } from 'react-native';

export default function Container({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});
