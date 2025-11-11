import { supabase } from "../../../utils/supabase";
import { AnnouncementWithUser } from "../../types/announcement.interface";

export async function getAllAnnouncementFavorite(): Promise<
    AnnouncementWithUser[]
> {
    // Récupération de la session utilisateur
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const userId = sessionData?.session?.user?.id;
    if (!userId) return [];

    // 1️⃣ Récupère les annonces marquées comme favorite pour cet utilisateur
    const { data: userAnnonces, error: errorUserAnnonces } = await supabase
        .from("user_annonces")
        .select("annonce_id")
        .eq("user_id", userId)
        .eq("favorite", true);

    if (errorUserAnnonces) {
        console.error(
            "Error fetching favorite announcement ids:",
            errorUserAnnonces
        );
        throw errorUserAnnonces;
    }

    // Si aucun favori, on renvoie un tableau vide directement
    if (!userAnnonces || userAnnonces.length === 0) return [];

    // 2️⃣ Récupère toutes les annonces correspondantes avec les données utilisateur liées
    const { data: annonces, error } = await supabase
        .from("annonces")
        .select(
            `
      id,
      title,
      content,
      date_start,
      date_end,
      number_of_places,
      user_id,
      users:users (
        firstname,
        image_profile,
        contract,
        team,
        city,
        fc:fc_id (
          name
        )
      )
    `
        )
        .in(
            "id",
            userAnnonces.map((ua) => ua.annonce_id)
        );

    if (error) {
        console.error("Error fetching favorite announcements:", error);
        throw error;
    }

    console.log("✅ Annonces favorites récupérées :", annonces);
    return annonces ?? [];
}
