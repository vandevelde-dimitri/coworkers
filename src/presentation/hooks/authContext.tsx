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
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  profileCompleted: false,
  refreshSession: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        setSession(session);
        setLoading(false);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setSession(session);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
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

    if (error) {
      if (__DEV__) console.error("refreshSession error", error);
      return;
    }

    setSession(data.session);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      if (__DEV__) console.error("Logout error:", error);
      throw new Error(error.message);
    }
  };

  const profileCompleted = useMemo(() => {
    return session?.user?.user_metadata?.profile_completed === true;
  }, [session]);

  return (
    <AuthContext.Provider
      value={{ session, loading, profileCompleted, refreshSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
