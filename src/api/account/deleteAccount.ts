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
                    "Content-Type": "application/json", // Toujours mieux de le préciser
                    Authorization: `Bearer ${session.access_token}`,
                },
            },
        );

        if (!res.ok) {
            // On essaie de récupérer le message d'erreur du backend si dispo
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Erreur suppression compte");
        }

        return true;
    } catch (err) {
        console.error("Delete account error:", err);
        throw err;
    }
}
