import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/useStorageState';

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isOnboard: boolean;
  completeOnboarding: () => void;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isOnboard: false,
  completeOnboarding: () => null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState<string>('session');
  const [[, onboardValue], setIsOnboard] = useStorageState<boolean>('isOnboard', false);

  const isOnboard = onboardValue ?? false;

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          setSession(token);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
        isOnboard,
        completeOnboarding: () => {
          setIsOnboard(true);
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
}