import { Session } from "@supabase/supabase-js";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { AppState } from "react-native";
import { logger } from "../../utils/logger";
import { supabase } from "../../utils/supabase";

type AuthContextType = {
    session: Session | null;
    loading: boolean;
    profileCompleted: boolean;
    refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
    profileCompleted: false,
    refreshSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Récupération initiale de la session
        const initSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;
                setSession(data.session);
            } catch (err) {
                // Log l'erreur mais ne bloque pas l'utilisateur
                await logger.critical("session_init_failed", err);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        initSession();

        // 2. Écouteur des changements d'Auth (Login, Logout, Token Refresh)
        const {
            data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // 3. Gestion de l'AppState (Unique Listener)
        // ✅ C'est le seul endroit où on gère le start/stop auto refresh
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
            console.error("refreshSession error", error);
            return;
        }

        setSession(data.session);
    };

    const profileCompleted = useMemo(() => {
        return session?.user?.user_metadata?.profile_completed === true;
    }, [session]);

    return (
        <AuthContext.Provider
            value={{ session, loading, profileCompleted, refreshSession }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
