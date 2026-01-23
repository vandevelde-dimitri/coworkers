import { supabase } from "../../../utils/supabase";

export async function getUser(user_id: string): Promise<any> {
    try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data?.session) throw new Error("No active session found");

        const { data: user, error: errorUser } = await supabase
            .from("public_profiles")
            .select(
                `*,
                fc:fc_id ( 
                id,
            name
          )`,
            )
            .eq("id", user_id)
            .single();

        if (errorUser) {
            throw new Error("Failed to fetch user data");
        }

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    } catch (error) {
        if (__DEV__) console.error("getUser error:", error);
        throw error;
    }
}
