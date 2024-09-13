import { Slot } from 'expo-router';
import { SessionProvider } from '@/context/authContext';
import { useSendExpoPushToken } from '@/hooks/useSendExpoPushToken';

export default function Root() {
  useSendExpoPushToken();

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}