import { supabase } from "../../../utils/supabase";
import {
    AnnonceDetail,
    ParticipantRequest,
} from "../../types/announcement.interface";

export async function getAnnouncementById(
    annonce_id: string,
): Promise<AnnonceDetail> {
    try {
        // 🔒 Récupération session (optionnelle pour le mode invité)
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id ?? null;

        // 🔒 Récupération annonce + relations
        const { data: annonce, error } = await supabase
            .from("annonces")
            .select(
                `
        *,
        owner:users (
            id, firstname, image_profile, city, avatar_updated_at, contract,
            settings:settings!user_id (to_convey)
        ),
        participant_requests (
            id,
            status,
            user_id,
            users (
                id, firstname, image_profile, city, avatar_updated_at, contract,
                settings:settings!user_id (to_convey)
            )
        )
    `,
            )
            .eq("id", annonce_id)
            .single();

        if (error || !annonce) {
            if (__DEV__) console.error("Erreur récupération annonce :", error);
            throw error ?? new Error("Annonce introuvable");
        }

        // 🔎 Cherche la candidature de l'utilisateur connecté (null si invité)
        const myRequest = userId
            ? annonce.participant_requests.find(
                  (r: ParticipantRequest) => r.user_id === userId,
              )
            : null;

        return { ...annonce, myStatus: myRequest?.status ?? null };
    } catch (err) {
        if (__DEV__) console.error("getAnnouncementById error:", err);
        throw err; // laisse la mutation ou le composant gérer l'erreur
    }
}
