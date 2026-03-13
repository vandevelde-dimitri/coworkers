import { IApplicationRepository } from "@/src/domain/repositories/ApplicationRepository";
import { supabase } from "../supabase";

export class SupabaseApplicationRepository implements IApplicationRepository {
  private static instance: SupabaseApplicationRepository;

  private constructor() {}

  static getInstance(): SupabaseApplicationRepository {
    if (!SupabaseApplicationRepository.instance) {
      SupabaseApplicationRepository.instance =
        new SupabaseApplicationRepository();
    }
    return SupabaseApplicationRepository.instance;
  }

  async getRequest(annonceId: string, userId: string) {
    const { data, error } = await supabase
      .from("participant_requests")
      .select("*")
      .eq("annonce_id", annonceId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async apply(annonceId: string, userId: string) {
    const { error } = await supabase.from("participant_requests").insert({
      annonce_id: annonceId,
      user_id: userId,
      status: "pending",
    });
    if (error) throw error;
  }

  async cancel(annonceId: string, userId: string) {
    const { error } = await supabase.rpc(
      "cancel_application_after_acceptance",
      {
        p_annonce_id: annonceId,
        p_user_id: userId,
      },
    );

    if (error) {
      if (__DEV__)
        console.error("Erreur lors de l'annulation de la candidature :", error);
      throw error;
    }
  }

  async getUserApplications(): Promise<any[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return [];

    const { data, error } = await supabase
      .from("participant_requests")
      .select(
        `
        id,
        status,
        created_at,
        annonces (
          id,
          title,
          number_of_places
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
