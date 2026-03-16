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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfileCompleted(false);
        return;
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Profile status check timeout")),
          5000,
        ),
      );

      const statusPromise = profileStatusUseCase.execute();

      try {
        const isCompleted = (await Promise.race([
          statusPromise,
          timeoutPromise,
        ])) as boolean;
        setProfileCompleted(isCompleted);
        if (__DEV__) console.log("Profile completed:", isCompleted);
      } catch (raceError) {
        if (__DEV__) console.warn("Profile check race error:", raceError);
        setProfileCompleted(true);
      }
    } catch (error) {
      if (__DEV__) console.error("Profile status check error:", error);
      setProfileCompleted(true);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let initTimeoutId: ReturnType<typeof setTimeout>;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: restoredSession },
          error,
        } = await supabase.auth.getSession();

        if (isMounted) {
          if (restoredSession) {
            setSession(restoredSession);
            checkProfileStatus();
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        if (__DEV__) console.error("Auth initialization error:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    initTimeoutId = setTimeout(() => {
      if (isMounted) {
        if (__DEV__)
          console.warn("Auth initialization timeout - forcing completion");
        setLoading(false);
      }
    }, 3000);

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      setSession(session);
      setLoading(false);
      clearTimeout(initTimeoutId);

      if (event === "SIGNED_IN") {
        await checkProfileStatus();
      } else if (event === "SIGNED_OUT") {
        setProfileCompleted(false);
      } else if (event === "TOKEN_REFRESHED" && session) {
        setSession(session);
      }
    });

    const subscriptionAppState = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") supabase.auth.startAutoRefresh();
        else supabase.auth.stopAutoRefresh();
      },
    );

    return () => {
      isMounted = false;
      clearTimeout(initTimeoutId);
      authSubscription.unsubscribe();
      subscriptionAppState.remove();
    };
  }, []);

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      if (__DEV__) console.error("Refresh session error:", error);
      return;
    }
    if (data.session) {
      setSession(data.session);
      await checkProfileStatus();
    }
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
