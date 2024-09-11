import { Slot } from 'expo-router';
import { SessionProvider } from '@/context/authContext';

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}