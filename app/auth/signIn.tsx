import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useSession } from '@/context/authContext';
import AuthButton from '@/components/AuthButton';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AuthButton />
    </View>
  );
}