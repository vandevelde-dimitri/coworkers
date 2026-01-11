import { supabase } from "../../../utils/supabase";

export async function uploadUserAvatar(imgUri: string) {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!data?.session) throw new Error("No active session found");
    const session = data.session;

    const { data: user, error } = await supabase
        .from("users")
        .update({ image_profile: imgUri, avatar_updated_at: new Date() })
        .eq("id", session.user.id)
        .select();

    if (error) {
        console.log("Erreur mise à jour user:", error.message);
        throw error;
    }
}
