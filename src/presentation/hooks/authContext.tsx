import { supabase } from "@/src/infrastructure/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { useUserProfileStatus } from "./queries/useUserProfileStatus";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profileCompleted: boolean;
  isRecovering: boolean;
  startRecovery: () => void;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  checkProfileStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  profileCompleted: false,
  isRecovering: false,
  startRecovery: () => {},
  refreshSession: async () => {},
  logout: async () => {},
  checkProfileStatus: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);

  // --- LOGIQUE DE VÉRIFICATION DU PROFIL ---
  // On active React Query QUE si on a une session et qu'on n'est PAS en recovery.
  const isQueryEnabled = !!session && !isRecovering;

  const {
    data: profileStatus,
    isLoading: profileLoading,
    refetch,
  } = useUserProfileStatus(isQueryEnabled);

  // Calcul du loading global :
  // Si on est en recovery, on débloque l'UI (loading = false).
  // Sinon, on attend l'auth ET le chargement du profil (si session existante).
  const loading = isRecovering
    ? false
    : authLoading || (!!session && profileLoading);

  useEffect(() => {
    let isMounted = true;

    // 1. Initialisation de la session au démarrage
    const initAuth = async () => {
      try {
        const {
          data: { session: s },
        } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(s);
          setAuthLoading(false);
        }
      } catch (e) {
        if (isMounted) setAuthLoading(false);
      }
    };

    initAuth();

    // 2. Écoute des changements d'état (Login, Logout, Recovery)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      if (__DEV__) console.log(`🔔 [Auth Event]: ${event}`);
      setSession(currentSession);

      if (event === "PASSWORD_RECOVERY") {
        setIsRecovering(true);
      } else if (event === "SIGNED_OUT") {
        setIsRecovering(false);
      }

      setAuthLoading(false);
    });

    // 3. Gestion du rafraîchissement Auto (AppState)
    const subscriptionAppState = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") supabase.auth.startAutoRefresh();
        else supabase.auth.stopAutoRefresh();
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      subscriptionAppState.remove();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsRecovering(false);
  };

  const refreshSession = async () => {
    await supabase.auth.refreshSession();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        // On force profileCompleted à true en recovery pour éviter la redirection Onboarding
        profileCompleted: isRecovering ? true : !!profileStatus,
        isRecovering,
        startRecovery: () => {
          if (__DEV__) console.log("🔒 [Auth] Recovery Lock activé");
          setIsRecovering(true);
        },
        refreshSession,
        logout,
        checkProfileStatus: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
