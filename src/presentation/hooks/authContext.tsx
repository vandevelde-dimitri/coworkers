import { GetUserProfileStatusUseCase } from "@/src/application/use-case/user/GetUserProfileStatus";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { supabase } from "@/src/infrastructure/supabase";
import { Session } from "@supabase/supabase-js";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState } from "react-native";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profileCompleted: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  checkProfileStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  profileCompleted: false,
  refreshSession: async () => {},
  logout: async () => {},
  checkProfileStatus: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const profileStatusUseCase = useMemo(() => {
    const userRepo = SupabaseUserRepository.getInstance();
    return new GetUserProfileStatusUseCase(userRepo);
  }, []);

  const checkProfileStatus = async () => {
    try {
      if (__DEV__) console.log("🔍 Checking profile status...");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const isCompleted = await profileStatusUseCase.execute();
        if (__DEV__) console.log("✓ Profile completed:", isCompleted);
        setProfileCompleted(isCompleted);
      } else {
        if (__DEV__) console.log("✗ No user found");
        setProfileCompleted(false);
      }
    } catch (error) {
      if (__DEV__) console.error("❌ checkProfileStatus error:", error);
      setProfileCompleted(false);
    }
  };

  useEffect(() => {
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (event === "INITIAL_SESSION") {
        await checkProfileStatus();
        setLoading(false);
      } else if (event === "SIGNED_IN") {
        await checkProfileStatus();
        setLoading(false);
      } else if (event === "TOKEN_REFRESHED") {
        await checkProfileStatus();
      } else if (event === "SIGNED_OUT") {
        setProfileCompleted(false);
        setLoading(false);
      }
    });

    const subscriptionAppState = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") {
          supabase.auth.startAutoRefresh();
        } else {
          supabase.auth.stopAutoRefresh();
        }
      },
    );

    return () => {
      authSubscription.unsubscribe();
      subscriptionAppState.remove();
    };
  }, []);

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) return;
    setSession(data.session);
    await checkProfileStatus();
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profileCompleted,
        refreshSession,
        logout,
        checkProfileStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
