import { Session } from "@supabase/supabase-js";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { AppState } from "react-native";
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
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        };

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        getSession();

        const subscriptionAppState = AppState.addEventListener(
            "change",
            (state) => {
                if (state === "active") {
                    supabase.auth.startAutoRefresh();
                } else {
                    supabase.auth.stopAutoRefresh();
                }
            }
        );

        return () => {
            subscription.unsubscribe();
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
