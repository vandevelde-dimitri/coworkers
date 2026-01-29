import { supabase } from "../../../utils/supabase";
import {
    AnnonceDetail,
    ParticipantRequest,
} from "../../types/announcement.interface";

export async function getAnnouncementById(
    annonce_id: string,
): Promise<AnnonceDetail> {
    try {
        // 🔒 Récupération session
        const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
            throw new Error("Utilisateur non authentifié");
        }
        const userId = sessionData.session.user.id;

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
            console.error("Erreur récupération annonce :", error);
            throw error ?? new Error("Annonce introuvable");
        }

        // 🔎 Cherche la candidature de l'utilisateur connecté
        const myRequest = annonce.participant_requests.find(
            (r: ParticipantRequest) => r.user_id === userId,
        );

        console.log("annonce => ", JSON.stringify(annonce, null, 3));

        return { ...annonce, myStatus: myRequest?.status ?? null };
    } catch (err) {
        console.error("getAnnouncementById error:", err);
        throw err; // laisse la mutation ou le composant gérer l'erreur
    }
}
