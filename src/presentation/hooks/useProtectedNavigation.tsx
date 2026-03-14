import { useRouter } from "expo-router";
import { useAuth } from "./authContext";

type NavigationPath = string;

export const useProtectedNavigation = () => {
  const router = useRouter();
  const { session } = useAuth();
  const isLoggedIn = !!session;

  const navigateSafely = (path: NavigationPath) => {
    if (!isLoggedIn) {
      router.push("/(auth)/welcome");
    } else {
      router.push(path as any);
    }
  };

  return { navigateSafely };
};
