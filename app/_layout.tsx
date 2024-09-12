import { Slot } from 'expo-router';
import { SessionProvider } from '@/context/authContext';
import { useSendFcmToken } from '@/hooks/useSendFcmToken';

export default function Root() {
  useSendFcmToken();

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}