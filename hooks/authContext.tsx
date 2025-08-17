import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type AuthContextType = {
    session: Session | null;
    loading: boolean;
    profileCompleted: boolean;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
    profileCompleted: false,
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

        return () => subscription.unsubscribe();
    }, []);

    // ⚡️ dériver profileCompleted de la session
    const profileCompleted = useMemo(() => {
        return session?.user?.user_metadata?.profile_completed === true;
    }, [session]);

    return (
        <AuthContext.Provider value={{ session, loading, profileCompleted }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
