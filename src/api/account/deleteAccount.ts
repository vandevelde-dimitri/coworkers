import { supabase } from "../../../utils/supabase";

export async function deleteAccount() {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) throw new Error("Non authentifié");

    const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        },
    );

    if (!res.ok) {
        throw new Error("Erreur suppression compte");
    }
}
