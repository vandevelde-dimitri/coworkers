import { supabase } from "@/src/infrastructure/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { getIsRecoveryFlow } from "./deepLinkFlag";
import { useUserProfileStatus } from "./queries/useUserProfileStatus";

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
  const [shouldCheckProfile, setShouldCheckProfile] = useState(false);

  // Hook React Query pour checker le profile
  const { data: profileStatus, isLoading: profileLoading } =
    useUserProfileStatus(shouldCheckProfile);

  // Quand le profile status arrive, mettre à jour l'état
  useEffect(() => {
    if (shouldCheckProfile && !profileLoading) {
      if (profileStatus !== undefined) {
        setProfileCompleted(profileStatus);
        if (__DEV__)
          console.log(
            `[Auth] Profile status: ${profileStatus ? "COMPLETED" : "INCOMPLETE"}`,
          );
      }
      setLoading(false);
      setShouldCheckProfile(false);
    }
  }, [profileStatus, profileLoading, shouldCheckProfile]);

  const checkProfileStatus = async () => {
    setLoading(true);
    if (__DEV__) console.log(" [Auth] Checking profile status...");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfileCompleted(false);
        setLoading(false);
        return;
      }

      // Déclencher la query React Query
      setShouldCheckProfile(true);
    } catch (error) {
      if (__DEV__) console.error("❌ [Auth] Profile check error:", error);
      setProfileCompleted(true);
      setLoading(false);
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

      // 🔑 Ne pas checker le profil si on est en recovery flow (deep link)
      const inRecoveryFlow = getIsRecoveryFlow();

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (inRecoveryFlow) {
          // Pendant le recovery flow, on juste set la session et return
          // Le layout va blocker les redirections jusqu'à setRecoveryFlow(false)
          if (__DEV__)
            console.log(
              "[Auth] Recovery flow detected - skipping profile check",
            );
          setLoading(false);
        } else {
          // Normal flow: checker le profil
          await checkProfileStatus();
        }
      } else if (event === "SIGNED_OUT") {
        setProfileCompleted(false);
        setLoading(false);
      }

      clearTimeout(initTimeoutId);
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
