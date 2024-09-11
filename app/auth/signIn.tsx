import { router } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import AuthButton from '@/components/AuthButton';
import Container from '@/components/Container';
import { useSession } from '@/context/authContext';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <Container>
      <AuthButton />
      <TouchableOpacity onPress={() => router.push('/auth/signUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  signUpText: {
    color: 'blue',
    marginTop: 20,
    textDecorationLine: 'underline'
  }
});
