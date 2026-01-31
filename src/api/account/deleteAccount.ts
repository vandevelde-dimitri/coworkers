import { supabase } from "../../../utils/supabase";

export async function deleteAccount() {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) throw new Error("Non authentifié");

    try {
        const res = await fetch(
            `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
            },
        );

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Erreur suppression compte");
        }

        return true;
    } catch (err) {
        if (__DEV__) console.error("Delete account error:", err);
        throw err;
    }
}
