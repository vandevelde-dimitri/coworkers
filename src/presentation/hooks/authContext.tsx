import { supabase } from "@/src/infrastructure/supabase";
import { logger } from "@/utils/logger";
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
        const initSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;
                setSession(data.session);
            } catch (err) {
                await logger.critical(
                    "SESSION_INIT_FALLED",
                    "authContext",
                    err,
                );
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        initSession();

        const {
            data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" || event === "USER_DELETED") {
                setSession(null);
            } else if (session) {
                setSession(session);
            }

            setLoading(false);
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
